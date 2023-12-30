import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './views/LoginView';
import Register from './views/RegisterView';
import Home from './views/HomeView';
import ImageListView from './views/ImageListView';
import ProjectListView from './views/ProjectListView';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/image_list" element={<ImageListView />} />
            <Route path="/project_list" element={<ProjectListView />} />
        </Routes>
    );
};

export default AppRouter;
