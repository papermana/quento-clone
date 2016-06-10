const React = require('react');
const {
  StyleSheet,
  Text,
  View,
} = require('react-native');
const consts = require('@src/constants');
const actionCreators = require('@src/actionCreators');
const MyText = require('@components/MyText');
const Board = require('@components/Board');
const GoalsDisplay = require('@components/GoalsDisplay');
const PathDisplay = require('@components/PathDisplay');


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
    const customStyles = {
      container: {
        backgroundColor: this.props.model.state.get('backgroundColor'),
      },
    };

    return <View style={[consts.STYLES.SCENE_CONTAINER, styles.container, customStyles.container]} >

      <View style={styles.optionsWrapper} >

      </View>

      <View style={styles.logoWrapper} >
        <MyText style={styles.logoText} >
          {'Quento\nClone'}
        </MyText>
      </View>

      <View style={styles.goalsWrapper} >
        <GoalsDisplay model={this.props.model} />
      </View>

      <View style={styles.boardWrapper} >
        <Board model={this.props.model} />
      </View>

      <View style={styles.pathDisplayWrapper} >
        <PathDisplay model={this.props.model} />
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
    color: 'rgba(0,0,0,0.75)',
  },
  pathDisplayWrapper: {
    position: 'absolute',
    top: consts.STATUSBAR_HEIGHT,
    left: 0,
  },
});


module.exports = ViewPlayGame;
