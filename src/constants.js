const React = require('react');
const {
  StyleSheet,
} = require('react-native');
const Immutable = require('immutable');


const constants = {
  STATUSBAR_HEIGHT: 24,
  PROPTYPES: {
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
    IMMUTABLE_OBJECT: React.PropTypes.instanceOf(Immutable.Map),
    ROUTE: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      component: React.PropTypes.oneOfType([
        React.PropTypes.instanceOf(React.Component),
        React.PropTypes.func,
      ]).isRequired,
    }),
  }
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


module.exports = constants;
