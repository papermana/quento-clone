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
    const size = (this.props.standard && 'standard') ||
      (this.props.medium && 'medium') ||
      (this.props.xmedium && 'xmedium') ||
      (this.props.large && 'large') ||
      (this.props.xlarge && 'xlarge');
    const logo = this.props.logo && styles['logo' + size];

    return <Text style={[styles.myText, styles[size], logo, this.props.style]} >
      {this.props.children}
    </Text>;
  }
}

MyText.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
    React.PropTypes.node,
    React.PropTypes.arrayOf(React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.node,
    ])),
  ]).isRequired,
  style: consts.PROPTYPES.STYLE,
  standard: React.PropTypes.bool,
  medium: React.PropTypes.bool,
  xmedium: React.PropTypes.bool,
  large: React.PropTypes.bool,
  xlarge: React.PropTypes.bool,
  logo: React.PropTypes.bool,
};


const styles = StyleSheet.create({
  myText: {
    fontFamily: 'WorkSans-Regular',
    color: 'rgba(0,0,0,0.9)',
  },
  standard: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'WorkSans-Light',
  },
  medium: {
    fontSize: 24,
    lineHeight: 30,
    fontFamily: 'WorkSans-Light',
  },
  xmedium: {
    fontSize: 32,
    lineHeight: 40,
    fontFamily: 'WorkSans-Light',
    color: 'rgba(0,0,0,0.7)',
  },
  large: {
    fontSize: 48,
    lineHeight: 60,
    fontFamily: 'WorkSans-ExtraLight',
  },
  xlarge: {
    fontSize: 72,
    lineHeight: 90,
    fontFamily: 'WorkSans-ExtraLight',
    color: 'rgba(0,0,0,0.7)',
  },
  //  Logos have lineHeight equal to 11/12 of fontSize, and vertical padding to offset that:
  logolarge: {
    lineHeight: 44,
    paddingBottom: 6,
  },
  logoxlarge: {
    lineHeight: 66,
    paddingBottom: 6,
  },
});


module.exports = MyText;
