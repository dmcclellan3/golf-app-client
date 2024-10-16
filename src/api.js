import axios from 'axios'


export const baseUrl = import.meta.env.VITE_BASE_URL
// console.log('baseURL: ', baseUrl)

// Sends a request to the backend API endpoint with the parameters
// specifying the information requested.  username, password etc. 

export const createUser = ({ username, password, firstName, lastName }) => {
    console.log('CREATE USER: ', username, password, firstName, lastName)
    axios({
        method: 'post',
        url: `${baseUrl}/create-user/`, 
        data: {
            username,           
            password,
            first_name: firstName, 
            last_name: lastName,
        }
    })
    .then(response => {
        console.log('CREATE USER RESPONSE: ', response)
    })
    .catch(error => console.log('ERROR: ', error))
}

// Requests on authentication token after credentials are entered

export const getToken = ({ auth, username, password }) => {
    // console.log('get TOKEN: ', auth, username, password)
    return axios.post(`${baseUrl}/token/`, {
        username,
        password,
    })
}


export const fetchProfile = ({ auth }) => {
    axios({
        method: 'get',
        url:`${baseUrl}/login/`,
        headers: {
            Authorization: `Bearer ${auth.accessToken}`
        }
    }).then(response => {
        // console.log('FETCH PROFILE RESPONSE: ', response)
    }).catch(error => console.log('ERROR: ', error))
}


export const createScore = ({ auth, content }) => {
    // console.log('CREATE SCORE: ', auth, content)
    return axios({
        method: 'post',
        url: `${baseUrl}/create-score/`,
        headers: {
            Authorization: `Bearer ${auth.accessToken}`
        },
        data: {
            content
        }
    })
    .then(response => {
        // console.log('CREATE SCORE RESPONSE: ', response)
        return response
    })
    .catch(error => console.log('ERROR: ', error))

}


export const updateScore = ({ auth, scoreId, content }) => {
    console.log("edit score id", scoreId)
    console.log("content", content)
    return axios({
        method: 'PUT',
        url: `${baseUrl}/scores/${scoreId}/`,
        headers: {
            Authorization: `Bearer ${auth.accessToken}`,
        },
        data: {
            content,
        },
    })
    .then(response => {
        console.log('UPDATE SCORE: ', response)
        return response
    })
    .catch(error => console.log('ERROR: ', error))
};


export const deleteScore = ({ auth, scoreId }) => {
    return axios({
        method: 'DELETE',
        url: `${baseUrl}/scores/${scoreId}/`,
        headers: {
            Authorization: `Bearer ${auth.accessToken}`,
        }
    })
    .then(response => {
        console.log('DELETE SCORE RESPONSE: ', response)
        return response
    })
    .catch(error => console.log('ERROR: ', error))
};

// Fetches all the scores

export const getScores = ({ auth }) => {
    console.log('GET SCORES: AUTH: ', auth.accessToken)
    return axios({
        method: 'get',
        url:`${baseUrl}/rounds-history/`,
        headers: {
            Authorization: `Bearer ${auth.accessToken}`
        }
    })
}

export const createCourse = ({ name, location }) => {
    console.log('CREATE COURSE: ', name, location )
    axios({
        method: 'post',
        url: `${baseUrl}/courses/`, 
        data: {
            name,
            location
        }
    })
    .then(response => {
        console.log('CREATE COURSE RESPONSE: ', response)
    })
    .catch(error => console.log('ERROR: ', error))
}

export const fetchCourses = (auth) => {
    return axios.get(`${baseUrl}/courses/`, {
        headers: {
            'Authorization': `Bearer ${auth.accessToken}`
        }
    });
};

export const getCurrentRound = ({ auth }) => {
    console.log('GET ROUND: AUTH: ', auth.accessToken)
    return axios({
        method: 'get',
        url:`${baseUrl}/get-current-round/`,
        headers: {
            Authorization: `Bearer ${auth.accessToken}`
          }
    })
}


export const createRound = ({ auth, courseId }) => {
    console.log('CREATE ROUND: ', auth, courseId);
    return axios({
        method: 'post',
        url: `${baseUrl}/create-round/`,
        headers: {
            Authorization: `Bearer ${auth.accessToken}`
        },
        data: {
            course_id: courseId
        }
    })
    .then(response => {
        console.log('CREATE ROUND RESPONSE: ', response);
        return response;
    })
    .catch(error => console.log('ERROR: ', error));
};

export const fetchHoles = ({ auth, roundId }) => {
    console.log('FETCH HOLES: ', auth.accessToken)
    return axios({
        method: 'get',
        url:`${baseUrl}/get-hole/${roundId}`,
        headers: {
            Authorization: `Bearer ${auth.accessToken}`
          }
    })
}

export const fetchRoundsHistory = ({ auth }) => {
    console.log('FETCH ROUNDS HISTORY: ', auth.accessToken);
    return axios({
        method: 'get',
        url: `${baseUrl}/rounds-history/`,
        headers: {
            Authorization: `Bearer ${auth.accessToken}`
        }
    });
};

export const getRoundDetails = ({ auth, roundId}) => {
    console.log('FETCH ROUND DETAILS: ', )
    return axios({
        method: 'get',
        url: `${baseUrl}/round-details/${roundId}`,
        headers: {
            Authorization: `Bearer ${auth.accessToken}`
        }
    });
};
