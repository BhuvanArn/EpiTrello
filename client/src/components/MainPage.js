import React, { useContext } from 'react';
import '../assets/css/Main.css';

import { AuthContext } from '../auth/AuthContext';
import Navbar from './Navbar';
import HomeContainer from './Home';

function Main() {
  const { user } = useContext(AuthContext);

  return (
    <div className={`main-page ${user ? 'main-page-dark' : 'main-page-bright'}`}>
      <Navbar />
      {user && (
        <HomeContainer infos={user} />
      )}
      {!user && (
        <div className='first-page'>

        </div>
      )}
      {/* <h1>EpiTrello</h1>
      <h2>Welcome, {user ? user.name : 'Guest'}</h2> */}
    </div>
  );
}

export default Main;
