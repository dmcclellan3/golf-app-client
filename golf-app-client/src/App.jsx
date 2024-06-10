import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function App() {
  const [scores, setScores] = useState([]);

  const submit = () => {
    fetchUser({ auth })
  }
  return (
    <div className="p-5">
      <h1>Your Profile</h1>
      <CreateScore />
      <ul>
        {scores.map(score => (
          <li key={score.id}>{score.title} by {score.author}</li>
        ))}
      </ul>
    </div>
  );
};

export default App
