import React from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import './assets/css/App.css';

// Components
import Main from './components/MainPage';
import Login from './components/Login';
// import Footer from './components/Footer';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import CompleteSetup from './components/CompleteSetup';
import WorkspacePage from './components/Workspace';
import BoardPage from './components/Board';

// Auth Context
import { AuthProvider } from './auth/AuthContext';

function App() {
    const location = useLocation();

    return (
        <AuthProvider>
            <AnimatePresence mode='wait'>
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Main />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/complete-setup" element={<CompleteSetup />} />

                    <Route path="/home" element={<Main />} />
                    <Route path="/workspace/:workspaceId" element={<WorkspacePage />} />
                    <Route path="/board/:boardId" element={<BoardPage />} />
                </Routes>
            </AnimatePresence>
            {/* {location.pathname === '/' && <Footer />} Conditionally render the Footer */}
        </AuthProvider>
    );
}

export default App;
