const React = require('react');
const {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
} = require('react-native');
const consts = require('@src/constants');
const MyText = require('@components/MyText');


const _config = {
  defaultVerticalOffset: -200,
};

class PathDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayText: '',
      isShown: false,
      translateValue: new Animated.Value(_config.defaultVerticalOffset),
    };
  }

  componentWillReceiveProps(nextProps) {
    const path = nextProps.model.board.get('selectedPath')
    .map(position => {
      return nextProps.model.board.getIn(['currentBoard', 'boardLayout', position]);
    });
    let displayText;

    if (path.size > 0) {
      displayText = path.join(' ');
    }
    else {
      displayText = '';
    }

    if (displayText !== '' && !this.state.isShown) {
      this.showAnimation();

      this.setState({
        isShown: true,
      });
    }
    else if (displayText === '' && this.state.isShown) {
      this.hideAnimation();

      this.setState({
        isShown: false,
      });
    }

    this.setState({
      displayText,
    });
  }

  hideAnimation() {
    Animated.timing(this.state.translateValue, {
      toValue: _config.defaultVerticalOffset,
      duration: 300,
    }).start();
  }

  showAnimation() {
    Animated.timing(this.state.translateValue, {
      toValue: 0,
      duration: 300,
    }).start();
  }

  render() {
    const customStyles = {
      wrapper: {
        top: this.state.translateValue,
      },
      container: {
        marginLeft: (Dimensions.get('window').width - 250) / 2,
      },
    };

    return <Animated.View style={[styles.wrapper, customStyles.wrapper]} >
      <View style={[styles.container, customStyles.container, styles.containerShadow]} />
      <View style={[styles.container, customStyles.container]} >
        <MyText style={styles.text} xmedium >
          {this.state.displayText}
        </MyText>
      </View>
    </Animated.View>;
  }
}

PathDisplay.propTypes = {
  model: consts.PROPTYPES.MODEL.isRequired,
};


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: 48,
    marginTop: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  containerShadow: {
    backgroundColor: consts.SHADOW_COLOR,
    transform: [{translate: [4, 4]}],
  },
});


module.exports = PathDisplay;
