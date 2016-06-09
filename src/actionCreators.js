const Dispatcher = require('@src/dispatcher.js');


function createAction(name) {
  actionCreators[name] = data => {
    setTimeout(() => {
      Dispatcher.dispatch({
        type: name,
        data,
      });
    }, 0);
  };
}

const actionCreators = {};

[
  'goBack',
  'endTransition',
  'playTheGame',
  'selectTile',
]
.forEach(string => createAction(string));


module.exports = actionCreators;
