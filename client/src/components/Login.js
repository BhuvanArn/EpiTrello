import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Login.css';

import logo from '../img/trello.png'; // logo

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Login successful! Token: ${data.token}`);
                // Store the token in localStorage or state for future use
                localStorage.setItem('token', data.token);
            } else {
                alert(`Login failed: ${data.message}`);
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="login-page">
            <div className="login-form-container">
                <div className="login-header">
                    <div className="login-logo-container">
                        <img src={logo} alt="EpiTrello Logo" className="login-logo" />
                        <h2>EpiTrello</h2>
                    </div>
                    <h1>Log in to continue</h1>
                </div>
                <div className="login-form">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin}>Continue</button>
                    <div className="additional-links">
                        <Link to="/forgot-password">Can't log in?</Link>
                        <span className="separator">•</span>
                        <Link to="/signup">Create an account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;