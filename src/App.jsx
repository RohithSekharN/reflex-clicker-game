import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [score, setScore] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [objectPosition, setObjectPosition] = useState({ top: '50%', left: '50%' });
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds timer
  const timeoutRef = useRef(null); // Reference to store the timeout

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, isActive]);

  // Start the game
  const startGame = () => {
    setIsActive(true);
    setScore(0);
    setTimeLeft(30);
    generateRandomPosition();
  };

  const endGame = () => {
    setIsActive(false);
    setIsVisible(false);
    clearTimeout(timeoutRef.current); // Clear any existing timeout
  };

  // Handle object click
  const handleObjectClick = () => {
    if (isActive) {
      // Using a callback version of setScore to ensure the state update is applied immediately
      setScore((prevScore) => {
        const newScore = prevScore + 1;
        clearTimeout(timeoutRef.current); // Clear the timeout when clicked
        setIsVisible(false); // Set visibility to false immediately after click
        generateRandomPosition();
        return newScore;
      });
    }
  };

  // Generate random position for the object
  const generateRandomPosition = () => {
    const top = Math.random() * 90 + '%';
    const left = Math.random() * 90 + '%';
    setObjectPosition({ top, left });
    setIsVisible(true); // Set object as visible before timeout starts

    const visibilityTime = 2000; // Object stays visible for 2 seconds

    // Clear previous timeout and set a new one
    clearTimeout(timeoutRef.current); 
    timeoutRef.current = setTimeout(() => {
      if (isVisible) { // Check if the object is still visible
        setIsVisible(false); // Hide the object
        alert("You missed! Game Over."); // Trigger the alert for missed object
        endGame();
      }
    }, visibilityTime);
  };

  return (
    <div className="game-container">
      <h1>Reflex Clicker Game</h1>
      <p>Score: {score}</p>
      {!isActive && <button onClick={startGame}>Start Game</button>}
      {isActive && isVisible && (
        <div
          className="clickable-object"
          style={{ top: objectPosition.top, left: objectPosition.left }}
          onClick={handleObjectClick}
        ></div>
      )}
    </div>
  );
}

export default App;
