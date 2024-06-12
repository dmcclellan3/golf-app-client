import React, { useState, useEffect, useContext } from 'react';
import { 
    getCurrentRound, 
    fetchHoles
    // createScore, 
    // fetchScores 
} from './api';
import { useParams, } from 'react-router-dom';
import { AuthContext } from './authContext';
import './App.css'


const TrackRound = () => {
    const { auth } = useContext( AuthContext )
        //   const { roundId } = useParams();
//   console.log('ROUND ID: ', roundId)
//   const history = useHistory();
  const [holes, setHoles] = useState([]);
  const [currentHole, setCurrentHole] = useState(1);
//   const [strokes, setStrokes] = useState(0);
//   const [putts, setPutts] = useState(0);
//   const [penalties, setPenalties] = useState(0);
//   const [scores, setScores] = useState([]);

//   useEffect(() => {
//     const getHoles = async () => {
//       try {
//         const round = await fetchRound(roundId);
//         const holesData = await fetchHoles(round.course);
//         setHoles(holesData);
//       } catch (error) {
//         console.error('Error fetching holes:', error);
//       }
//     };

//     const getScores = async () => {
//       try {
//         const scoresData = await fetchScores(roundId);
//         setScores(scoresData);
//       } catch (error) {
//         console.error('Error fetching scores:', error);
//       }
//     };

//     getHoles();
//     getScores();
//   }, [roundId]);

    useEffect(() => {
        getTheRoundInfo()
        getAllHoles()
    }, [])

    useEffect(() => {
        console.log(holes[currentHole -1])
    },[holes])

    useEffect(() => {
        console.log('UE Current Hole: ', currentHole)
        if (currentHole <= 0) {
            setCurrentHole(holes.length)
        }
        if (currentHole >= holes.length + 1) {
            setCurrentHole(1)
        }

    },[currentHole])

    const getTheRoundInfo = async () => {
        try {
            const round = await getCurrentRound({ auth })
            console.log('BLAMMO: ROUND: ', round)
        } catch (error) {
            console.log('getTheRoundInfo: ERROR: ', error)
        }
    }

    const getAllHoles = async () => {
        try {
            const allHoles = await fetchHoles({ auth })
            console.log('FETCH HOLE: ', allHoles.data)
            setHoles(allHoles.data)
        } catch (error) {
            console.log('fetchHoles: ERROR:', error )
        }
    }

    


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await createScore({
//         round: roundId,
//         hole: holes[currentHole - 1].id,
//         strokes,
//         putts,
//         penalties,
//       });
//       setScores([...scores, { hole: currentHole, strokes, putts, penalties }]);
//       setCurrentHole(currentHole + 1);
//       setStrokes(0);
//       setPutts(0);
//       setPenalties(0);
//     } catch (error) {
//       console.error('Error creating score:', error);
//     }
//   };

  return (
      <div className='round-container'>
      <h1 className='title'>Track Round</h1>
      <h3 className="course-name">Lakeside Golf Course</h3>
      <h5>Current Score:</h5>
        <div id='track-round' className="d-flex">
        <h2>Hole</h2>
        <div className="my-auto mx-3" onClick={() => setCurrentHole(currentHole - 1)}>{`<-`}</div>
        <h2 className="px-3 my-auto mx-2">{holes[currentHole -1]?.hole_number}</h2>
        <div className="my-auto mx-3" onClick={() => setCurrentHole(currentHole + 1)}>{`->`}</div>
    </div>
      {<h3>Par: {holes[currentHole -1]?.par}</h3>}
      <br />
      <h3>Strokes</h3>
      <br />
      <h3>Putts</h3>
      <br />
      <h3>Penalties</h3>

      {/* {holes[currentHole -1]?.hole_number} */}
      {/* Create two number inputs and get values and pass them to API when called. */}

      {/* {currentHole <= holes.length ? (
        <form onSubmit={handleSubmit}>
          <h2>Hole {currentHole}</h2>
          <div>
            <label>Strokes</label>
            <input
              type="number"
              value={strokes}
              onChange={(e) => setStrokes(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Putts</label>
            <input
              type="number"
              value={putts}
              onChange={(e) => setPutts(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Penalties</label>
            <input
              type="number"
              value={penalties}
              onChange={(e) => setPenalties(e.target.value)}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      ) : (
        <div>
          <h2>Round Complete!</h2>
          <button onClick={() => history.push('/rounds')}>Back to Rounds</button>
        </div>
      )}
      <h3>Scores</h3>
      <ul>
        {scores.map((score, index) => (
          <li key={index}>
            Hole {score.hole}: {score.strokes} strokes, {score.putts} putts, {score.penalties} penalties
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default TrackRound;
