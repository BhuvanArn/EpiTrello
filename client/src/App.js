import React from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import './assets/css/App.css';

// Components
import Main from './components/MainPage';
import Login from './components/Login';

function App() {
    const location = useLocation()

    return (
        <div className="App">
            {/* <Navbar /> */}
            <AnimatePresence mode='wait'>
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Main />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </AnimatePresence>
        </div>
    );
}

export default App;
