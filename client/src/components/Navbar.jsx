import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { AuthContext } from '../auth/AuthContext';

import CreateBoardModal from './CreateBoardModal';
import CreateWorkspaceModal from './CreateWorkspaceModal';
import Tooltip from './lib/Tooltip';
import StarredBoardsDropdown from './StarredBoardsDropdown';

import '../assets/css/Navbar.css';

function Navbar() {
  const { user } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [starredBoardsDropdownOpen, setStarredBoardsDropdownOpen] = useState(false);
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [tooltipVisible, setTooltipVisible] = useState({});

  const toggleDropdown = (id) => {
    setDropdownOpen(!dropdownOpen);
    setTooltipVisible((prev) => ({ ...prev, [id]: false }));
  };

  const toggleStarredBoardsDropdown = () => {
    setStarredBoardsDropdownOpen(!starredBoardsDropdownOpen);
  };

  const handleMouseEnter = (id) => {
    setTooltipVisible((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id) => {
    setTooltipVisible((prev) => ({ ...prev, [id]: false }));
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target) && (event.target.className !== 'account-picture' && event.target.className !== 'fas fa-user-circle')) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleClickOutside);
    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, []);

  const goToLogin = () => {
    window.location.href = '/login';
  };

  const goToSignup = () => {
    window.location.href = '/signup';
  }

  const openWorkspaceModal = () => {
      setWorkspaceModalOpen(true);
  };

  const closeWorkspaceModal = () => {
      setWorkspaceModalOpen(false);
  };

  return (
    <div className="header-container">
      <nav className="header">
        <a href="/" aria-label="Back to home" className="A-0">
          <div className="DIV-0">
            <div data-loading="false" className="DIV-1"/>
          </div>
        </a>
        <div className="nav-buttons">
          <div className="nav-buttons-responsive">
            <div className="nav-each-buttons">
            {/* Navbar when logged in */}
            {user && (
              <>
                <button className="nav-button" onClick={openWorkspaceModal}>
                  <span>Workspaces</span>
                  <span className="nav-button-icon">
                    <svg width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.2929 16.7071L4.22185 9.63606C3.83132 9.24554 3.83132 8.61237 4.22185 8.22185C4.61237 7.83133 5.24554 7.83133 5.63606 8.22185L12 14.5858L18.364 8.22185C18.7545 7.83132 19.3877 7.83132 19.7782 8.22185C20.1687 8.61237 20.1687 9.24554 19.7782 9.63606L12.7071 16.7071C12.3166 17.0977 11.6834 17.0977 11.2929 16.7071Z" fill="currentColor"></path></svg>
                  </span>
                </button>
                <button className="nav-button">
                  <span>Recent</span>
                  <span className="nav-button-icon">
                    <svg width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.2929 16.7071L4.22185 9.63606C3.83132 9.24554 3.83132 8.61237 4.22185 8.22185C4.61237 7.83133 5.24554 7.83133 5.63606 8.22185L12 14.5858L18.364 8.22185C18.7545 7.83132 19.3877 7.83132 19.7782 8.22185C20.1687 8.61237 20.1687 9.24554 19.7782 9.63606L12.7071 16.7071C12.3166 17.0977 11.6834 17.0977 11.2929 16.7071Z" fill="currentColor"></path></svg>
                  </span>
                </button>
                <button className="nav-button" onClick={toggleStarredBoardsDropdown}>
                  <span>Starred</span>
                  <span className="nav-button-icon">
                    <svg width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.2929 16.7071L4.22185 9.63606C3.83132 9.24554 3.83132 8.61237 4.22185 8.22185C4.61237 7.83133 5.24554 7.83133 5.63606 8.22185L12 14.5858L18.364 8.22185C18.7545 7.83132 19.3877 7.83132 19.7782 8.22185C20.1687 8.61237 20.1687 9.24554 19.7782 9.63606L12.7071 16.7071C12.3166 17.0977 11.6834 17.0977 11.2929 16.7071Z" fill="currentColor"></path></svg>
                  </span>
                </button>
                {starredBoardsDropdownOpen && (
                    <StarredBoardsDropdown closeDropdown={() => setStarredBoardsDropdownOpen(false)} />
                )}
                <button className="nav-button">
                  <span>Templates</span>
                  <span className="nav-button-icon">
                    <svg width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.2929 16.7071L4.22185 9.63606C3.83132 9.24554 3.83132 8.61237 4.22185 8.22185C4.61237 7.83133 5.24554 7.83133 5.63606 8.22185L12 14.5858L18.364 8.22185C18.7545 7.83132 19.3877 7.83132 19.7782 8.22185C20.1687 8.61237 20.1687 9.24554 19.7782 9.63606L12.7071 16.7071C12.3166 17.0977 11.6834 17.0977 11.2929 16.7071Z" fill="currentColor"></path></svg>
                  </span>
                </button>
              </>
            )}
            {/* Navbar when logged in */}
            {!user && (
              <>
                <button className='nav-button' onClick={goToLogin}>
                  <span className="login-button-text">Log in</span>
                </button>
                <button className='nav-button' onClick={goToSignup}>
                  <span className="signup-button-text">Sign up</span>
                </button>
              </>
            )}
            </div>
            {user && (
              <CreateBoardModal />
            )}
          </div>
        </div>
        {user && (
          <>
            <div className="account-button" onClick={() => toggleDropdown('account')} onMouseEnter={() => handleMouseEnter('account')} onMouseLeave={() => handleMouseLeave('account')}>
            {user.picture === null && (
                <i className="fas fa-user-circle" style={{ fontSize: '32px', color: 'rgb(87, 157, 255)', marginTop: 'auto' }}></i>
              )}
              {user.picture !== null && (
                <img
                  src={user.picture}
                  alt="User"
                  className="account-picture"
                />
              )}
            </div>
            {createPortal(
              <Tooltip visible={tooltipVisible['account']} text="Account" position={{ top: '44px', right: '4px' }} />,
              document.body
            )}
          </>
        )}
      </nav>
      <div style={{ zIndex: 1 }} className="invisible-objects">
        {user && (<section className={`dropdown-menu ${dropdownOpen ? 'active' : ''}`} ref={dropdownRef}>
          <div className="dropdown-field">
            <h2>Account</h2>
            <div className="account-info">
              {user.picture === null && (
                <i className="fas fa-user-circle" style={{ fontSize: '40px', color: 'rgb(87, 157, 255)', marginTop: 'auto' }}></i>
              )}
              {user.picture !== null && (
                <img src={user.picture} alt="User" className="account-picture" />
              )}
              <div className="account-details">
                <span className="fullname">{user.name}</span>
                <span className="email">{user.email}</span>
              </div>
            </div>
          </div>
          <li></li>
          <div className="dropdown-field">
            <h2>Trello</h2>
            <nav>
              <Link to="/profile">Profile and visibility</Link>
              <Link to="/activity">Activity</Link>
              <Link to="/cards">Cards</Link>
              <Link to="/settings">Settings</Link>
              <Link to="/theme">Theme</Link>
            </nav>
          </div>
          <li></li>
          <div className="dropdown-field">
            <nav>
              <Link onClick={openWorkspaceModal}>Create workspace</Link>
            </nav>
          </div>
          <li></li>
          <div className="dropdown-field">
            <nav>
              <Link to="/help">Help</Link>
              <Link to="/shortcuts">Shortcuts</Link>
            </nav>
          </div>
          <li></li>
          <div className="dropdown-field">
            <button onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/';
            }} style={{ width: '100%', height: '100%' }}>Log out</button>
          </div>
        </section>
        )}
      </div>
      {workspaceModalOpen && (
        <CreateWorkspaceModal closeModal={closeWorkspaceModal} />
      )}
    </div>
  );
}

export default Navbar;