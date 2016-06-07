const React = require('react');
const {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = require('react-native');


class BoardTile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <TouchableHighlight
      underlayColor="rgb(0,0,0)"
      activeOpacity={0.9} >
      <View style={styles.tile} >
        <Text style={styles.tileText} >
          {this.props.children}
        </Text>
      </View>
    </TouchableHighlight>;
  }
}

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

class Board extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const tiles = this.props.model.board.get('boardLayout')
    .map((value, key) => <BoardTile key={key} >{value}</BoardTile>);
    // const rows = tiles.forEach((value, key) => {
    //   const position = Math.floor(key / 3);
    //
    //   if (!rows.get('position'))
    // });
    const rows = tiles
    .groupBy((value, key) => Math.floor(key / 3))
    .toList()
    .map((row, key) => <BoardRow key={key} >{row}</BoardRow>);

    return <View style={styles.board} >
      {rows}
    </View>;
  }
}

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
    // borderWidth: 1,
    // borderColor: 'grey',
  },
  tileText: {
    fontSize: 24,
    color: 'rgba(0,0,0,0.9)',
  },
});


module.exports = Board;
