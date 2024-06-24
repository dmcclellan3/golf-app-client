import React, { useState, useEffect, useContext } from "react";
import {
  getCurrentRound,
  fetchHoles,
  createScore,
  fetchRoundsHistory,
  // fetchScores
} from "./api";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "./authContext";
import "./App.css";
import { RoundContext } from "./roundContext";
import { GrScorecard } from "react-icons/gr";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { GiCheckMark } from "react-icons/gi";



const TrackRound = () => {
  const { auth } = useContext(AuthContext);
  const {round, currentHole, setCurrentHole} = useContext(RoundContext)
  const [strokes, setStrokes] = useState([]);
  const [putts, setPutts] = useState(0);
  const [penalties, setPenalties] = useState(0);
  const [totalScore, setTotalScore] = useState();
  const [scores, setScores] = useState([]);
  const [holeScore, setHoleScore] = useState(0);
  const [overUnderPar, setOverUnderPar] = useState(0)
  const { navigate } = useNavigate()
  
  console.log(round.holes)  

  useEffect(() => {
    getTheRoundInfo();
  }, [navigate]);

  useEffect(() => {
    console.log(round.holes[currentHole - 1]);
  }, [round.holes]);

  useEffect(() => {
    // calculateOverUnderPar();
    overUnder()
  }, [currentHole]);

  useEffect(() => {
    console.log("UE Current Hole: ", currentHole);
    console.log("Current score: ");
    if (currentHole <= 0) {
      setCurrentHole(round.holes.length);
    }
    if (currentHole >= round.holes.length + 1) {
      setCurrentHole(1);
    }
  }, [currentHole]);

  useEffect(() => {
    const strokeScore = strokes.find(
      (stroke) => stroke.hole === round.holes[currentHole - 1]?.id
    );
    console.log("Hole Score: ", strokeScore);
    console.log("Strokes: ", strokes);
    if (strokeScore) {
      setHoleScore(strokeScore.strokes);
    } else {
      setHoleScore(0)
    }
    
  }, [currentHole, round.holes, strokes]);

  useEffect(() => {
    roundHistory();
  }, []);

  const getAllHoles = async ({ roundId }) => {
    try {
      const allHoles = await fetchHoles({ auth, roundId });
      console.log("FETCH HOLE: ", allHoles.data);
      round.setHoles(allHoles.data.holes);
      setStrokes(allHoles.data.strokes);
      round.setCurrentRoundId(roundId);
    } catch (error) {
      console.log("fetchHoles: ERROR:", error);
    }
  };
  const getTheRoundInfo = async () => {
    try {
      const response = await getCurrentRound({ auth });
      console.log("BLAMMO: ROUND: ", response);
      let roundId =
        response.data.length > 0
          ? response.data[response.data.length - 1].id
          : 0;
      console.log("BLAMMO: ROUND ID: ", roundId);
      getAllHoles({ roundId });
    } catch (error) {
      console.log("getTheRoundInfo: ERROR: ", error);
    }
  };


  const handleNextHole = async () => {
    await postScore(holeScore);
    // updateCurrentHoleScore();
    setCurrentHole(currentHole + 1);
    
  };

  const handlePreviousHole = async () => {
    await postScore(holeScore);
    setCurrentHole(currentHole - 1);
    // updateCurrentHoleScore();
    // setCurrentHole(currentHole > 1 ? currentHole - 1 : holes.length);
  };

  const updateCurrentHoleScore = () => {
    const updatedScores = scores.map((score) =>
      score.holeId === round.holes[currentHole - 1].id
        ? {
            ...score,
            strokes: parseInt(strokes),
            putts: parseInt(putts),
            penalties: parseInt(penalties),
          }
        : score
    );
    setScores(updatedScores);
  };

  const updateStrokes = (direction) => {
    if (direction === "minus") {
      if (Number(holeScore) > 0) {
        postScore(Number(holeScore) - 1);
      }
    } else if (direction === "plus") {
      if (holeScore) {
        postScore(Number(holeScore) + 1);
      } else {
        postScore(1);
      }
    }
  };

  const postScore = async (newStrokes) => {
    console.log("NEW STROKES: ", newStrokes);
    const holeId = round.holes[currentHole - 1]?.id;
    console.log("Auth: ", auth);
    const roundId = round.currentRoundId;
    const newScore = {
      round: roundId,
      hole: holeId,
      strokes: newStrokes !== null ? newStrokes : 0,
      // putts: putts !== null ? parseInt(putts) : 0,
      // penalties: penalties !== null ? parseInt(penalties) : 0,
      // user: auth.user.id
    };

    try {
      const response = await createScore({ auth, content: newScore });
      console.log("Score posted successfully:", response.data);
      // await setHoleScore(response.data.strokes);    
      await getAllHoles({ roundId });
    } catch (error) {
      console.log("Error posting score:", error.response.data);
    }
  };

  const roundHistory = async () => {
    try {
      const response = await fetchRoundsHistory({ auth });
      console.log("Round History: ", response);
    } catch (error) {
      console.log("getTheRoundInfo: ERROR: ", error);
    }
  };

  // const calculateOverUnderPar = () => {
  //   if (holes[currentHole - 1]) {
  //     const par = holes[currentHole - 1].par;
  //     const overUnder = holeScore - par;
  //     setOverUnderPar(overUnder);
  //   }
  // };

  const overUnder = () => {
    let overUnderAcc = 0  
    console.log('look here')
    console.log(round.holes)
    console.log(strokes)
    if (strokes.length > 0) {
      for(let i=0; i < strokes.length; i++) {
        console.log(strokes[i])
        console.log(strokes[i].strokes)
        if (strokes[i].strokes) {
          let diff = round.holes[i].par - strokes[i].strokes
          overUnderAcc = overUnderAcc - diff
          console.log('OVER UNDER ACC: ', overUnderAcc)
        }
      }
      setOverUnderPar(overUnderAcc)
      // return overUnderAcc
    }
  }


  


  return (
    <div className="round-container mt-4">
        <div><Link to='/scorecard'>
        <GrScorecard id='scorecard-link'><h6>Scorecard</h6></GrScorecard>
        </Link></div>
      <h1 className="title">Track Round</h1>
      <h3 className="course-name">Lakeside Golf Course</h3>
      <h5 className="my-auto mx-3">Current Score: ({overUnderPar >= 0 ? `+${overUnderPar}` : overUnderPar})</h5>
      <div id="track-round">
        <h2 className="my-auto mx-3">Hole</h2>
        <div className="nav-arrow" onClick={handlePreviousHole}></div>
        <h2 className="my-auto mx-3">{round.holes[currentHole - 1]?.hole_number}</h2>
        <div className="nav-arrow" onClick={handleNextHole}></div>
      </div>
      <h4>Par: {round.holes[currentHole - 1]?.par}</h4>
      <div className="score-row">
        <h5>Strokes</h5>
        <div className="input-group">
          <button
            className="input-button"
            onClick={() => updateStrokes("minus")}
          >
            -
          </button>
          <input
            className="input-number"
            type="number"
            value={holeScore}
            readOnly
          />
          <button
            className="input-button"
            onClick={() => updateStrokes("plus")}
          >
            +
          </button>
        </div>
      </div>
      <div className="score-row">
        <h5>Putts</h5>
        <div className="input-group">
          <button
            className="input-button"
            onClick={() => setPutts(putts > 0 ? putts - 1 : 0)}
          >
            -
          </button>
          <input
            className="input-number"
            type="number"
            value={putts}
            readOnly
          />
          <button className="input-button" onClick={() => setPutts(putts + 1)}>
            +
          </button>
        </div>
      </div>
      <div className="score-row">
        <h5>Penalties</h5>
        <div className="input-group">
          <button
            className="input-button"
            onClick={() => setPenalties(penalties > 0 ? penalties - 1 : 0)}
          >
            -
          </button>
          <input
            className="input-number"
            type="number"
            value={penalties}
            readOnly
          />
          <button
            className="input-button"
            onClick={() => setPenalties(penalties + 1)}
          >
            +
          </button>
        </div>
      </div>
      <br />
      <div className="button-container justify-content-center">
        {currentHole > 1 ? (
          <FaArrowLeft 
          className="button previous-hole-button"
          onClick={handlePreviousHole}
          >
            Previous
          </FaArrowLeft>
        ) : null}
        {currentHole === round.holes.length ? (
          <Link to="/score">
            <GiCheckMark 
            className="complete-round-button" onClick={() => setCurrentHole(1)}>Complete Round
            </GiCheckMark>
          </Link>
        ) : null}
        {currentHole < round.holes.length ? (
          <FaArrowRight
          className="next-hole-button" onClick={handleNextHole}>
            Next
          </FaArrowRight>
        ) : null}
      </div>
    </div>
  );
};

export default TrackRound;
