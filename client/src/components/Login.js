import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

import '../assets/css/Login.css';

import logo from '../img/trello.png'; // logo

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

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
                if (data.message && data.message === 'User not found') {
                    navigate('/signup');
                } else {
                    alert(`Failed to login: ${data.message}`);
                }
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const handleGoogleLoginSuccess = async (response) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/google-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ credential: response.credential }),
            });

            const data = await res.json();

            if (res.ok) {

                // Store the token in localStorage or state for future use
                localStorage.setItem('token', data.token);
                console.log('Google login successful');
                navigate('/home');
            } else {
                if (data.message && data.message === 'User not found') {
                    navigate('/signup');
                } else {
                    alert(`Failed to login: ${data.message}`);
                }
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const handleGoogleLoginFailure = (response) => {
        console.log('Google login failure:', response);
        alert('Google login failed');
    };

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
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
                        <div className='signup-oauth'>
                            <h2>Or continue with:</h2>
                            <GoogleLogin
                                onSuccess={handleGoogleLoginSuccess}
                                onFailure={handleGoogleLoginFailure}
                                render={(renderProps) => (
                                    <button onClick={renderProps.onClick} disabled={renderProps.disabled}>
                                        <span className="svg-icon">
                                            <svg width="24px" height="24px" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"/><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"/><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"/><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"/></svg>
                                        </span>
                                        Google
                                    </button>
                                )}
                            />
                            <button className='microsoft-btn'>
                                <span className='svg-icon'>
                                <svg width="24px" height="24px" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="17" y="17" width="10" height="10" fill="#FEBA08"/><rect x="5" y="17" width="10" height="10" fill="#05A6F0"/><rect x="17" y="5" width="10" height="10" fill="#80BC06"/><rect x="5" y="5" width="10" height="10" fill="#F25325"/>             </svg>
                                </span>
                                Microsoft
                            </button>
                        </div>
                        <div className="additional-links">
                            <Link to="/forgot-password">Can't log in?</Link>
                            <span className="separator">•</span>
                            <Link to="/signup">Create an account</Link>
                        </div>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}

export default Login;