const {
  ReduceStore,
} = require('flux/utils');
const {
  AsyncStorage,
  Vibration,
} = require('react-native');
const Immutable = require('immutable');
const Dispatcher = require('@src/dispatcher');
const routes = require('@src/routes');
const getBackgroundColorFactory = require('@utils/getBackgroundColor');
const Sound = require('react-native-sound');
const actionCreators = require('@src/actionCreators');


const getBackgroundColor = getBackgroundColorFactory();

const selectTileSound = new Sound('select_tile_sound.ogg', Sound.MAIN_BUNDLE);

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

function getConfig() {
  AsyncStorage.getItem('config')
  .then(result => {
    if (result === null) {
      return;
    }

    actionCreators.readConfig(JSON.parse(result));
  });
}

function saveConfig(state) {
  AsyncStorage.setItem('config', JSON.stringify(state.get('config').toJS()));
}


class StateStore extends ReduceStore {
  getInitialState() {
    let state = Immutable.fromJS({
      navStack: [],
      nextState: undefined,
      goingBack: undefined,
      backgroundColor: getBackgroundColor(),
      config: {
        soundOn: true,
      },
      ready: true,
    });

    state = state
    .set('navStack', state.get('navStack').push(routes[routes.default]));

    getConfig();

    return state;
  }

  reduce(state, action) {
    if (action.type === 'readConfig') {
      return state
      .set('config', Immutable.fromJS(action.data));
    }
    else if (action.type === 'goBack') {
      return goBack(state);
    }
    else if (action.type === 'endTransition') {
      return endTransition(state);
    }
    else if (action.type === 'playTheGame') {
      return goTo(state, 'ViewPlayGame');
    }
    else if (action.type === 'selectTile') {
      if (state.getIn(['config', 'soundOn'])) {
        selectTileSound.play();
      }

      return state;
    }
    else if (action.type === 'completeChallenge') {
      Vibration.vibrate([0, 15]);

      return state;
    }
    else if (action.type === 'winTheGame') {
      return state
      .set('backgroundColor', getBackgroundColor());
    }
    else if (action.type === 'turnSoundOff') {
      state = state
      .setIn(['config', 'soundOn'], false);

      saveConfig(state);

      return state;
    }
    else if (action.type === 'turnSoundOn') {
      state = state
      .setIn(['config', 'soundOn'], true);

      saveConfig(state);

      return state;
    }
    else {
      return state;
    }
  }
}


module.exports = new StateStore(Dispatcher);
