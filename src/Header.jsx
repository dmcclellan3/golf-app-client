import { Link } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav';

function Header() {
    return (
      <div className='NavBar'>
      <Nav defaultActiveKey="/home" as="ul">
        <Nav.Item as="li">
          <Nav.Link href="/login">Login</Nav.Link>
        </Nav.Item>
        <Nav.Item as="li">
          <Nav.Link eventKey="/Score">Scores</Nav.Link>
        </Nav.Item>
        <Nav.Item as="li">
          <Nav.Link eventKey="link-2">Link</Nav.Link>
        </Nav.Item>
      </Nav>
      </div>
    );
  }

  
  
  export default Header