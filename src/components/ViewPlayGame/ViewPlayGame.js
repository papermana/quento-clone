const React = require('react');
const {
  StyleSheet,
  Text,
  View,
} = require('react-native');
const consts = require('@src/constants');
const actionCreators = require('@src/actionCreators');
const Board = require('@components/board');
const GoalsDisplay = require('@components/goalsDisplay');


class ViewPlayGame extends React.Component {
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

      <View style={styles.optionsWrapper} >

      </View>

      <View style={styles.logoWrapper} >
        <Text style={styles.logoText} >
          {'Quento\nClone'}
        </Text>
      </View>

      <View style={styles.goalsWrapper} >
        <GoalsDisplay model={this.props.model} />
      </View>

      <View style={styles.boardWrapper} >
        <Board model={this.props.model} />
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
  logoText: {
    fontSize: 48,
  },
});


module.exports = ViewPlayGame;
