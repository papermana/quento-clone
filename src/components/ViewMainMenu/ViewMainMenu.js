const React = require('react');
const {
  StyleSheet,
  TouchableOpacity,
  View,
} = require('react-native');
const consts = require('@src/constants');
const actionCreators = require('@src/actionCreators');
const MyText = require('@components/MyText');


function ViewMainMenu(props) {
  return <View style={[consts.STYLES.SCENE_CONTAINER, styles.container]} >
    <View style={styles.logoWrapper} >
      <MyText xlarge logo style={styles.logoText} >
        {'Quento\nClone'}
      </MyText>
    </View>
    <View style={styles.spacing} />
    <TouchableOpacity style={styles.playButton}
      activeOpacity={0.5}
      onPress={() => actionCreators.playTheGame()} >
      <View>
        <MyText large style={styles.playText} >
          Press to play
        </MyText>
      </View>
    </TouchableOpacity>
  </View>;
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: consts.MAINMENU_BACKGROUNDCOLOR,
  },
  logoWrapper: {
    alignItems: 'center',
  },
  playButton: {
    padding: 32,
  },
  spacing: {
    height: 100,
  },
});


module.exports = ViewMainMenu;
