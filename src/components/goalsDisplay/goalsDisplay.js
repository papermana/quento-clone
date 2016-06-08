const React = require('react');
const {
  Image,
  StyleSheet,
  Text,
  View,
} = require('react-native');
const consts = require('@src/constants');
const actionCreators = require('@src/actionCreators');


function PreStar(props) {
  return <View style={styles.preStar} />;
}


class Stars extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const challenges = this.props.model.state.get('challenges');
    const stars = challenges && challenges.get(this.props.challengeId)
    .map((challengeCompleted, key) => {
      if (challengeCompleted) {
        return <Image key={key}
          style={styles.star}
          source={require('./ic_star_white.png')} />;
      }
      else {
        return <PreStar key={key} />;
      }
    });

    return <View style={styles.starsWrapper} >
      {stars}
    </View>;
  }
}

Stars.propTypes = {
  model: consts.PROPTYPES.MODEL.isRequired,
  challengeId: React.PropTypes.number.isRequired,
};


class Goal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const challenge = this.props.model.board.getIn(['currentBoard', 'challenges', this.props.challengeId]);
    let length = challenge.get('length');

    length = length === 3 ? 2 : (length === 5 ? 3 : 0);

    return <View style={styles.goal} >
      <Text style={styles.textSum} >
        {challenge.get('solutions').last().get('sum')}
      </Text>
      <Text style={styles.textLength} >
        {length + ' numbers'}
      </Text>
      <Stars challengeId={this.props.challengeId}
        model={this.props.model} />
    </View>;
  }
}

Goal.propTypes = {
  model: consts.PROPTYPES.MODEL.isRequired,
  challengeId: React.PropTypes.number.isRequired,
};


class GoalsDisplay extends React.Component {
  constructor(props) {
    super(props);

    actionCreators.prepareChallenges(this.props.model.board.getIn(['currentBoard', 'challenges']));
  }

  render() {
    const goals = this.props.model.board.getIn(['currentBoard', 'challenges'])
    .map((value, key) => <Goal key={key} challengeId={key} model={this.props.model} />);

    return <View style={styles.goalWrapper} >
      {goals}
    </View>;
  }
}

GoalsDisplay.propTypes = {
  model: consts.PROPTYPES.MODEL.isRequired,
};


const styles = StyleSheet.create({
  goalWrapper: {
    flexDirection: 'row',
  },
  goal: {
    width: 100,
    alignItems: 'center',
  },
  textSum: {
    fontSize: 32,
    color: 'rgba(0,0,0,0.9)',
  },
  textLength: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.9)',
  },
  starsWrapper: {
    flexDirection: 'row',
  },
  preStar: {
    width: 6,
    height: 6,
    margin: 14,
    borderRadius: 3,
    backgroundColor: 'rgba(128,128,128,0.55)',
  },
});


module.exports = GoalsDisplay;
