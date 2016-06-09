const {
  ReduceStore,
} = require('flux/utils');
const Immutable = require('immutable');
const Dispatcher = require('@src/dispatcher');
const utils = require('@stores/boardStoreUtils');
const getActiveGoal = require('@utils/getActiveGoal');


/*
  STRUCTURE OF BOARDSTORE:
  {
    currentBoard: BoardObject,
    nextBoard: undefined or BoardObject,
    selectedPath: [],
    ready: boolean [ommited in model],
  }

  BoardObject: {
    boardLayout: [number, '+', number, '-', number, '-', number, '+', number],
    challenges: [
      {
        id: number,
        length: 3,
        solutions: [SolutionObject, SolutionObject, SolutionObject],
      },
      {
        id: number,
        length: 5,
        solutions: [SolutionObject, SolutionObject, SolutionObject],
      },
      ...
    ],
  }

  SolutionObject: {
    id: number,
    sum: number,
    path: [number, ..., number],
    completed: boolean,
  }
*/


function selectTile(state, tileId) {
  const maxLength = state
  .getIn(['currentBoard', 'challenges'])
  .reduce((length, challenge) => {
    if (challenge.get('length') > length) {
      return challenge.get('length');
    }
    else {
      return length;
    }
  }, 0);
  const selectedPathPositions = state.get('selectedPath').push(tileId);
  const selectedPathValues = selectedPathPositions
  .map(position => state.getIn(['currentBoard', 'boardLayout']).get(position));

  //  If the new position already has been selected, clear the selected path up to, and including, that position:
  if (
    selectedPathPositions.pop()
    .includes(selectedPathPositions.last())
  ) {
    const lastOccurence = selectedPathPositions.pop()
    .keyOf(selectedPathPositions.last());

    return state
    .set('selectedPath', selectedPathPositions.setSize(lastOccurence));
  }

  //  If the only (and therefore first) value is an operator, do nothing:
  if (selectedPathValues.size === 1) {
    if (utils.isOperator(selectedPathValues.last())) {
      return state;
    }
  }

  //  If the new position represents an invalid move, do nothing:
  if (selectedPathPositions.size > 1) {
    const lastPosition = selectedPathPositions.pop().last();
    const newPosition = selectedPathPositions.last();
    const possibleMoves = utils.possibleMoves(lastPosition);

    const isValidMove = possibleMoves.some(move => {
      return lastPosition + move === newPosition;
    });

    if (!isValidMove) {
      return state;
    }
  }

  //  Calculate the sum of the path values. Compare that sum to the sum of the last solution from the challenge of the same length as the selected path.
  if (!utils.isOperator(selectedPathValues.last())) {
    const relevantChallenge = state.getIn(['currentBoard', 'challenges'])
    .find(challenge => challenge.get('length') === selectedPathValues.size);

    if (relevantChallenge) {
      const goal = getActiveGoal(relevantChallenge);

      if (goal) {
        let sum;

        if (selectedPathValues.size === 1) {
          sum = selectedPathValues.last();
        }
        else {
          sum = utils.generateSum(selectedPathValues.toJS());
        }

        if (sum === goal.get('sum')) {
          return state
          .setIn(['currentBoard', 'challenges', relevantChallenge.get('id'), 'solutions', goal.get('id'), 'completed'], true)
          .set('selectedPath', Immutable.List());
        }
      }
    }
  }

  //  If the new path doesn't fit any challenge but is as long as the longest challenge, clear it:
  if (selectedPathPositions.size >= maxLength) {
    return state
    .set('selectedPath', Immutable.List());
  }

  //  If nothing else does anything, simply update `selectedPath`:
  return state
  .set('selectedPath', selectedPathPositions);
}


class BoardStore extends ReduceStore {
  getInitialState() {
    const state = Immutable.fromJS({
      currentBoard: utils.createNewBoard(),
      selectedPath: [],
      ready: true,
    });

    return state;
  }

  reduce(state, action) {
    if (action.type === 'selectTile') {
      return selectTile(state, action.data);
    }
    else {
      return state;
    }
  }
}


module.exports = new BoardStore(Dispatcher);