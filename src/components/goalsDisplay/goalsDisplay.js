const React = require('react');
const {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = require('react-native');
const consts = require('@src/constants');


class Goal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let length = this.props.challenge.get('length');

    length = length === 3 ? 2 : (length === 5 ? 3 : 0);

    return <View>
      <Text>{length}</Text>
    </View>;
  }
}

Goal.propTypes = {
  challenge: consts.PROPTYPES.IMMUTABLE_OBJECT.isRequired,
};


class GoalsDisplay extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const challenges = this.props.model.board.getIn(['currentBoard', 'challenges']);
    const goals = challenges.map((value, key) => <Goal key={key} challenge={value} />);


    return <View>
      {goals}
    </View>;
  }
}

GoalsDisplay.propTypes = {
  model: consts.PROPTYPES.MODEL.isRequired,
};


module.exports = GoalsDisplay;
