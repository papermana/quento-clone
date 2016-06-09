const React = require('react');
const {
  Text,
  StyleSheet,
} = require('react-native');
const consts = require('@src/constants');


class MyText extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Text style={[styles.myText, this.props.style]} >
      {this.props.children}
    </Text>;
  }
}

MyText.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]).isRequired,
  style: consts.PROPTYPES.STYLE,
};


const styles = StyleSheet.create({
  myText: {
    // fontFamily: 'Rubik-Regular',
    fontFamily: 'Raleway-Regular',
  },
});


module.exports = MyText;
