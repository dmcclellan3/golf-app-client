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
// import { useHistory } from 'react-router-dom';
import "./App.css";

const TrackRound = () => {
  const { auth } = useContext(AuthContext);
  // const { roundId } = useParams();
  //   console.log('ROUND ID: ', roundId)
  // const history = useHistory();
  const [holes, setHoles] = useState([]);
  const [currentHole, setCurrentHole] = useState(1);
  const [strokes, setStrokes] = useState([]);
  const [putts, setPutts] = useState(0);
  const [penalties, setPenalties] = useState(0);
  // const [totalStrokes, setTotalStrokes] = useState([]);
  // const [totalPutts, setTotalPutts] = useState(0);
  // const [totalPenalties, setTotalPenalties] = useState(0);
  const [totalScore, setTotalScore] = useState();
  const [currentRoundId, setCurrentRoundId] = useState();
  // const [updatedScore, setUpdateScore] = useState()
  const [scores, setScores] = useState([]);
  // const [parScore, setParScore] = useState(0)
  const [holeScore, setHoleScore] = useState(0);

  const { navigate } = useNavigate()

  useEffect(() => {
    getTheRoundInfo();
  }, [navigate]);

  useEffect(() => {
    console.log(holes[currentHole - 1]);
  }, [holes]);

  useEffect(() => {
    console.log("UE Current Hole: ", currentHole);
    console.log("Current score: ");
    if (currentHole <= 0) {
      setCurrentHole(holes.length);
    }
    if (currentHole >= holes.length + 1) {
      setCurrentHole(1);
    }
  }, [currentHole]);

  useEffect(() => {
    const strokeScore = strokes.find(
      (stroke) => stroke.hole === holes[currentHole - 1]?.id
    );
    console.log("Hole Score: ", strokeScore);
    console.log("Strokes: ", strokes);
    if (strokeScore) {
      setHoleScore(strokeScore.strokes);
    }
    // if (holeScore) {
    //   setStrokes(holeScore.strokes);
    //   setPutts(holeScore.putts);
    //   setPenalties(holeScore.penalties);
    // } else {
    //   setStrokes(0);
    //   setPutts(0);
    //   setPenalties(0);
    // }
  }, [currentHole, holes, strokes]);

  useEffect(() => {
    roundHistory();
  }, []);

  const getAllHoles = async ({ roundId }) => {
    try {
      const allHoles = await fetchHoles({ auth, roundId });
      console.log("FETCH HOLE: ", allHoles.data);
      setHoles(allHoles.data.holes);
      setStrokes(allHoles.data.strokes);
      setCurrentRoundId(roundId);
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
    // setCurrentHole(currentHole + 1)
    // setTotalStrokes(totalStrokes + parseInt(strokes));
    // setTotalPutts(totalPutts + parseInt(putts));
    // setTotalPenalties(totalPenalties + parseInt(penalties));
    // setTotalScore(totalStrokes + parseInt(strokes))
    // setStrokes(0);
    // setPutts(0);
    // setPenalties(0);
  };

  const handlePreviousHole = async () => {
    await postScore(holeScore);
    setCurrentHole(currentHole - 1);
    // updateCurrentHoleScore();
    // setCurrentHole(currentHole > 1 ? currentHole - 1 : holes.length);
  };

  const updateCurrentHoleScore = () => {
    const updatedScores = scores.map((score) =>
      score.holeId === holes[currentHole - 1].id
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
    const holeId = holes[currentHole - 1]?.id;
    console.log("Auth: ", auth);
    const roundId = currentRoundId;
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
      await setHoleScore(response.data.strokes);
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

  


  return (
    <div className="round-container">
      <h1 className="title">Track Round</h1>
      <h3 className="course-name">Lakeside Golf Course</h3>
      <h5 className="my-auto mx-3">Current Score: {holeScore}</h5>
      <div id="track-round">
        <h2 className="mt-1">Hole</h2>
        <div className="nav-arrow" onClick={handlePreviousHole}></div>
        <h2 className="my-auto mx-3">{holes[currentHole - 1]?.hole_number}</h2>
        <div className="nav-arrow" onClick={handleNextHole}></div>
      </div>
      <h3>Par: {holes[currentHole - 1]?.par}</h3>
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
          <button
            className="button previous-hole-button"
            onClick={handlePreviousHole}
          >
            Previous
          </button>
        ) : null}
        {currentHole === holes.length ? (
          <Link to="/score">
            <button className="complete-round-button">Complete Round</button>
          </Link>
        ) : null}
        {currentHole < holes.length ? (
          <button className="button next-hole-button" onClick={handleNextHole}>
            Next
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default TrackRound;
