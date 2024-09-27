import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Navbar.css';

function Navbar() {

  return (
    <header className="header">
      <div className="logo">
        <Link to={"/"}>EpiTrello</Link>
      </div>
    </header>
  );
}

export default Navbar;
