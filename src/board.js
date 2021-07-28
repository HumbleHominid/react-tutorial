import { Component } from 'react';
import Square from './square';
import './index.css';

export default class Board extends Component {
  render() {
    let rows = Array(3).fill(null);
    for (let i = 0; i < 3; ++i) {
      let squares = Array(3).fill(null);
      for (let j = 0; j < 3; ++j) {
        const val = (i * 3) + j;
        squares[j] = Square({
          key: j,
          value: this.props.squares[val],
          isWinner: this.props.winningSquares[val],
          onClick: () => this.props.onClick(val),
        });
      }
      rows[i] = BoardRow({
        key: i,
        items: squares,
      });
    }

    return (
      <div>
        {rows}
      </div>
    );
  }
}

function BoardRow(props) {
  return (
    <div key={props.key} className="board-row">
      {props.items}
    </div>
  );
}
