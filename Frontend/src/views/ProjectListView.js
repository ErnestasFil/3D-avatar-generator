import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Container,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Button,
    Alert,
    AlertTitle
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { CallMade, ViewInAr } from '@mui/icons-material';
import Notification from '../components/Notification';
import ProjectDeleteModal from '../components/ProjectDeleteModal';
import { useAuth } from '../context/AuthContext';
import { AuthVerifyRefresh } from '../context/AuthVerifyRefresh';
const apiUrl = process.env.REACT_APP_API_URL;
const ProjectListView = () => {
    const [projectData, setProjectData] = useState([]);
    const [openDelete, setOpenDelete] = useState(null);
    const [deleteData, setDeleteData] = useState([]);
    const { user, isLoggedIn } = useAuth();
    const verifyToken = AuthVerifyRefresh();
    useEffect(() => {
        const fetchData = () => {
            verifyToken().then((token) => {
                if (isLoggedIn) {
                    axios
                        .get(`${apiUrl}/api/user/${user}/project`, {
                            headers: {
                                'Content-Type': 'application/json',
                                Accept: '*/*',
                                Authorization: `Bearer ${token}`
                            }
                        })
                        .then((response) => {
                            setProjectData(response.data);
                        })
                        .catch((error) => {
                            if (error.response?.status === 403) {
                                const message = error.response
                                    ? error.response.data.detail
                                    : 'Unexpected error';
                                Notification(message, 'Error', 'error', 3000);
                            } else {
                                const message = error.response
                                    ? error.response.data.message
                                    : 'Unexpected error';
                                Notification(message, 'Error', 'error', 3000);
                            }
                        });
                }
            });
        };

        fetchData();
    }, []);
    const openDeleteModal = (value) => {
        setOpenDelete(true);
        setDeleteData(projectData.filter((item) => item.id === value)[0]);
    };
    const closeDeleteModal = () => {
        setOpenDelete(false);
    };
    const deleteProjectList = (value) => {
        setProjectData(projectData.filter((item) => item.id !== value));
    };
    return (
        <Container maxWidth="md">
            <ProjectDeleteModal
                open={openDelete}
                data={deleteData}
                onClose={closeDeleteModal}
                deleteProjectList={deleteProjectList}
            />
            <Card>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" align="center">
                        Project list
                    </Typography>
                </CardContent>
                <hr />
                <CardContent>
                    <Button
                        fullWidth
                        color="primary"
                        startIcon={<ViewInAr />}
                        variant="outlined"
                        component={RouterLink}
                        to="/scene">
                        Create new project
                    </Button>
                    {projectData.length === 0 ? (
                        <Alert severity="info" sx={{ mt: 3 }}>
                            <AlertTitle>No projects available</AlertTitle>
                            There are no projects to display.
                        </Alert>
                    ) : (
                        <ImageList cols={2} gap={8}>
                            {projectData.map((item) => (
                                <ImageListItem key={item.id}>
                                    <img
                                        src={`${apiUrl}/${item.screenPath}`}
                                        alt={item.name}
                                        loading="lazy"
                                        onClick={() => openDeleteModal(item.id)}
                                    />
                                    <ImageListItemBar
                                        title={item.name}
                                        subtitle={`Uploaded on: ${item.edit_time}`}
                                        position="below"
                                    />
                                    <Button
                                        fullWidth
                                        color="success"
                                        startIcon={<CallMade />}
                                        variant="outlined"
                                        component={RouterLink}
                                        to={`/scene/${item.id}`}>
                                        Select project "{item.name}"
                                    </Button>
                                </ImageListItem>
                            ))}
                        </ImageList>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default ProjectListView;
