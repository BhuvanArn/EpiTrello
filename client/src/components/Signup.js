import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/Signup.css';

import logo from '../img/trello.png';

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
                navigate('/complete-setup');
            } else {
                alert(`Invalid token: ${data.message}`);
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-form-container">
                <div className="signup-logo-container">
                    <img src={logo} alt="Trello Logo" />
                    <h2>Sign Up</h2>
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
                    <div className="additional-links">
                        <Link to="/login">Back to Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;