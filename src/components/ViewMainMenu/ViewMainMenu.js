const React = require('react');
const {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} = require('react-native');
const consts = require('@src/constants');


class ViewMainMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <View style={[consts.STYLES.SCENE_CONTAINER, styles.container]} >
      <View style={styles.innerWrapper} >

        <View style={styles.logoWrapper} >
          <Text style={styles.logoText} >
            {'Quento\nClone'}
          </Text>
        </View>

        <View style={styles.spacing} />

        <TouchableOpacity style={styles.playButton}
          activeOpacity={0.5} >
          <View>
            <Text style={styles.playText} >
              Press to play
            </Text>
          </View>
        </TouchableOpacity>

      </View>
    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'orange',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 72,
    color: 'rgba(0,0,0,0.9)',
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
