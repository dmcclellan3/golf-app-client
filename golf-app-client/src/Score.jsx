import React, { useState, useEffect, useContext } from 'react';
import { getScores, updateScore, createScore, deleteScore } from './api';
import { AuthContext } from './authContext';

const Score = () => {
    const [scores, setScores] = useState([]);
    const [newScore, setNewScore] = useState('');
    const [editScoreId, setEditScoreId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const { auth } = useContext(AuthContext);

// Fetches post from api, logs response and sets the posts from the data stored at the end point. 

    useEffect(() => {
        getScores({ auth })
            .then(response => {
                console.log('Scores RESPONSE: ', response);
                setScores(response.data);
            })
            .catch(error => console.error('Error fetching posts:', error));
    }, [auth]);

    // Updates the screen with a new post entered that is called below 

    const handleNewScore = (e) => {
        setNewPost(e.target.value);
    };

    // Handles the submission of a new post 
    // calls createPost function from api 
    // sets the post and logs any errors 

    const handleScoreSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createScore({ auth, content: newPost });
            console.log('CREATE SCORE RESPONSE: ', response);
            setScores([response.data, ...posts]);
            setNewScore('');
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    //edits post ID and content 

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
            setEditScoreId(null); //clears the edit post ID that nothing is being edited.  Returns the component to a default state 
            setEditContent(''); //resets the edit form to an empty string 
        } catch (error) {
            console.error('Error UPDATING SCORE:', error);
        }
    };

    const handleEditContentChange = (e) => {
        setEditContent(e.target.value);
    };


    // calls delete from API and removes based off the Post ID 
    const handleDeleteScore = async (scoreId) => {
        try {
            await deleteScore({ auth, scoreId });
            setScores(scores.filter(score => score.id !== score.Id));  
            console.log('SCORE DELETED!');
        } catch (error) {
            console.error('ERROR DELETING SCORE: ', error);
        }
    };

    //allows for date format on post 

    const scoreDate = (dateString) => {
        const format = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }; 
        return new Date(dateString).toLocaleDateString(undefined, format);
    };

    //page render 

    return (
        <div className="feed-container">
            <nav className="nav-bar">
                <a href="/score">Scores</a>
                <a href="/login">Login</a>
                <a href="/">Profile</a>
            </nav>
            <div className="create-post-container">
                <h3>Record a Score</h3>
                <div>
                    <input
                        type='text'
                        value={newScore}
                        onChange={handleNewScore}
                        placeholder="Enter Score"
                    />
                </div>
                <br />
                <button onClick={handleScoreSubmit}>Enter</button>
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
                            <button onClick={() => handleDeleteScore(post.id)}>Delete</button>
                            <button onClick={() => handleEditScore(post)}>Edit</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Score;
