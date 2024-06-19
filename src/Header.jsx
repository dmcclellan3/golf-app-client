import { Link } from 'react-router-dom'


function Header() {
    return (
      <div className='NavBar'>
      
        <span className='m-3'>
          <Link to="/login">Login</Link>
        </span>
        <span className='m-3'>
          <Link to="/score">Scores</Link>
        </span>
      
      </div>
    );
  }

  
  
  export default Header