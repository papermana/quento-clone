const {
  ReduceStore,
} = require('flux/utils');
const Immutable = require('immutable');
const Dispatcher = require('@src/dispatcher');
const routes = require('@src/routes');
const getBackgroundColorFactory = require('@utils/getBackgroundColor');


const getBackgroundColor = getBackgroundColorFactory();

function goBack(state) {
  const view = state.get('navStack').pop().last();

  return state
  .set('nextState', view)
  .set('goingBack', true);
}

function goTo(state, view) {
  if (state.get('navStack').last().name === view) {
    return state;
  }
  else {
    return state
    .set('nextState', routes[view]);
  }
}

function endTransition(state) {
  if (!state.get('nextState')) {
    return state;
  }

  if (!state.get('goingBack')) {
    return state
    .set('navStack', state.get('navStack').push(state.get('nextState')))
    .set('nextState', undefined);
  }

  if (state.get('navStack').size > 1) {
    return state
    .set('navStack', state.get('navStack').pop())
    .set('nextState', undefined)
    .set('goingBack', undefined);
  }
  else {
    return state
    .set('goingBack', undefined);
  }
}


class StateStore extends ReduceStore {
  getInitialState() {
    let state = Immutable.fromJS({
      navStack: [],
      nextState: undefined,
      goingBack: undefined,
      backgroundColor: getBackgroundColor(),
      ready: true,
    });

    state = state
    .set('navStack', state.get('navStack').push(routes[routes.default]));

    return state;
  }

  reduce(state, action) {
    if (action.type === 'goBack') {
      return goBack(state);
    }
    else if (action.type === 'endTransition') {
      return endTransition(state);
    }
    else if (action.type === 'playTheGame') {
      return goTo(state, 'ViewPlayGame');
    }
    else if (action.type === 'winTheGame') {
      return state
      .set('backgroundColor', getBackgroundColor());
    }
    else {
      return state;
    }
  }
}


module.exports = new StateStore(Dispatcher);
