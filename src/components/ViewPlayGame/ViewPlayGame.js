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
        <Text>{'Quento\nClone'}</Text>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'purple',
  },
});


module.exports = ViewPlayGame;
