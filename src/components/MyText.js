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
    const size = (this.props.large && 'large') ||
      (this.props.medium && 'medium');

    return <Text style={[styles.myText, styles[size], this.props.style]} >
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
  large: React.PropTypes.bool,
  medium: React.PropTypes.bool,
};


const styles = StyleSheet.create({
  myText: {
    fontFamily: 'WorkSans-Light',
    color: 'rgba(0,0,0,0.9)',
  },
  large: {
    fontFamily: 'WorkSans-ExtraLight',
    color: 'rgba(0,0,0,0.75)',
  },
  medium: {
    fontFamily: 'WorkSans-ExtraLight',
  },
});


module.exports = MyText;
