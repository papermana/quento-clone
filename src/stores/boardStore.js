const {
  ReduceStore,
} = require('flux/utils');
const Immutable = require('immutable');
const Dispatcher = require('@src/dispatcher');
const utils = require('@stores/boardStoreUtils');


class BoardStore extends ReduceStore {
  getInitialState() {
    const state = Immutable.fromJS({
      ready: true,
    })
    .mergeDeep(utils.createNewBoard());

    return state;
  }

  reduce(state, action) {
    return state;
  }
}


module.exports = new BoardStore(Dispatcher);
