import './index.css';

export default function Square(props) {
  const classNames = "square " + (props.isWinner ? "square-winner" : "square-gameplay");
  return (
    <button key={props.key} className={classNames} onClick={props.onClick}>
      {props.value}
    </button>
  );
}