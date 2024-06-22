import { useContext } from "react"
import { AuthContext } from "./authContext"
import { useState } from 'react'
import { getToken, createUser } from './api'
import { useNavigate, useLocation } from "react-router-dom"
import './Login.css'

const CreateUser = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const submit = () => {
    createUser({ username, password, firstName, lastName })
  }

  return (
    <div className="auth-container">
        <div className="form-container">
        <div className="p-3">
      <h2>Create User</h2>
      <div>
        <div className="form-group">
            <input
             placeholder="Username"
             onChange={e => setUsername(e.target.value)}
             value={username}
            />
        </div>
      </div>
      <div>
        <div className="form-group">
            <input
             placeholder="Password"
             onChange={e => setPassword(e.target.value)}
             value={password}
             type='password'
             />
        </div>
      </div>
      <div>
        <div className="form-group">
            <input
             placeholder="First Name"
             onChange={e => setFirstName(e.target.value)}
             value={firstName}
            />
        </div>
      </div>
      <div>
        <div className="form-group">
            <input
                placeholder="Last Name"
                onChange={e => setLastName(e.target.value)}
                value={lastName}
            />
        </div>
      </div>

      <div style={{ marginTop: 20, borderRadius: '5px' }}>
        <button className='submit-button'onClick={() => submit()}>Submit</button>
      </div>
        </div>
    </div>
    </div>

  )
}

function Login() {
  const { auth, setAuth } = useContext(AuthContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

const submit = () => {
  getToken({ auth, username, password })
    .then(response => {
      console.log('get TOKEN RESPONSE: ', response)
      auth.setAccessToken(response.data.access)
      // fetchProfile({ auth : {accessToken : response.data.access}})
    })
    .then(() => navigate('/score'))
    .catch(error => console.log('Error: ', error))
}


  return (
    <div className="auth-container mt-5">
        <div className="form-container">
        <div className="p-3">
            <h2>Login</h2>
      
      <div>
            <div className="form-group">
                <input
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                />
            </div>
      </div>
        <div>
            <div className="form-group">
                <input
                    placeholder="Password"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    type="password"
                />
            </div>
        </div>
            <div style={{ marginTop: 20 }}>
                <button className="submit-button" onClick={() => submit()}>Submit</button>
            </div>
        </div>
        </div>
        
      <CreateUser />
    </div>

    
   

   
  )
}


export default Login
