import { useState } from 'react';
import confetti from 'canvas-confetti';

import { TURNS } from './constans';
import { checkWinnerFrom, checkEndGameFrom } from './logic/board';
import { WinnerModal } from './components/WinnerModal';

import './App.css';
import { Board } from './components/Board';
import { Turn } from './components/Turn';
import { resetGameStorage, saveGameStorage } from './logic/storage';

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board');
    if (boardFromStorage) return JSON.parse(boardFromStorage);
    return Array(9).fill(null);
  });

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn');
    return turnFromStorage ?? TURNS.X;
  });
  // null es que no hay ganador, false es que hay un empate.
  const [winner, setWinner] = useState(null);

  const resetGame = () => {
    resetGameStorage();
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
  };

  const updateBoard = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);

    saveGameStorage({
      board: newBoard,
      turn: newTurn,
    });

    const newWinner = checkWinnerFrom(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner);
    } else if (checkEndGameFrom(newBoard)) {
      setWinner(false);
    }
  };

  return (
    <main className="board">
      <h1>Tic tac toe</h1>
      <button onClick={resetGame}>Reset del juego</button>

      <Board board={board} updateBoard={updateBoard} />

      <Turn actualTurn={turn} turns={TURNS} />

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  );
}

export default App;
