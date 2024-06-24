import { useState, useEffect, useContext } from 'react'
import './App.css'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './authContext';
import LandingPage from './LandingPage';



function App() {
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/landingpage');
    }
  }, [auth, navigate]);

  const submit = () => {
    fetchUser({ auth })
  }
  return (
    <div className="p-5">
      {/* <h1>Your Profile</h1> */}
      {/* <Score /> */}
      {/* <TrackRound /> */}
      <ul>
        {scores.map(score => (
          <li key={score.id}>{score.title} by {score.author}</li>
        ))}
      </ul>
    </div>
  );
};

export default App
