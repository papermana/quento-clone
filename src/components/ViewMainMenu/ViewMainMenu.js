const React = require('react');
const {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} = require('react-native');
const consts = require('@src/constants');
const actionCreators = require('@src/actionCreators');
const MyText = require('@components/MyText');


class ViewMainMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.nextState) {
      actionCreators.endTransition();
    }
  }

  render() {
    return <View style={[consts.STYLES.SCENE_CONTAINER, styles.container]} >

      <View style={styles.logoWrapper} >
        <MyText style={styles.logoText} >
          {'Quento\nClone'}
        </MyText>
      </View>

      <View style={styles.spacing} />

      <TouchableOpacity style={styles.playButton}
        activeOpacity={0.5}
        onPress={() => actionCreators.playTheGame()} >
        <View>
          <MyText style={styles.playText} >
            Press to play
          </MyText>
        </View>
      </TouchableOpacity>

    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'orange',
    backgroundColor: consts.MAINMENU_BACKGROUNDCOLOR,
  },
  logoWrapper: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 72,
  },
  playButton: {
    padding: 32,
  },
  playText: {
    fontSize: 48,
    color: 'rgba(0,0,0,0.8)',
  },
  spacing: {
    height: 100,
  },
});

module.exports = ViewMainMenu;
