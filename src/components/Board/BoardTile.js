const React = require('react');
const {
  Animated,
  Easing,
  StyleSheet,
  TouchableHighlight,
  View,
} = require('react-native');
const consts = require('@src/constants');
const MyText = require('@components/MyText');


const AnimatedTouchableHighlight = Animated.createAnimatedComponent(TouchableHighlight);


class BoardTile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isHighlighted: false,
      highlightColor: undefined,
      rotationValue: new Animated.Value(0),
      currentContent: this.props.children,
      nextContent: undefined,
    };
  }

  componentWillReceiveProps(nextProps) {
    //  Because sometimes the content won't change between different board layouts, this will only happen sometimes on "victory", but not in every case:
    if (!this.state.nextContent && nextProps.children !== this.props.children) {
      this.setState({
        nextContent: nextProps.children,
      });
    }

    if (nextProps.model.board.get('selectedPath').includes(this.props.tileId)) {
      const key = nextProps.model.board.get('selectedPath').keyOf(this.props.tileId);

      this.setState({
        isHighlighted: true,
        highlightColor: this.getHighlightColor(key),
      });
    }
    else {
      this.setState({
        isHighlighted: false,
      });
    }
  }

  getHighlightColor(id) {
    return 'rgba(80,80,225,' + (1 - 0.05 * id) + ')';
  }

  rotate() {
    Animated.timing(this.state.rotationValue, {
      toValue: 90,
      duration: 500,
      easing: Easing.in(Easing.sin),
    }).start(() => {
      if (this.state.nextContent) {
        this.setState({
          currentContent: this.state.nextContent,
          nextContent: undefined,
        });
      }

      this.state.rotationValue.setValue(270);

      Animated.timing(this.state.rotationValue, {
        toValue: 360,
        duration: 500,
        easing: Easing.out(Easing.sin),
      }).start(() => {
        this.state.rotationValue.setValue(0);
      });
    });
  }

  render() {
    const darkerShade = this.state.currentContent === '+' || this.state.currentContent === '-';
    const rotateTransform = {
      rotateY: this.state.rotationValue.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg'],
      }),
    };
    const shadowTranslateInterpolation = this.state.rotationValue.interpolate({
      inputRange: [0, 90, 270, 360],
      outputRange: [5, 0, 0, 5],
    });

    const customStyles = {
      tileWrapper: {
        position: 'absolute',
        top: (Math.floor(this.props.tileId / 3)) * 100 + consts.BOARD_PADDING,
        left: (this.props.tileId % 3) * 100 + consts.BOARD_PADDING,
      },
      highlight: {
        backgroundColor: this.state.highlightColor,
      },
      tileAnimation: {
        transform: [rotateTransform],
      },
      tileShadowAnimation: {
        transform: [
          {translateX: shadowTranslateInterpolation},
          {translateY: 5},
          rotateTransform,
        ],
      },
    };

    return <View style={[styles.tileWrapper, customStyles.tileWrapper]} >
      <Animated.View style={[styles.tile, styles.tileShadow, customStyles.tileShadowAnimation]} />
      <AnimatedTouchableHighlight
        underlayColor="rgb(0,0,0)"
        activeOpacity={0.9}
        delayPressIn={0}
        delayPressOut={0}
        style={[styles.tile, customStyles.tileAnimation]}
        onPress={() => {}} >
        <View style={[styles.tile, darkerShade && styles.tileDarkerShade, this.state.isHighlighted && customStyles.highlight]} >
          <MyText style={styles.tileText} medium >
            {this.state.currentContent}
          </MyText>
        </View>
      </AnimatedTouchableHighlight>
    </View>;
  }
}

BoardTile.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string,
  ]).isRequired,
  tileId: React.PropTypes.number.isRequired,
  model: consts.PROPTYPES.MODEL.isRequired,
};


const styles = StyleSheet.create({
  tile: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  tileDarkerShade: {
    backgroundColor: 'rgb(245,245,245)',
  },
  tileShadow: {
    backgroundColor: consts.SHADOW_COLOR,
  },
});


module.exports = BoardTile;
