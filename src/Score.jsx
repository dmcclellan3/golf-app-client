import React, { useState, useEffect, useContext } from 'react';
import { getScores, updateScore, createScore, deleteScore, getCurrentRound, fetchRoundsHistory, createRound } from './api';
import { AuthContext } from './authContext';
import { useNavigate } from 'react-router-dom';
import TrackRound from './Round';

const Score = () => {
    const [scores, setScores] = useState(0);
    const [newScore, setNewScore] = useState();
    const [editScoreId, setEditScoreId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [roundHistory, setRoundHistory] = useState([])
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate()

// Fetches post from api, logs response and sets the posts from the data stored at the end point. 

    // useEffect(() => {
    //     getScores({ auth })
    //         .then(response => {
    //             console.log('Scores RESPONSE: ', response);
    //             setScores(response.data);
    //         })
    //         .catch(error => console.error('Error fetching posts:', error));
    // }, [auth]);

    // Updates the screen with a new score entered that is called below 

    useEffect(() => {
        fetchRoundsHistory({ auth })
        .then(response => {
            console.log('FETCH ROUND RESPONSE: ', response)
            setRoundHistory(response.data)
        })
        .catch(error => console.log('ERROR: ', error))
    }, [auth]);  

  

       

    

    const handleNewScore = (e) => {
        setNewScore(e.target.value);
    };

    // Handles the submission of a new score 
    // calls createScore function from api 
    // sets the score and logs any errors 

    const handleScoreSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createScore({ auth, content: newScore });
            console.log('CREATE SCORE RESPONSE: ', response);
            setScores([...scores, response.data]);
            setNewScore('');
        } catch (error) {
            console.error('ERROR CREATING SCORE:', error);
        }
    };


    const handleEditScore = (score) => {
        setEditScoreId(score.id);
        setEditContent(score.content);
    };

    //Handles form submission to update, calls the API endpoint 
    //

    const handleUpdateScore = async (e) => {
        e.preventDefault();
        try {
            const response = await updateScore({ auth, scoreId: editScoreId, content: editContent });
            console.log('UPDATE SCORE RESPONSE: ', response);
            // const scoreTotal = 0
            // response.data.map(score = scoreTotal += score.strokes)
            // setScores(scoreTotal)
            setEditScoreId(null); 
            setEditContent('');  
        } catch (error) {
            console.error('Error UPDATING SCORE:', error);
        }
    };

    const handleEditContentChange = (e) => {
        setEditContent(e.target.value);
    };


    const handleDeleteScore = async (scoreId) => {
        try {
            await deleteScore({ auth, scoreId });
            setScores(scores.filter(score => score.id !== score.Id));  
            console.log('SCORE DELETED!');
        } catch (error) {
            console.error('ERROR DELETING SCORE: ', error);
        }
    };


    const scoreDate = (dateString) => {
        const format = { year: 'numeric', month: 'long', day: 'numeric' }; 
        return new Date(dateString).toLocaleDateString(undefined, format);
    };

    const handleStartNewRound = async () => {
        try {
            const response = await createRound({ auth, courseId: 1 }); 
            console.log('NEW ROUND CREATED: ', response.data);
            navigate(`/round/`); 
        } catch (error) {
            console.error('ERROR CREATING NEW ROUND: ', error);
        }
    };


    
    
    const Round = ({ round }) => {
        const [roundTotalStrokes, setRoundTotalStrokes] = useState(0)
        console.log('ROUND RESPONSE: ', round)
        useEffect(
            () => {
            
                let strokeTotal = 0
                round.scores.map(x => strokeTotal = strokeTotal + x.strokes)
                setRoundTotalStrokes(strokeTotal)
            },
            []
        )
        return (
            <div key={round.id} className="round-summary">
                <h4>{round.course.name}</h4>
                <p>{scoreDate(round.date)}</p>
                <p><strong>Total Strokes:</strong> {roundTotalStrokes}</p>
                {/* <p><strong>Total Putts:</strong> {round.total_putts}</p>
                <p><strong>Total Penalties:</strong> {round.total_penalties}</p> */}
            </div>
        )
    }


    return (
        <div className="round-history-container">
            <div className="create-post-container">
                <button className='new-round-button'onClick={handleStartNewRound}>Start New Round</button>
                <br />
                <br />
                <h3>Round History</h3>
                {roundHistory.map(round => ( 
                    <Round round={round} />
                ))}
            </div>
            {/* <div className="posts-container">
                {scores && scores.map(score => (
                    <div className="post" key={score.id}>
                        <h5>{score.username}</h5>
                        {editScoreId === score.id ? (
                            <form onSubmit={handleUpdateScore} className="edit-post-form">
                                <textarea
                                    value={editContent}
                                    onChange={handleEditContentChange}
                                    placeholder="Update your score"
                                />
                                <button type="submit">Update</button>
                                <button type="button" onClick={() => setEditScoreId(null)}>Cancel</button>
                            </form>
                        ) : (
                            <p>{score.content}</p>
                        )}
                        <div>{scoreDate(score.created_at)}</div>
                        <div className="post-actions">
                            <button onClick={() => handleDeleteScore(score.id)}>Delete</button>
                            <button onClick={() => handleEditScore(score)}>Edit</button>
                        </div>
                    </div>
                ))}
            </div> */}
        </div>
    );
};


export default Score;
