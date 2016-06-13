const React = require('react');
const {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} = require('react-native');
const consts = require('@src/constants');
const actionCreators = require('@src/actionCreators');
const getActiveGoal = require('@utils/getActiveGoal');
const MyText = require('@components/MyText');


function PreStar(props) {
  return <View style={styles.preStar} />;
}


class Star extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      completed: this.props.solution.get('completed'),
      nextCompleted: undefined,
      scaleValue: new Animated.Value(1),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.solution.get('id') !== nextProps.solution.get('id')) {
      this.state.scaleValue.setValue(1);

      this.setState({
        completed: false,
        nextCompleted: undefined,
      });

      return;
    }

    if (this.state.completed !== nextProps.solution.get('completed')) {
      this.setState({
        nextCompleted: !this.state.completed,
      });

      this.startTransition();
    }
  }

  startTransition() {
    Animated.timing(this.state.scaleValue, {
      toValue: 0,
      duration: 300,
    })
    .start(() => {
      this.setState({
        completed: this.state.nextCompleted,
        nextCompleted: undefined,
      });

      Animated.timing(this.state.scaleValue, {
        toValue: 1,
        duration: 150,
        delay: 350,
      }).start();
    });
  }

  render() {
    const content = (() => {
      if (this.state.completed) {
        return <Image style={styles.star}
          source={require('./ic_star_white.png')} />;
      }
      else {
        return <PreStar />;
      }
    })();

    const customStyles = {
      starContainer: {
        transform: [{scale: this.state.scaleValue}],
      },
    };


    return <Animated.View
      style={[styles.starContainer, customStyles.starContainer]} >
      {content}
    </Animated.View>;
  }
}

Star.propTypes = {
  solution: consts.PROPTYPES.IMMUTABLE_OBJECT,
};


class StarsWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const stars = this.props.model.board
    .getIn(['currentBoard', 'challenges', this.props.challengeId, 'solutions'])
    .map((solution, key) => <Star key={key} solution={solution} />);

    return <View style={styles.starsWrapper} >
      {stars}
    </View>;
  }
}

StarsWrapper.propTypes = {
  model: consts.PROPTYPES.MODEL.isRequired,
  challengeId: React.PropTypes.number.isRequired,
};


class Goal extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getNewState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const newState = this.getNewState(nextProps);

    if (this.props.model.board.getIn(['currentBoard', 'boardLayout']) !== nextProps.model.board.getIn(['currentBoard', 'boardLayout'])) {
      setTimeout(() => this.setState(newState), 750);

      return;
    }

    setTimeout(() => this.setState(newState), 250);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.activeGoal !== this.state.activeGoal) {
      return true;
    }

    return false;
  }

  getNewState(props) {
    const challenge = props.model.board.
    getIn(['currentBoard', 'challenges', props.challengeId]);

    return {
      challenge,
      activeGoal: getActiveGoal(challenge),
    };
  }

  render() {
    const length = {
      3: 2,
      5: 3,
    }[this.state.challenge.get('length')];
    const goal = this.state.activeGoal;

    return <View style={styles.goal} >
      <View style={styles.textSumWrapper} >
        <MyText style={styles.textSum} xmedium >
          {goal ? goal.get('sum') : ''}
        </MyText>
      </View>
      <View style={styles.textLengthWrapper} >
        <MyText style={styles.textLength} standard >
          {length + ' numbers'}
        </MyText>
      </View>
      <StarsWrapper challengeId={this.props.challengeId}
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
    marginTop: 15,
    flexDirection: 'row',
  },
  goal: {
    width: 100,
    alignItems: 'center',
  },
  textSumWrapper: {
    // height: 40,
  },
  textLengthWrapper: {
    // height: 20,
  },
  starsWrapper: {
    flexDirection: 'row',
  },
  starContainer: {
    width: 24,
    height: 24,
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preStar: {
    width: 6,
    height: 6,
    margin: 14,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  star: {
    width: 24,
    height: 24,
  },
});


module.exports = GoalsDisplay;
