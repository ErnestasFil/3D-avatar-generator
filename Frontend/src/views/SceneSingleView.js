import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import SceneInit from '../components/SceneInit';
import Notification from '../components/Notification';
import {
    Alert,
    AlertTitle,
    Card,
    CardContent,
    Container,
    Grid,
    List,
    ListItem,
    ListItemText,
    Typography
} from '@mui/material';
import { GUI } from 'dat.gui';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/Scene.css';
import { useAuth } from '../context/AuthContext';
import { AuthVerifyRefresh } from '../context/AuthVerifyRefresh';
const apiUrl = process.env.REACT_APP_API_URL;
const SceneSingleView = ({ drawerOpen, open }) => {
    const { user, isLoggedIn } = useAuth();
    const verifyToken = AuthVerifyRefresh();
    const { projectId } = useParams();
    let gui;
    const navigate = useNavigate();
    const [sceneInit, setSceneInit] = useState(new SceneInit('myThreeJsCanvas'));
    const [projectData, setProjectData] = useState(null);

    const canvasRef = useRef();
    useEffect(() => {
        const handleResize = () => {
            sceneInit.onWindowResize(canvasRef);
        };

        const loadHumanHead = () => {
            return new Promise((resolve, reject) => {
                const loader = new GLTFLoader();
                loader.load(
                    '/static/LeePerrySmith.glb',
                    (gltf) => {
                        const headData = gltf.scene;
                        headData.scale.set(1, 1, 1);
                        headData.rotation.set(0, 0, 0);
                        sceneInit.scene.add(headData);
                        resolve(headData);
                    },
                    undefined,
                    reject
                );
            });
        };
        const init = async () => {
            await sceneInit.initialize(canvasRef);
            sceneInit.animate();

            const loadedHead = await loadHumanHead();
            loadProject(loadedHead);
        };
        window.addEventListener('resize', handleResize);

        init();
        return () => {
            sceneInit.cleanup();
        };
    }, []);
    useEffect(() => {
        sceneInit.onWindowResize(canvasRef, open);
    }, [drawerOpen]);

    const loadProject = (head) => {
        verifyToken().then((token) => {
            if (isLoggedIn) {
                axios
                    .get(`${apiUrl}/api/user/${user}/project/${projectId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: '*/*',
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then((response) => {
                        setProjectData(response.data);
                        const guiPlace = document.getElementById('guiPlace');
                        guiPlace.innerHTML = '';

                        const textureLoader = new THREE.TextureLoader();
                        textureLoader.load(`${apiUrl}/${response.data.image_path}`, (texture) => {
                            const material = new THREE.MeshBasicMaterial({
                                map: texture
                            });
                            gui = addTextureControls(material, response.data);
                            head.traverse((node) => {
                                if (node.isMesh) {
                                    node.material = material;
                                }
                            });
                            sceneInit.render();
                            sceneInit.onWindowResize(canvasRef);
                        });
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
                                : 'Error loading project';
                            Notification(message, 'Error', 'error', 3000);
                        }
                        navigate('/project_list');
                    });
            }
        });
    };

    const addTextureControls = (material, data) => {
        const newGui = new GUI();
        const guiPlace = document.getElementById('guiPlace');
        guiPlace.appendChild(newGui.domElement);
        const textureControls = {
            offsetX: data.offsetX,
            offsetY: data.offsetY,
            scaleX: data.scaleX,
            scaleY: data.scaleY
        };
        material.map.offset.x = textureControls.offsetX;
        material.map.offset.y = textureControls.offsetY;
        material.map.repeat.x = 1 / textureControls.scaleX;
        material.map.repeat.y = 1 / textureControls.scaleY;
        sceneInit.render();
        const offsetXController = newGui.add(textureControls, 'offsetX', -1, 1);
        const offsetYController = newGui.add(textureControls, 'offsetY', -1, 1);
        const scaleXController = newGui.add(textureControls, 'scaleX', 0.1, 5);
        const scaleYController = newGui.add(textureControls, 'scaleY', 0.1, 5);

        offsetXController.setValue(textureControls.offsetX);
        offsetXController.domElement.querySelector('input').disabled = true;
        offsetXController.domElement.querySelector('.slider').style.pointerEvents = 'none';

        offsetYController.setValue(textureControls.offsetY);
        offsetYController.domElement.querySelector('input').disabled = true;
        offsetYController.domElement.querySelector('.slider').style.pointerEvents = 'none';

        scaleXController.setValue(textureControls.scaleX);
        scaleXController.domElement.querySelector('input').disabled = true;
        scaleXController.domElement.querySelector('.slider').style.pointerEvents = 'none';

        scaleYController.setValue(textureControls.scaleY);
        scaleYController.domElement.querySelector('input').disabled = true;
        scaleYController.domElement.querySelector('.slider').style.pointerEvents = 'none';
        if (open) {
            drawerOpen();
        }
        return newGui;
    };

    return (
        <Container maxWidth="xd">
            <Grid item>
                <Card
                    sx={{
                        '& .MuiCardContent-root:first-of-type': { paddingBottom: 0 }
                    }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid
                                item
                                md={9}
                                ref={canvasRef}
                                sx={{ display: { xs: 'none', md: 'block' } }}>
                                <canvas id="myThreeJsCanvas" />
                            </Grid>
                            <Grid item xs={12} sx={{ display: { md: 'none', xd: 'block' } }}>
                                <Card>
                                    <Alert severity="error" fullwidth="true">
                                        <AlertTitle>Error</AlertTitle>
                                        Screen is too small to use 3D scene.
                                    </Alert>
                                </Card>
                            </Grid>
                            <Grid item md={3}>
                                <Grid container spacing={2}>
                                    <Grid
                                        item
                                        sx={{
                                            display: { xs: 'none', md: 'block' },
                                            height: '50vh',
                                            width: '100vh',
                                            overflow: 'auto'
                                        }}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography
                                                    gutterBottom
                                                    variant="h5"
                                                    component="div"
                                                    align="center">
                                                    Project information
                                                </Typography>
                                            </CardContent>
                                            <List
                                                sx={{
                                                    width: '100%',
                                                    bgcolor: 'background.paper'
                                                }}>
                                                {projectData && (
                                                    <>
                                                        <ListItem>
                                                            <ListItemText
                                                                primary="Project name"
                                                                secondary={projectData.name}
                                                            />
                                                        </ListItem>
                                                        <ListItem>
                                                            <ListItemText
                                                                primary="Created at"
                                                                secondary={projectData.edit_time}
                                                            />
                                                        </ListItem>
                                                    </>
                                                )}
                                            </List>
                                            <CardContent id="guiPlace" />
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Container>
    );
};

export default SceneSingleView;
