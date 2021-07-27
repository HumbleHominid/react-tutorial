import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const classNames = "square " + (props.isWinner ? "square-winner" : "square-gameplay");
  return (
    <button key={props.key} className={classNames} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function BoardRow(props) {
  return (
    <div key={props.key} className="board-row">
      {props.items}
    </div>
  );
}

class Board extends React.Component {
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

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
  }

  getDefaultState() {
    return {
      history: [{
        squares: Array(9).fill(null),
        location: null,
      }],
      xIsNext: true,
      stepNumber: 0
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  restartGame() {
    this.setState(this.getDefaultState());
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: i,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerObj = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let desc;
      if (move) {
        desc = `Go to move #${move}`;
        if (step.location !== null) {
          const x = step.location % 3;
          const y = Math.floor(step.location / 3);
          desc += `: [${x}, ${y}]`;
        }
      } else {
        desc = 'Go to game start';
      }

      const isBold = this.state.stepNumber + 1 < this.state.history.length && move === this.state.stepNumber;

      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={isBold ? 'bold' : ''}>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winnerObj.winner) {
      status = `Winner: ${winnerObj.winner}!`;
    } else if (this.state.stepNumber > 8) {
      status = 'Draw!';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningSquares={winnerObj.winningSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.restartGame()}>Restart Game</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [ 0, 1, 2 ],
    [ 3, 4, 5 ],
    [ 6, 7, 8 ],
    [ 0, 3, 6 ],
    [ 1, 4, 7 ],
    [ 2, 5, 8 ],
    [ 0, 4, 8 ],
    [ 2, 4, 6 ],
  ];

  let ret = {
    winner: null,
    winningSquares: Array(9).fill(false),
  };

  for (let i = 0; i < lines.length; ++i) {
    const [ a, b, c ] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      ret.winner = squares[a];
      ret.winningSquares[a] = true;
      ret.winningSquares[b] = true;
      ret.winningSquares[c] = true;
      break;
    }
  }
  return ret;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
