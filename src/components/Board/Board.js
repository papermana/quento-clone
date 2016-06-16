const React = require('react');
const {
  StyleSheet,
  Vibration,
  View,
} = require('react-native');
const consts = require('@src/constants');
const actionCreators = require('@src/actionCreators');
const BoardTile = require('./BoardTile');
const selectTile = require('./selectTile');


class Board extends React.Component {
  constructor(props) {
    super(props);

    this.position = {
      x: undefined,
      y: undefined,
    };

    this.touch = undefined;

    this.doOnRelease = [];

    this.responders = {
      onStartShouldSetResponder: () => true,
      onStartShouldSetResponderCapture: () => true,
      onMoveShouldSetResponder: () => true,
      onMoveShouldSetResponderCapture: () => true,
      onResponderGrant: this.onTouchFunc.bind(this),
      onResponderMove: this.onTouchFunc.bind(this),
      onResponderRelease: () => {
        //  If it's a tap and `selectTile` decided it needed to do something on release (like deselect just one tile, for instance), do it now:
        if (this.doOnRelease.length > 0) {
          this.doOnRelease.forEach(callback => callback());

          this.doOnRelease = [];
        }

        this.touch = undefined;
      },
      //  For testing:
      // onResponderGrant: () => actionCreators.winTheGame(),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.model.board.getIn(['currentBoard', 'boardLayout']) !== this.props.model.board.getIn(['currentBoard', 'boardLayout'])) {
      this.rotateTiles();
    }
  }

  onLayoutFunc(e) {
    this.refs.boardView.measure((fx, fy, width, height, px, py) => {
      this.position = {
        x: px,
        y: py,
      };
    });
  }

  onTouchFunc(e) {
    const X = e.nativeEvent.pageX - this.position.x - consts.BOARD_PADDING;
    const Y = e.nativeEvent.pageY - this.position.y - consts.BOARD_PADDING;

    if (X < 0 || X > 300 || Y < 0 || Y > 300) {
      return;
    }

    const id = Math.floor(Y / 100) * 3 + Math.floor(X / 100);
    const path = this.props.model.board.get('selectedPath');

    if (!this.touch) {
      this.touch = {
        lastId: id,
      };

      if (path.size > 1 && path.last() === id) {
        this.setLongPress();
      }

      selectTile(this.props.model.board, id, this.touch, doOnRelease.bind(this));
    }
    else if (this.touch.lastId !== id) {
      this.touch = {
        lastId: id,
        swipe: true,
      };

      selectTile(this.props.model.board, id, this.touch, doOnRelease.bind(this));
    }

    function doOnRelease(callback) {
      this.doOnRelease.push(callback);
    }
  }

  setLongPress() {
    if (this._setLongPress) {
      clearTimeout(this._setLongPress);
    }

    this._setLongPress = setTimeout(this.onLongPressFunc.bind(this), 750);
  }

  onLongPressFunc() {
    //  Deselect everything on long press:
    if (this.touch && !this.touch.swipe) {
      Vibration.vibrate([0, 10, 25]);

      actionCreators.deselectTile(0);
    }
  }

  rotateTiles() {
    this.props.model.board.getIn(['currentBoard', 'boardLayout'])
    .forEach((value, key) => {
      setTimeout(() => this.refs['tile' + key].rotate(), key * 0);
    });
  }

  render() {
    const tiles = this.props.model.board.getIn(['currentBoard', 'boardLayout'])
    .map((value, key) => {
      return <BoardTile key={key}
        ref={'tile' + key}
        tileId={key}
        model={this.props.model} >
        {value}
      </BoardTile>;
    });

    return <View style={styles.board} ref="boardView"
      onLayout={this.onLayoutFunc.bind(this)}
      {...this.responders} >
      {tiles}
    </View>;
  }
}

Board.propTypes = {
  model: consts.PROPTYPES.MODEL.isRequired,
};


const styles = StyleSheet.create({
  board: {
    width: 300 + 2 * consts.BOARD_PADDING,
    height: 300 + 2 * consts.BOARD_PADDING,
  },
});


module.exports = Board;
