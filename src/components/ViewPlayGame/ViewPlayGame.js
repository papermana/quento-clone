const React = require('react');
const {
  Animated,
  Dimensions,
  Easing,
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
      easing: Easing.inOut(Easing.cubic),
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
    const screenDiagonal = Math.sqrt(Math.pow(screenHeight, 2) + Math.pow(screenWidth / 2, 2));
    const rippleScale = this.state.bgColorRippleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.00000001, 1],
    });

    const customStyles = {
      container: {
        backgroundColor: this.state.currentBgColor,
      },
      bgColorRipple: {
        position: 'absolute',
        bottom: -screenDiagonal,
        left: -screenDiagonal + screenWidth / 2,
        width: screenDiagonal * 2,
        height: screenDiagonal * 2,
        backgroundColor: this.state.nextBgColor,
        borderRadius: 1000,
        transform: [{scale: rippleScale}],
      },
    };

    return <View style={[consts.STYLES.SCENE_CONTAINER, styles.container, customStyles.container]} >

      <Animated.View style={customStyles.bgColorRipple} />

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
