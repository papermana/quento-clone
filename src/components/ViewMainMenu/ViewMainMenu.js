const React = require('react');
const {
  View,
} = require('react-native');
const consts = require('@src/constants');


class ViewMainMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <View style={[consts.STYLES.SCENE_CONTAINER, styles.container]} />
  }
}

const styles = {
  container: {
    backgroundColor: 'orange',
  },
};

module.exports = ViewMainMenu;
