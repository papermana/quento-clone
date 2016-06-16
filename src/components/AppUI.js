const React = require('react');
const {
  Animated,
  BackAndroid,
  StatusBar,
  View,
} = require('react-native');
const consts = require('@src/constants');
const actionCreators = require('@src/actionCreators');


class AppUI extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasAppeared: false,
      containerOpacity: new Animated.Value(0),
    };
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      actionCreators.goBack();

      if (this.props.model.state.get('navStack').size > 1) {
        return true;
      }
      else {
        return false;
      }
    });
  }

  componentWillUpdate(nextProps, nextState) {
    if (!nextState.hasAppeared) {
      Animated.timing(nextState.containerOpacity, {
        toValue: 1,
        duration: 200,
      }).start(() => {
        this.setState({
          hasAppeared: true,
        });
      });
    }
  }

  render() {
    const CurrentView = this.props.model.state.get('navStack').last();

    const styles = {
      container: {
        opacity: this.state.containerOpacity,
      },
      view: {
        flex: 1,
      },
    };

    return <Animated.View style={[consts.STYLES.APP_CONTAINER, styles.container]} >
      <StatusBar
        backgroundColor="rgba(0,0,0,0.2)"
        translucent />
      <View style={styles.view} >
        <CurrentView.component
          model={this.props.model} />
      </View>
    </Animated.View>;
  }
}

AppUI.propTypes = {
  model: consts.PROPTYPES.MODEL.isRequired,
};


module.exports = AppUI;
