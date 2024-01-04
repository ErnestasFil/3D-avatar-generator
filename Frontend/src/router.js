import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/LoginView';
import Register from './views/RegisterView';
import Home from './views/HomeView';
import ImageListView from './views/ImageListView';
import ProjectListView from './views/ProjectListView';
import SceneView from './views/SceneView';
import SceneSingleView from './views/SceneSingleView';
import { useAuth } from './context/AuthContext';

const AppRouter = ({ drawerOpen, open }) => {
    const { isLoggedIn } = useAuth();

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <Register />} />
            <Route
                path="/image_list"
                element={isLoggedIn ? <ImageListView /> : <Navigate to="/login" />}
            />
            <Route
                path="/project_list"
                element={isLoggedIn ? <ProjectListView /> : <Navigate to="/login" />}
            />
            <Route
                path="/scene"
                element={
                    isLoggedIn ? (
                        <SceneView drawerOpen={() => drawerOpen()} open={open} />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/scene/:projectId"
                element={
                    isLoggedIn ? (
                        <SceneSingleView drawerOpen={() => drawerOpen()} open={open} />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
        </Routes>
    );
};

export default AppRouter;
