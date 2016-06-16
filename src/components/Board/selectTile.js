//  TO DO: add tests

const actionCreators = require('@src/actionCreators');
const utils = require('@stores/boardStoreUtils');
const getActiveGoal = require('@utils/getActiveGoal');


function selectTile(boardModel, tileId, touchObject, doOnRelease) {
  const maxPathLength = boardModel.getIn(['currentBoard', 'challenges'])
  .max((chalA, chalB) => chalA.get('length') - chalB.get('length'))
  .get('length');
  const selectedPathPositions = boardModel.get('selectedPath');
  const selectedPathValues = selectedPathPositions
  .map(position => boardModel.getIn(['currentBoard', 'boardLayout']).get(position));
  const tileValue = boardModel.getIn(['currentBoard', 'boardLayout']).get(tileId);

  //  If the only (and therefore first) value is an operator, do nothing:
  if (selectedPathValues.size === 0) {
    if (utils.isOperator(tileValue)) {
      return;
    }
  }

  //  If the new position already has been selected, clear the selected path up to, but excluding, that position:
  if (selectedPathPositions.includes(tileId)) {
    const lastOccurence = selectedPathPositions
    .keyOf(tileId);

    const action = () => {
      if (lastOccurence < selectedPathPositions.size - 1) {
        actionCreators.deselectTile(lastOccurence + 1);
      }
      else {
        actionCreators.deselectTile(lastOccurence);
      }
    };

    if (touchObject.swipe) {
      action();
    }
    else {
      doOnRelease(action);
    }

    return;
  }

  // If the new position represents an invalid move, do nothing:
  if (selectedPathPositions.size > 0) {
    const lastPosition = selectedPathPositions.last();
    const possibleMoves = utils.possibleMoves(lastPosition);
    const isValidMove = possibleMoves.some(move => {
      return lastPosition + move === tileId;
    });

    if (!isValidMove) {
      return;
    }
  }

  //  Calculate the sum of the path values. Compare that sum to the sum of the last solution from the challenge of the same length as the selected path.
  if (!utils.isOperator(tileValue)) {
    const relevantChallenge = boardModel.getIn(['currentBoard', 'challenges'])
    .find(challenge => challenge.get('length') === selectedPathValues.size + 1);

    if (relevantChallenge) {
      const goal = getActiveGoal(relevantChallenge);

      if (goal) {
        let sum;

        if (selectedPathValues.size === 0) {
          sum = tileValue;
        }
        else {
          sum = utils.generateSum(selectedPathValues.push(tileValue).toJS());
        }

        if (sum === goal.get('sum')) {
          actionCreators.completeChallenge({
            challengeId: relevantChallenge.get('id'),
            goalId: goal.get('id'),
          });

          return;
        }
      }
    }
  }

  //  If the new path doesn't fit any challenge but is as long as the longest challenge, clear it:
  if (selectedPathPositions.size >= maxPathLength) {
    actionCreators.deselectTile(0);

    return;
  }

  //  If no other condition applies, simply select the tile:
  actionCreators.selectTile(tileId);
}


module.exports = selectTile;
