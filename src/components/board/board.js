const React = require('react');
const {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = require('react-native');
const consts = require('@src/constants');
const actionCreators = require('@src/actionCreators');
const MyText = require('@components/MyText');


class BoardTile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isHighlighted: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.model.board.get('selectedPath').includes(this.props.tileId)) {
      this.setState({
        isHighlighted: true,
      });
    }
    else {
      this.setState({
        isHighlighted: false,
      });
    }
  }

  render() {
    let darkerShade;

    if (this.props.children === '+' || this.props.children === '-') {
      darkerShade = true;
    }

    const customStyles = {
      highlight: {
        backgroundColor: 'blue',
      },
    };

    return <TouchableHighlight
      underlayColor="rgb(0,0,0)"
      activeOpacity={0.9}
      onPress={() => actionCreators.selectTile(this.props.tileId)} >
      <View style={[styles.tile, darkerShade && styles.tileDarkerShade, this.state.isHighlighted && customStyles.highlight]} >
        <MyText style={styles.tileText} >
          {this.props.children}
        </MyText>
      </View>
    </TouchableHighlight>;
  }
}

BoardTile.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string,
  ]).isRequired,
  tileId: React.PropTypes.number.isRequired,
  model: consts.PROPTYPES.MODEL.isRequired,
};


class BoardRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <View style={styles.row} >
      {this.props.children}
    </View>;
  }
}

BoardRow.propTypes = {
  children: consts.PROPTYPES.IMMUTABLE_LIST,
};


class Board extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const tiles = this.props.model.board.getIn(['currentBoard', 'boardLayout'])
    .map((value, key) => <BoardTile key={key} tileId={key} model={this.props.model} >{value}</BoardTile>);

    const rows = tiles
    .groupBy((value, key) => Math.floor(key / 3))
    .toList()
    .map((row, key) => <BoardRow key={key} >{row}</BoardRow>);

    return <View style={styles.board} >
      {rows}
    </View>;
  }
}

Board.propTypes = {
  model: consts.PROPTYPES.MODEL.isRequired,
};


const styles = StyleSheet.create({
  board: {
    width: 302,
    height: 302,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'grey',
  },
  row: {
    height: 100,
    width: 302,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tile: {
    width: 100,
    height: 100,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  tileDarkerShade: {
    backgroundColor: 'rgb(245,245,245)',
  },
  tileText: {
    fontSize: 24,
    color: 'rgba(0,0,0,0.9)',
  },
});


module.exports = Board;
