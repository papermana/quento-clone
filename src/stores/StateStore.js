const {
  ReduceStore,
} = require('flux/utils');
const Immutable = require('immutable');
const Random = require('random-js');
const Dispatcher = require('@src/dispatcher');
const routes = require('@src/routes');
const consts = require('@src/constants');


const getBackgroundColor = (() => {
  const r = new Random(Random.engines.mt19937().autoSeed());
  const defaultColors = Immutable.fromJS(consts.BACKGROUNDCOLORS);
  let colors = defaultColors;

  return function getBackgroundColor() {
    const selectedColorId = r.integer(0, colors.size - 1);
    const selectedColor = colors.get(selectedColorId);

    colors = colors.remove(selectedColorId);

    if (colors.size === 0) {
      colors = defaultColors;
    }

    return selectedColor;
  };
})();


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
    else {
      return state;
    }
  }
}


module.exports = new StateStore(Dispatcher);
