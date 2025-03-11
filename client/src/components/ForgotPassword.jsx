import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/ForgotPassword.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');

    const handleForgotPassword = async () => {
        try {
            const response = await fetch('http://localhost:8000/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Password reset link sent to ${email}`);
            } else {
                alert(`Failed to send password reset link: ${data.message}`);
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };
    
    return (
        <div className="forgot-password-page">
            <div className="forgot-password-form-container">
                <h1>Forgot Password</h1>
                <div className="forgot-password-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={handleForgotPassword}>Send Reset Link</button>
                    <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
