import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// google oauth
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

import '../assets/css/Signup.css';

import logo from '../img/trello.png';

const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function Signup() {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerificationSent, setIsVerificationSent] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            const response = await fetch('http://localhost:8000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsVerificationSent(true);
                alert(`Verification email sent to ${email}`);
            } else {
                alert(`Failed to create account: ${data.message}`);
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const handleVerifyEmail = async () => {
        try {
            const response = await fetch('http://localhost:8000/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code: verificationCode }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Email address verified');

                // store email in session
                sessionStorage.setItem('email', email);

                navigate('/complete-setup');
            } else {
                alert(`Invalid token: ${data.message}`);
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const handleGoogleLoginSuccess = async (response) => {
        try {
            const res = await fetch(`http://localhost:8000/google-signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ credential: response.credential }),
            });

            const data = await res.json();

            if (res.ok) {
                console.log('Google signup success:', data);

                // store email in session
                sessionStorage.setItem('email', data.email);
                navigate('/complete-setup');
            } else {
                alert(`Failed to login with Google: ${data.message}`);
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const handleGoogleLoginFailure = (response) => {
        console.log('Google login failure:', response);
    };

    return (
        <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>
            <div className="signup-page">
                <div className="signup-form-container">
                    <div className="signup-logo-container">
                        <img src={logo} alt="Trello Logo" />
                        <h2>Epitrello</h2>
                    </div>
                    <div className="signup-header">
                        <h2>Sign up to continue</h2>
                    </div>
                    <div className="signup-form">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isVerificationSent}
                        />
                        {isVerificationSent && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Enter verification code"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                />
                                <button onClick={handleVerifyEmail}>Verify Email</button>
                            </>
                        )}
                        {!isVerificationSent && (
                            <button onClick={handleSignup}>Sign Up</button>
                        )}
                    </div>
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
                        <Link to="/login">Already have an Epitrello account? Log in</Link>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}

export default Signup;