import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [question, setQuestion] = useState('');
  const [choices, setChoices] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [isDifficultySelected, setIsDifficultySelected] = useState(false);

  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const generateQuestion = () => {
    let num1, num2;
    if (difficulty === 'easy') {
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
    } else if (difficulty === 'medium') {
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;
    } else {
      num1 = Math.floor(Math.random() * 100) + 1;
      num2 = Math.floor(Math.random() * 100) + 1;
    }

    const operation = ['+', '-', '×', '÷'][Math.floor(Math.random() * 4)];

    let correct;
    switch (operation) {
      case '+':
        correct = num1 + num2;
        break;
      case '-':
        correct = num1 - num2;
        break;
      case '×':
        correct = num1 * num2;
        break;
      case '÷':
        correct = num1 / num2;
        break;
      default:
        break;
    }

    setQuestion(`${num1} ${operation} ${num2}`);

    let choicesArray = [correct];
    while (choicesArray.length < 3) {
      let randomChoice = Math.floor(Math.random() * 20) + 1;
      if (!choicesArray.includes(randomChoice)) {
        choicesArray.push(randomChoice);
      }
    }

    choicesArray = choicesArray.sort(() => Math.random() - 0.5);

    setChoices(choicesArray);
    setCorrectAnswer(correct);
  };

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsGameOver(true);
    }
  }, [timeLeft, isGameOver]);

  const checkAnswer = (selectedAnswer) => {
    if (selectedAnswer === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
    generateQuestion();
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsGameOver(false);
    setIsDifficultySelected(true);
    generateQuestion();
  };

  const selectDifficulty = (level) => {
    setDifficulty(level);
    setIsDifficultySelected(true);
    startGame();
  };

  return (
    <div className="App">
      <h1>QuickMath Game</h1>
      
      <button className="theme-toggle" onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>

      {!isDifficultySelected ? (
        <div>
          <h2>Select Difficulty</h2>
          <button onClick={() => selectDifficulty('easy')}>Easy</button>
          <button onClick={() => selectDifficulty('medium')}>Medium</button>
          <button onClick={() => selectDifficulty('hard')}>Hard</button>
        </div>
      ) : (
        <div>
          {isGameOver ? (
            <div>
              <h2>Game Over!</h2>
              <p>Your score: {score}</p>
              <button onClick={() => setIsDifficultySelected(false)}>Select Difficulty Again</button>
            </div>
          ) : (
            <div>
              <p>Time left: {timeLeft}s</p>
              <p>Score: {score}</p>
              <p>Question: {question}</p>
              <div className="choices">
                {choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => checkAnswer(choice)}
                    className="choice-button"
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
