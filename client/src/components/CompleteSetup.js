import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/CompleteSetup.css';

import logo from '../img/trello.png';

function CompleteSetup() {
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleCompleteSetup = async () => {
        try {
            const email = sessionStorage.getItem('email');

            const response = await fetch('http://localhost:8000/complete-setup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullName, password, email: email }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Account setup complete');
                navigate('/login');
            } else {
                alert(`Failed to complete setup: ${data.message}`);
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="complete-setup-page">
            <div className="complete-setup-form-container">
                <div className="complete-setup-header">
                    <div className="complete-setup-logo-container">
                        <img src={logo} alt="EpiTrello Logo" className="complete-setup-logo" />
                        <h2>EpiTrello</h2>
                    </div>
                    <h1>Email address verified</h1>
                    <p>Finish setting up your account.</p>
                </div>
                <div className="complete-setup-form">
                    <input
                        type="text"
                        placeholder="Enter full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Create password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleCompleteSetup}>Continue</button>
                </div>
            </div>
        </div>
    );
}

export default CompleteSetup;