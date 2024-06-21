import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getRoundDetails } from './api';  
import { AuthContext } from './authContext';
import { RoundContext } from './roundContext';
import { Link } from 'react-router-dom';


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


    const holes = roundDetails.scores.map(score => (
        <tr key={score.hole}>
            <td>{score.hole}</td>
            <td>{score.par}</td>
            <td>{score.strokes}</td>
            {/* <td>{score.putts}</td>
            <td>{score.penalties}</td> */}
        </tr>
    ));
            console.log("SCORE", roundDetails.scores)
    return (
        <div className="scorecard-container mt-5">
            <Link to='/round'><h6>Back</h6></Link>
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
                    {holes}
                </tbody>
            </table>
        </div>
    );
};

export default ScoreCard;
