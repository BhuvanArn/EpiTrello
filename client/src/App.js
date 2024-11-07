import React from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import './assets/css/App.css';

// Components
import Main from './components/MainPage';
import Login from './components/Login';
import Footer from './components/Footer';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';

function App() {
    const location = useLocation();
    const noFooterRoutes = ['/login', '/signup', '/forgot-password'];

    return (
        <div className="App">
            <AnimatePresence mode='wait'>
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Main />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                </Routes>
            </AnimatePresence>
            {!noFooterRoutes.includes(location.pathname) && <Footer />} {/* Conditionally render the Footer */}
        </div>
    );
}

export default App;
