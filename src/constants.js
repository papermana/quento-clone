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
  '#93c7ec',
  //  turquoise:
  '#93ecdc',
  //  blueish green:
  '#93ecc2',
  //  green:
  '#93ec99',
  //  yellowish green:
  '#caec93',
  //  light brown:
  '#ecbb93',
  //  red:
  '#ec9393',
  //  pink:
  '#ec93bb',
  //  fuchsia:
  '#ec93dd',
  //  purple:
  '#c593ec',
];


module.exports = constants;
