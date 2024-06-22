import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';  

const LandingPage = () => {
    return (
        <div className="landing-page">
            <nav className="navbar">
                <h1 className="site-name">Course Caddy</h1>
                <div className="nav-links">
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>
            </nav>
            <div className="hero">
                <h2 className="hero-text">Welcome to Course Caddy</h2>
                <p className="hero-subtext">Your ultimate golf course companion</p>
                <Link to="/login" className="cta-button">Get Started</Link>
            </div>
        </div>
    );
};

export default LandingPage;

