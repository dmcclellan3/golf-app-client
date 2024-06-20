import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from './Header'
import Login from './Login'
import Score from './Score'
import TrackRound from './Round'
import ErrorPage from './ErrorPage'
import { useState } from 'react'
import { AuthContext } from './authContext'
import { RoundContext } from './roundContext.jsx'
import ScoreCard from './Scorecard.jsx'


function Layout() {
  return (
    <>
      <Header />
      <div id='page-content'>
        <Outlet />
      </div>
      {/* <Footer /> */}
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <App />,
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/score',
        element: <Score />
      },
      {
        path: '/round',
        element: <TrackRound />
      },
      {
        path: '/scorecard',
        element: <ScoreCard/>      
      }
      
    ]
  }
])

const AuthContextProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState('')
  
  const auth = {
    accessToken,
    setAccessToken
  }

  return (
    <AuthContext.Provider value={{ auth }}>
      {children}
    </AuthContext.Provider>
  )
}

const RoundContextProvider = ({ children }) => {
  const [currentRoundId, setCurrentRoundId] = useState('')
  
  const round = {
    currentRoundId,
    setCurrentRoundId
  }

  return (
    <RoundContext.Provider value={{ round }}>
      {children}
    </RoundContext.Provider>
  )
}


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <RoundContextProvider>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
    </RoundContextProvider>
)
