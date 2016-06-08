const {
  ReduceStore,
} = require('flux/utils');
const Immutable = require('immutable');
const Dispatcher = require('@src/dispatcher');
const utils = require('@stores/boardStoreUtils');


/*
  STRUCTURE OF BOARDSTORE:
  {
    currentBoard: BoardObject,
    nextBoard: undefined or BoardObject,
    ready: boolean [ommited in model],
  }

  BoardObject: {
    boardLayout: [number, '+', number, '-', number, '-', number, '+', number],
    challenges: [
      {
        length: 3,
        solutions: [SolutionObject, SolutionObject, SolutionObject],
      },
      {
        length: 5,
        solutions: [SolutionObject, SolutionObject, SolutionObject],
      },
    ],
  }

  SolutionObject: {
    sum: number,
    path: [number, ..., number],
  }
*/

class BoardStore extends ReduceStore {
  getInitialState() {
    const state = Immutable.fromJS({
      currentBoard: utils.createNewBoard(),
      ready: true,
    });

    return state;
  }

  reduce(state, action) {
    return state;
  }
}


module.exports = new BoardStore(Dispatcher);
