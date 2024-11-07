import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Navbar.css';

function Navbar() {

  return (
    <header className="header">
      <div className="logo">
        <Link to={"/"}>EpiTrello</Link>
      </div>
      <nav>
        <div>
          <i className="fas fa-user-circle" style={{ fontSize: '40px', color: '#b38282', marginTop: 'auto' }}></i>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;