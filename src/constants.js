const React = require('react');
const {
  StyleSheet,
} = require('react-native');
const Immutable = require('immutable');


const IMMUTABLE_OBJECT = React.PropTypes.instanceOf(Immutable.Map);

const constants = {
  STATUSBAR_HEIGHT: 24,
  SHADOW_COLOR: 'rgba(0,0,0,0.4)',
  BOARD_PADDING: 20,
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

constants.MAINMENU_BACKGROUNDCOLOR = 'rgb(255,245,25)';

constants.BACKGROUNDCOLORS = [
  //  light green:
  '#6dde21',
  //  green:
  // '#46b998',
  //  turquoise:
  '#46b998',
  //  light blue:
  '#84b7b8',
  //  sky blue:
  '#2da3d2',
  //  blue:
  '#1d62e2',
  //  purple
  '#a249b6',
  //  fuchsia:
  '#f391e2',
  //  pink:
  '#f00f69',
  //  red
  '#c74638',
  //  yellow:
  '#f4dc0b',
];


module.exports = constants;
