import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './views/LoginView';
import Register from './views/RegisterView';
import Home from './views/HomeView';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
};

export default AppRouter;
