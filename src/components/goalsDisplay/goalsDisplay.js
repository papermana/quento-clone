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


class SingleStar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      completed: false,
      nextCompleted: undefined,
      scaleValue: new Animated.Value(1),
    };
  }

  componentWillReceiveProps(nextProps) {
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

SingleStar.propTypes = {
  solution: consts.PROPTYPES.IMMUTABLE_OBJECT,
};


class Stars extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const stars = this.props.model.board
    .getIn(['currentBoard', 'challenges', this.props.challengeId, 'solutions'])
    .map((solution, key) => <SingleStar key={key} solution={solution} />);

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
    const challenge = this.props.model.board
    .getIn(['currentBoard', 'challenges', this.props.challengeId]);
    const length = {
      3: 2,
      5: 3,
    }[challenge.get('length')];
    const goal = getActiveGoal(challenge);

    return <View style={styles.goal} >
      <View style={styles.textSumWrapper} >
        <MyText style={styles.textSum} >
          {goal ? goal.get('sum') : ''}
        </MyText>
      </View>
      <View style={styles.textLengthWrapper} >
        <MyText style={styles.textLength} >
          {length + ' numbers'}
        </MyText>
      </View>
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
    marginVertical: 8,
    flexDirection: 'row',
  },
  goal: {
    width: 100,
    alignItems: 'center',
  },
  textSumWrapper: {
    height: 40,
  },
  textSum: {
    fontSize: 32,
    color: 'rgba(0,0,0,0.9)',
  },
  textLengthWrapper: {
    height: 20,
  },
  textLength: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.9)',
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
    backgroundColor: 'rgba(128,128,128,0.55)',
  },
  star: {
    width: 24,
    height: 24,
  },
});


module.exports = GoalsDisplay;
