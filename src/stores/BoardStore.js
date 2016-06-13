const {
  ReduceStore,
} = require('flux/utils');
const Immutable = require('immutable');
const Dispatcher = require('@src/dispatcher');
const actionCreators = require('@src/actionCreators');
const utils = require('@stores/boardStoreUtils');
const getActiveGoal = require('@utils/getActiveGoal');


/*
  STRUCTURE OF BOARDSTORE:
  {
    currentBoard: BoardObject,
    selectedPath: [number, ..., number],
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
    if (action.type === 'goBack') {
      return state
      .set('selectedPath', Immutable.List());
    }
    else if (action.type === 'selectTile') {
      return state
      .set('selectedPath', state.get('selectedPath').push(action.data));
    }
    else if (action.type === 'deselectTile') {
      return state
      .set('selectedPath', state.get('selectedPath').setSize(action.data));
    }
    else if (action.type === 'completeChallenge') {
      state = state
      .setIn(['currentBoard', 'challenges', action.data.challengeId, 'solutions', action.data.goalId, 'completed'], true)
      .set('selectedPath', Immutable.List());

      const allCompleted = state.getIn(['currentBoard', 'challenges'])
      .every(challenge => {
        return challenge.get('solutions').every(solution => {
          return solution.get('completed');
        });
      });

      if (allCompleted) {
        setTimeout(() => actionCreators.winTheGame(), 500);
      }

      return state;
    }
    else if (action.type === 'winTheGame') {
      return state
      .set('currentBoard', utils.createNewBoard());
    }
    else {
      return state;
    }
  }
}


module.exports = new BoardStore(Dispatcher);
