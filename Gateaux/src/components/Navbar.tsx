import React from 'react';
import '../assets/CSS/Navbar.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../pages/auth/AuthUtils';
import { AuthContext } from '../pages/auth/AuthContext';


const Navbar: React.FC = () => {
  const auth = useAuth(AuthContext);
  
  return (
    <nav className="navbar">
      <div className="centered-items">
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
      <div className="right-items">
        {auth.user ? (
          <>
            <span>Bonjour, {auth.user.name}</span> 
            {auth.user.role === 'admin' && (
              <Link to="/dashboard">Dashboard</Link> 
            )}
            <button onClick={() => auth.logout()}>Déconnexion</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
