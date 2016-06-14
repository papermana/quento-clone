const React = require('react');
const {
  StyleSheet,
} = require('react-native');
const Immutable = require('immutable');


const IMMUTABLE_OBJECT = React.PropTypes.instanceOf(Immutable.Map);

const constants = {
  STATUSBAR_HEIGHT: 24,
  SHADOW_COLOR: 'rgba(0,0,0,0.4)',
};

constants.PROPTYPES = {
  MODEL: React.PropTypes.shape({
    state: IMMUTABLE_OBJECT,
    board: IMMUTABLE_OBJECT,
  }),
  // StyleSheet.create returns id as a number:
  STYLE: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.object,
    React.PropTypes.number,
  ]),
  CHILDREN: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node,
  ]),
  IMMUTABLE_OBJECT,
  IMMUTABLE_LIST: React.PropTypes.instanceOf(Immutable.List),
  ROUTE: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    component: React.PropTypes.oneOfType([
      React.PropTypes.instanceOf(React.Component),
      React.PropTypes.func,
    ]).isRequired,
  }),
};

constants.STYLES = StyleSheet.create({
  APP_CONTAINER: {
    flex: 1,
  },
  SCENE_CONTAINER: {
    flex: 1,
    paddingTop: constants.STATUSBAR_HEIGHT,
    backgroundColor: constants.BACKGROUND_COLOR,
  },
});

constants.MAINMENU_BACKGROUNDCOLOR = '#f0ea42';

constants.BACKGROUNDCOLORS = [
  //  sky blue:
  '#b8def9',
  //  turquoise:
  '#b8f9ed',
  //  blueish green:
  '#b8f9db',
  //  green:
  '#b8f9bd',
  //  yellowish green:
  '#e0f9b8',
  //  light brown:
  '#f9d5b8',
  //  red:
  '#f9b8b8',
  //  pink:
  '#f9b8d5',
  //  fuchsia:
  '#f9b8ee',
  //  purple:
  '#ddb8f9',
];


module.exports = constants;
