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
  const [strokes, setStrokes] = useState(0);
  const [putts, setPutts] = useState(0);
  const [penalties, setPenalties] = useState(0);
  const [totalStrokes, setTotalStrokes] = useState(0);
  const [totalPutts, setTotalPutts] = useState(0);
  const [totalPenalties, setTotalPenalties] = useState(0);
  const [totalScore, setTotalScore] = useState()
  const [updateScore, setUpdateScore] = useState()
  const [scores, setScores] = useState([]);

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
    }, [])

    useEffect(() => {
        console.log(holes[currentHole -1])
    },[holes])

    useEffect(() => {
        console.log('UE Current Hole: ', currentHole)
        console.log('Current score: ' )
        if (currentHole <= 0) {
            setCurrentHole(holes.length)
        }
        if (currentHole >= holes.length + 1) {
            setCurrentHole(1)
        }

    },[currentHole])

    const getTheRoundInfo = async () => {
        try {
            const response = await getCurrentRound({ auth })
            console.log('BLAMMO: ROUND: ', response)
            let roundId = response.data.length > 0 ? response.data[response.data.length - 1].pk : 0
            getAllHoles({ roundId })
        } catch (error) {
            console.log('getTheRoundInfo: ERROR: ', error)
        }
    }

    const getAllHoles = async ({ roundId }) => {
        try {
            const allHoles = await fetchHoles({ auth, roundId })
            console.log('FETCH HOLE: ', allHoles.data)
            setHoles(allHoles.data)
        } catch (error) {
            console.log('fetchHoles: ERROR:', error )
        }
    }

    const handleNextHole = () => {
        setTotalStrokes(totalStrokes + parseInt(strokes));
        setTotalPutts(totalPutts + parseInt(putts));
        setTotalPenalties(totalPenalties + parseInt(penalties));
        setCurrentHole(currentHole + 1)
        setTotalScore(totalStrokes + parseInt(strokes))    
        setStrokes(0);
        setPutts(0);
        setPenalties(0);
    }

    // const handlePreviousHole = () => {
    //     updateCurrentHoleScore();
    //     setCurrentHole(currentHole > 1 ? currentHole - 1 : holes.length);
    //   };

    const updateCurrentHoleScore = () => {
        const updatedScores = scores.map(score =>
          score.holeId === holes[currentHole - 1].id
            ? { ...score, strokes: parseInt(strokes), putts: parseInt(putts), penalties: parseInt(penalties) }
            : score
        );
        setScores(updatedScores);
      };

    //   const getTotal = (type) => {
    //     return scores.reduce((total, score) => total + score[type], 0);
    //   };



    return (
        <div className='round-container'>
          <h1 className='title'>Track Round</h1>
          <h3 className="course-name">Lakeside Golf Course</h3>
          <h5 className='my-auto mx-3'>Current Score:{totalScore}</h5>
          <div id='track-round'>
            <h2>Hole</h2>
            <div className="my-auto mx-3" onClick={() => setCurrentHole(currentHole - 1)}>{`<-`}</div>
            <h2>{holes[currentHole - 1]?.hole_number}</h2>
            <div className="my-auto mx-3" onClick={() => setCurrentHole(currentHole + 1)}>{`->`}</div>
          </div>
          <h3>Par: {holes[currentHole - 1]?.par}</h3>
          <div>
            <h5>Strokes</h5>
            <input type="number" value={strokes} onChange={(e) => setStrokes(e.target.value)} />
          </div>
          <div>
            <h5>Putts</h5>
            <input type="number" value={putts} onChange={(e) => setPutts(e.target.value)} />
          </div>
          <div>
            <h5>Penalties</h5>
            <input type="number" value={penalties} onChange={(e) => setPenalties(e.target.value)} />
          </div>
          {/* <div className='total-scores'>
          <h6>Total Strokes: {getTotal('strokes')}</h6>
          <h6>Total Putts: {getTotal('putts')}</h6>
          <h6>Total Penalties: {getTotal('penalties')}</h6>
          </div> */}
          <br />
          <button className='next-hole-button' onClick={handleNextHole}>Next Hole</button>
        </div>
      );
    };
    
    
    export default TrackRound;
    


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

//   return (
//       <div className='round-container'>
//       <h1 className='title'>Track Round</h1>
//       <h3 className="course-name">Lakeside Golf Course</h3>
//       <h5>Current Score:</h5>
//         <div id='track-round' className="d-flex">
//         <h2>Hole</h2>
//         <div className="my-auto mx-3" onClick={() => setCurrentHole(currentHole - 1)}>{`<-`}</div>
//         <h2 className="px-3 my-auto mx-2">{holes[currentHole -1]?.hole_number}</h2>
//         <div className="my-auto mx-3" onClick={() => setCurrentHole(currentHole + 1)}>{`->`}</div>
//     </div>
//       {<h3>Par: {holes[currentHole -1]?.par}</h3>}
//       <br />
//       <h3>Strokes</h3>
//       <br />
//       <h3>Putts</h3>
//       <br />
//       <h3>Penalties</h3>

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
//     </div>
//   );
// };

