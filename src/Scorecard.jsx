import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getRoundDetails } from './api';  
import { AuthContext } from './authContext';
import { RoundContext } from './roundContext';
import { Link } from 'react-router-dom';
import { GoArrowLeft } from "react-icons/go";


const ScoreCard = () => {
    const { auth } = useContext(AuthContext);
    const { round } = useContext(RoundContext)
    const [roundDetails, setRoundDetails] = useState(null);

    useEffect(() => {
        getRoundDetails({ auth, roundId: round.currentRoundId })
            .then(response => {
                setRoundDetails(response.data);
                console.log('Round Details: ', response.data);
            })
            .catch(error => {
                console.error('Error fetching round details: ', error);
            });
    }, [auth, round.currentRoundId]);

    if (!roundDetails) {
        return <div>Loading...</div>;
    }


    const holeScores = roundDetails ? roundDetails.scores.map((score, i) => (
        <tr key={score.hole}>
            <td>{score.hole}</td>
            <td>{round.holes[i].par}</td>
            <td><div className={score.strokes > round.holes[i].par ? 'border' : ''}>{score.strokes}</div></td>
            {/* <td>{score.putts}</td>
            <td>{score.penalties}</td> */}
        </tr>
    )) : null;
            console.log("SCORE", roundDetails.scores)
    return (
        <div className="scorecard-container mt-5">
            <Link to='/round'>
                <GoArrowLeft className='back-button'><h6>Back</h6></GoArrowLeft>
                </Link>
            <h2>Scorecard</h2>
            <h3>{roundDetails.course.name}</h3>
            <table className="scorecard-table">
                <thead>
                    <tr>
                        <th>Hole</th>
                        <th>Par</th>
                        <th>Score</th>
                        {/* <th>Putts</th>
                        <th>Penalties</th> */}
                    </tr>
                </thead>
                <tbody>
                    {holeScores}
                </tbody>
            </table>
            {/* <Link to='/score'><button className="btn">Complete Round</button></Link> */}
        </div>
    );
};

export default ScoreCard;
