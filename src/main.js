const React = require('react');
const {
  Container,
} = require('flux/utils');
const AppUI = require('@components/AppUI');
const StateStore = require('@stores/stateStore');


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
    ];
  }

  static calculateState(prevState) {
    return {
      state: isStoreReady(StateStore),
    };
  }

  render() {
    return <AppUI model={this.state} />;
  }
}


module.exports = Container.create(AppContainer);
