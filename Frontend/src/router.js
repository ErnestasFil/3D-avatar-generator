import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './views/LoginView';
import Register from './views/RegisterView';
import Home from './views/HomeView';
import ImageListView from './views/ImageListView';
import ProjectListView from './views/ProjectListView';
import SceneView from './views/SceneView';

const AppRouter = ({ drawerOpen }) => {
    const navigate = useNavigate();

    return (
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/image_list" element={<ImageListView />} />
            <Route exact path="/project_list" element={<ProjectListView />} />
            <Route exact path="/scene" element={<SceneView drawerOpen={() => drawerOpen()} />} />
        </Routes>
    );
};

export default AppRouter;
