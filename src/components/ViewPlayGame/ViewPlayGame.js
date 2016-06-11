const React = require('react');
const {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
} = require('react-native');
const consts = require('@src/constants');
const actionCreators = require('@src/actionCreators');
const MyText = require('@components/MyText');
const Board = require('@components/Board');
const GoalsDisplay = require('@components/GoalsDisplay');
const PathDisplay = require('@components/PathDisplay');


class ViewPlayGame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentBgColor: props.model.state.get('backgroundColor'),
      nextBgColor: undefined,
      bgColorRippleAnim: new Animated.Value(0),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.nextState) {
      actionCreators.endTransition();

      return;
    }

    if (!this.state.nextBgColor && this.props.model.state.get('backgroundColor') !== nextProps.model.state.get('backgroundColor')) {

      this.setState({
        nextBgColor: nextProps.model.state.get('backgroundColor'),
      }, () => {
        this.animateBackgroundColorRipple();
      });
    }
  }

  animateBackgroundColorRipple() {
    Animated.timing(this.state.bgColorRippleAnim, {
      toValue: 1,
      duration: 2000,
    }).start(() => {
      this.setState({
        currentBgColor: this.state.nextBgColor,
        nextBgColor: undefined,
      }, () => {
        this.state.bgColorRippleAnim.setValue(0);
      });
    });
  }

  render() {
    const {height: screenHeight, width: screenWidth} = Dimensions.get('window');
    const longerEdge = screenHeight > screenWidth ? screenHeight : screenWidth;
    const rippleSize = this.state.bgColorRippleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.1, longerEdge * 1.41 * 2],
    });
    const rippleOffsetY = this.state.bgColorRippleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -1 * longerEdge * 1.41],
    });
    const rippleOffsetX = this.state.bgColorRippleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [screenWidth / 2, -1 * longerEdge * 1.41 + screenWidth / 2],
    });

    const customStyles = {
      container: {
        backgroundColor: this.state.currentBgColor,
      },
      backgroundColorRipple: {
        position: 'absolute',
        bottom: rippleOffsetY,
        left: rippleOffsetX,
        width: rippleSize,
        height: rippleSize,
        backgroundColor: this.state.nextBgColor,
        borderRadius: 1000,
      },
    };

    return <View style={[consts.STYLES.SCENE_CONTAINER, styles.container, customStyles.container]} >

      <Animated.View style={customStyles.backgroundColorRipple} />

      <View style={styles.optionsWrapper} >

      </View>

      <View style={styles.logoWrapper} >
        <MyText style={styles.logoText} large logo >
          {'Quento\nClone'}
        </MyText>
      </View>

      <View style={styles.goalsWrapper} >
        <GoalsDisplay model={this.props.model} />
      </View>

      <View style={styles.boardWrapper} >
        <Board model={this.props.model} />
      </View>

      <View style={styles.pathDisplayWrapper} >
        <PathDisplay model={this.props.model} />
      </View>

    </View>;
  }
}

ViewPlayGame.propTypes = {
  model: consts.PROPTYPES.MODEL.isRequired,
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'purple',
  },
  pathDisplayWrapper: {
    position: 'absolute',
    top: consts.STATUSBAR_HEIGHT,
    left: 0,
  },
});


module.exports = ViewPlayGame;
