import { useEffect, useMemo, useState, useRef } from 'react';
import './App.css';
import Confetti from 'react-confetti';

const gameIcons = [
  "🐶",
  "🎄",
  "👨🏿‍💻",
  "📚",
  "🚗",
  "🌹",
  "🎅🏾",
  "🍇",
  "☎️",
];

function App() {
  const [pieces, setPieces] = useState([]);
  const timeout = useRef();

  const isGameCompleted = useMemo(() => {
    return pieces.length > 0 && pieces.every((piece) => piece.solved);
  }, [pieces]);

  const startGame = () => {
    const duplicateGameIcons = gameIcons.concat(gameIcons); // Duplicate icons
    const newGameIcons = [];

    // Shuffle and set pieces
    while (newGameIcons.length < gameIcons.length * 2) {
      const randomIndex = Math.floor(Math.random() * duplicateGameIcons.length);
      newGameIcons.push({
        emoji: duplicateGameIcons[randomIndex],
        flipped: false,
        solved: false,
        position: newGameIcons.length,
      });
      duplicateGameIcons.splice(randomIndex, 1); // Remove used icon
    }
    setPieces(newGameIcons);
  };

  useEffect(() => {
    startGame();
  }, []);

  const handleActive = (data) => {
    const flippedData = pieces.filter((piece) => piece.flipped && !piece.solved);
    if (flippedData.length === 2) return; // Prevent flipping more than 2 cards

    const newPieces = pieces.map((piece) => {
      if (piece.position === data.position && !piece.solved && !piece.flipped) {
        return { ...piece, flipped: !piece.flipped };
      }
      return piece;
    });

    setPieces(newPieces);
  };

  const gameLogicForFlip = () => {
    const flippedData = pieces.filter((piece) => piece.flipped && !piece.solved);

    if (flippedData.length === 2) {
      timeout.current = setTimeout(() => {
        setPieces((prevPieces) =>
          prevPieces.map((piece) => {
            if (flippedData[0].emoji === flippedData[1].emoji) {
              if (piece.position === flippedData[0].position || piece.position === flippedData[1].position) {
                return { ...piece, solved: true };
              }
            } else {
              if (piece.position === flippedData[0].position || piece.position === flippedData[1].position) {
                return { ...piece, flipped: false };
              }
            }
            return piece;
          })
        );
      }, 800);
    }
  };

  useEffect(() => {
    gameLogicForFlip();
    return () => {
      clearTimeout(timeout.current);
    };
  }, [pieces]);

  return (
    <main>
      <h1>Memory Game</h1>
      <div className="container">
        {pieces.map((data, index) => (
          <div
            className={`flip-card ${data.flipped || data.solved ? 'active' : ''}`}
            key={index}
            onClick={() => handleActive(data)}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front" />
              <div className="flip-card-back">{data.emoji}</div>
            </div>
          </div>
        ))}
      </div>

      {isGameCompleted && (
        <div className="game-completed">
          <h1>YOU WIN...!!!</h1>
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        </div>
      )}
    </main>
  );
}

export default App;
