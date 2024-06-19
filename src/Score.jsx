import React, { useState, useEffect, useContext } from 'react';
import { getScores, updateScore, createScore, deleteScore, getCurrentRound, fetchRoundsHistory } from './api';
import { AuthContext } from './authContext';
import { useNavigate } from 'react-router-dom';
import TrackRound from './Round';

const Score = () => {
    const [scores, setScores] = useState([]);
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
            setScores(scores.map(score => (score.id === editScoreId ? response.data : score))); //checking if the post ID matches the edit post ID if it doesn't match it leaves the post unchanged 
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
        const format = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }; 
        return new Date(dateString).toLocaleDateString(undefined, format);
    };


    return (
        <div className="round-history-container">
            <div className="create-post-container">
                <h3>Round History</h3>
                {roundHistory.map(round => ( 
                    <div key={round.id} className="round-summary">
                        <h4>Course: {round.course.name}</h4>
                        <p>Date: {scoreDate(round.date)}</p>
                        <p>Total Strokes: {round.scores.strokes}</p>
                        <p>Total Putts: {round.total_putts}</p>
                        <p>Total Penalties: {round.total_penalties}</p>
                    </div>
                ))}
                <button onClick={() => navigate('/round')}>Start Round</button>
            </div>
            <div className="posts-container">
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
            </div>
        </div>
    );
};


export default Score;
