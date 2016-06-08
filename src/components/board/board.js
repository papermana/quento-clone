const React = require('react');
const {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = require('react-native');
const consts = require('@src/constants');


class BoardTile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let darkerShade;

    if (this.props.children === '+' || this.props.children === '-') {
      darkerShade = true;
    }

    return <TouchableHighlight
      underlayColor="rgb(0,0,0)"
      activeOpacity={0.9} >
      <View style={[styles.tile, darkerShade && styles.tileDarkerShade]} >
        <Text style={styles.tileText} >
          {this.props.children}
        </Text>
      </View>
    </TouchableHighlight>;
  }
}

BoardTile.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string,
  ]).isRequired,
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
    .map((value, key) => <BoardTile key={key} >{value}</BoardTile>);

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
