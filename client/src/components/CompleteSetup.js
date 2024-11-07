import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/CompleteSetup.css';

function CompleteSetup() {
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleCompleteSetup = async () => {
        try {
            const response = await fetch('http://localhost:8000/complete-setup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullName, password }),
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
                <h1>Email address verified</h1>
                <p>Finish setting up your account.</p>
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