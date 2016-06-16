const React = require('react');
const {
  Image,
  StyleSheet,
  TouchableHighlight,
  View,
} = require('react-native');
const consts = require('@src/constants');
const actionCreators = require('@src/actionCreators');


function SoundControl(props) {
  const source = props.model.state.getIn(['config', 'soundOn'])
    ? require('./ic_volume_up.png')
    : require('./ic_volume_off.png');

  return <TouchableHighlight
    underlayColor={'rgba(0,0,0,0.1)'}
    onPress={() => {
      if (this.props.model.state.getIn(['config', 'soundOn'])) {
        actionCreators.turnSoundOff();
      }
      else {
        actionCreators.turnSoundOn();
      }
    }} >
    <View>
      <Image source={source} style={styles.image} />
    </View>
  </TouchableHighlight>;
}

SoundControl.propTypes = {
  model: consts.PROPTYPES.MODEL.isRequired,
};


const styles = StyleSheet.create({
  image: {
    width: 24,
    height: 24,
    margin: 6,
    opacity: 0.45,
  },
});


module.exports = SoundControl;
