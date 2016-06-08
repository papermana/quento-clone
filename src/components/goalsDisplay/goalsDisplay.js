const React = require('react');
const {
  StyleSheet,
  Text,
  View,
} = require('react-native');
const consts = require('@src/constants');


class PreStar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <View style={styles.preStar} />;
  }
}


class Stars extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <View style={styles.starsWrapper} >
      <PreStar />
      <PreStar />
      <PreStar />
    </View>;
  }
}


class Goal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let length = this.props.challenge.get('length');

    length = length === 3 ? 2 : (length === 5 ? 3 : 0);

    return <View style={styles.goal} >
      <Text style={styles.textSum} >
        {this.props.challenge.get('solutions').last().get('sum')}
      </Text>
      <Text style={styles.textLength} >
        {length + ' numbers'}
      </Text>
      <Stars />
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
    const goals = challenges.map((challenge, key) => <Goal key={key} challenge={challenge} />);


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
