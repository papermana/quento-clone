const React = require('react');
const {
  Container,
} = require('flux/utils');
const AppUI = require('@components/AppUI');
const StateStore = require('@stores/StateStore');
const BoardStore = require('@stores/BoardStore');


function isStoreReady(store, property) {
  const state = store.getState();

  if (!state.get('ready')) {
    return undefined;
  }

  if (property) {
    return state.get('property');
  }
  else {
    return state.remove('ready');
  }
}


class AppContainer extends React.Component {
  static getStores() {
    return [
      StateStore,
      BoardStore,
    ];
  }

  static calculateState(prevState) {
    return {
      state: isStoreReady(StateStore),
      board: isStoreReady(BoardStore),
    };
  }

  render() {
    return <AppUI model={this.state} />;
  }
}


module.exports = Container.create(AppContainer);
