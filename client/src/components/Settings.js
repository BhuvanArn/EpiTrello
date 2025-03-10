import React/*, { useContext }*/ from 'react';
import '../assets/css/Settings.css';

// import { AuthContext } from '../auth/AuthContext';
import Navbar from './Navbar';

function SettingsPage() {
    // const { user } = useContext(AuthContext);

    return (
        <div className={`main-page main-page-dark`}>
          <Navbar />
          <main className='settings-page'>

          </main>
        </div>
    );
}

export default SettingsPage;
