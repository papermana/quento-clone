const React = require('react');
const {
  Animated,
  StyleSheet,
  TouchableHighlight,
  View,
} = require('react-native');
const consts = require('@src/constants');
const actionCreators = require('@src/actionCreators');
const MyText = require('@components/MyText');


const BOARD_PADDING = 0;

const AnimatedTouchableHighlight = Animated.createAnimatedComponent(TouchableHighlight);


class BoardTile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isHighlighted: false,
      rotationValue: new Animated.Value(0),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.model.board.get('selectedPath').includes(this.props.tileId)) {
      this.setState({
        isHighlighted: true,
      });
    }
    else {
      this.setState({
        isHighlighted: false,
      });
    }
  }

  rotate() {
    Animated.timing(this.state.rotationValue, {
      toValue: 90,
      duration: 500,
    }).start(() => {
      this.state.rotationValue.setValue(270);

      Animated.timing(this.state.rotationValue, {
        toValue: 360,
        duration: 500,
      }).start(() => {
        this.state.rotationValue.setValue(0);
      });
    });
  }

  render() {
    const darkerShade = this.props.children === '+' || this.props.children === '-';
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
        top: (Math.floor(this.props.tileId / 3)) * 100 + BOARD_PADDING,
        left: (this.props.tileId % 3) * 100 + BOARD_PADDING,
      },
      highlight: {
        backgroundColor: 'blue',
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
        onPress={() => actionCreators.selectTile(this.props.tileId)} >
        <View style={[styles.tile, darkerShade && styles.tileDarkerShade, this.state.isHighlighted && customStyles.highlight]} >
          <MyText style={styles.tileText} >
            {this.props.children}
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


class Board extends React.Component {
  constructor(props) {
    super(props);
  }

  onPressFunc() {
    this.props.model.board.getIn(['currentBoard', 'boardLayout'])
    .forEach((value, key) => {
      setTimeout(() => this.refs['tile' + key].rotate(), key * 35);
    });
  }

  render() {
    const tiles = this.props.model.board.getIn(['currentBoard', 'boardLayout'])
    .map((value, key) => {
      return <BoardTile key={key}
        ref={'tile' + key}
        tileId={key}
        model={this.props.model} >
        {value}
      </BoardTile>;
    });

    return <View style={styles.board}
      onStartShouldSetResponder={() => true}
      onStartShouldSetResponderCapture={() => false}
      onResponderGrant={this.onPressFunc.bind(this)} >
      {tiles}
    </View>;
  }
}

Board.propTypes = {
  model: consts.PROPTYPES.MODEL.isRequired,
};


const styles = StyleSheet.create({
  board: {
    width: 300 + 2 * BOARD_PADDING,
    height: 300 + 2 * BOARD_PADDING,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
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
  tileText: {
    fontSize: 24,
  },
});


module.exports = Board;
