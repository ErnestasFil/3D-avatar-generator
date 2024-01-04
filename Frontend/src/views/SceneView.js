import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import SceneInit from '../components/SceneInit';
import Notification from '../components/Notification';
import {
    Alert,
    AlertTitle,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    TextField,
    Typography
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { GUI } from 'dat.gui';
import axios from 'axios';
import { SaveAlt } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../css/Scene.css';
import { useAuth } from '../context/AuthContext';
import { AuthVerifyRefresh } from '../context/AuthVerifyRefresh';
const apiUrl = process.env.REACT_APP_API_URL;
const SceneView = ({ drawerOpen, open }) => {
    let gui;
    const navigate = useNavigate();
    const { user, isLoggedIn } = useAuth();
    const verifyToken = AuthVerifyRefresh();
    const [sceneInit, setSceneInit] = useState(new SceneInit('myThreeJsCanvas'));
    const [imageData, setImageData] = useState([]);
    const [humanHead, setHumanHead] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        offsetX: 0,
        offsetY: 0,
        scaleX: 1,
        scaleY: 1,
        screenPath: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const canvasRef = useRef();
    useEffect(() => {
        const handleResize = () => {
            sceneInit.onWindowResize(canvasRef);
        };

        window.addEventListener('resize', handleResize);

        const loadHumanHead = () => {
            const loader = new GLTFLoader();

            loader.load('static/LeePerrySmith.glb', (gltf) => {
                const humanHead = gltf.scene;
                humanHead.scale.set(1, 1, 1);
                humanHead.rotation.set(0, 0, 0);
                sceneInit.scene.add(humanHead);
                setHumanHead(humanHead);
            });
        };
        sceneInit.initialize(canvasRef);
        sceneInit.animate();

        if (open) {
            drawerOpen();
        }
        loadHumanHead();

        return () => {
            sceneInit.cleanup();
            if (gui) {
                gui.destroy();
            }
        };
    }, []);
    useEffect(() => {
        sceneInit.onWindowResize(canvasRef, open);
    }, [drawerOpen]);
    useEffect(() => {
        const fetchData = () => {
            verifyToken().then((token) => {
                if (isLoggedIn) {
                    axios
                        .get(`${apiUrl}/api/user/${user}/image`, {
                            headers: {
                                'Content-Type': 'application/json',
                                Accept: '*/*',
                                Authorization: `Bearer ${token}`
                            }
                        })
                        .then((response) => {
                            setImageData(response.data);
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
    const selectImage = (imageId) => {
        const guiPlace = document.getElementById('guiPlace');
        guiPlace.innerHTML = '';

        try {
            const selecImage = imageData.find((item) => item.id === imageId);
            setSelectedImage(selecImage);
            if (selecImage) {
                const textureLoader = new THREE.TextureLoader();
                textureLoader.load(`${apiUrl}/${selecImage.path}`, (texture) => {
                    const material = new THREE.MeshBasicMaterial({ map: texture });
                    gui = addTextureControls(material);
                    humanHead.traverse((node) => {
                        if (node.isMesh) {
                            node.material = material;
                        }
                    });
                    sceneInit.render();
                    sceneInit.onWindowResize(canvasRef);
                });
            }
        } catch (error) {}
        setFormData({ ...formData, fk_photoid: imageId });
    };
    const addTextureControls = (material) => {
        const newGui = new GUI();
        const guiPlace = document.getElementById('guiPlace');
        guiPlace.appendChild(newGui.domElement);
        setFormData({
            ...formData,
            offsetX: 0,
            offsetY: 0,
            scaleX: 1,
            scaleY: 1
        });
        const textureControls = {
            offsetX: 0,
            offsetY: 0,
            scaleX: 1,
            scaleY: 1
        };
        newGui
            .add(textureControls, 'offsetX', -1, 1)
            .step(0.001)
            .onChange((value) => {
                material.map.offset.x = value;
                sceneInit.render();
                setFormData((prevData) => ({ ...prevData, offsetX: value }));
            });

        newGui
            .add(textureControls, 'offsetY', -1, 1)
            .step(0.001)
            .onChange((value) => {
                material.map.offset.y = value;
                sceneInit.render();
                setFormData((prevData) => ({ ...prevData, offsetY: value }));
            });

        newGui
            .add(textureControls, 'scaleX', 0.1, 5)
            .step(0.001)
            .onChange((value) => {
                material.map.repeat.x = 1 / value;
                sceneInit.render();
                setFormData((prevData) => ({ ...prevData, scaleX: value }));
            });

        newGui
            .add(textureControls, 'scaleY', 0.1, 5)
            .step(0.001)
            .onChange((value) => {
                material.map.repeat.y = 1 / value;
                sceneInit.render();
                setFormData((prevData) => ({ ...prevData, scaleY: value }));
            });

        return newGui;
    };
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };
    const removeEmptyValues = (data) => {
        const newData = {};
        for (const key in data) {
            if (data[key] !== '') {
                newData[key] = data[key];
            }
        }
        if (selectedImage !== null) {
            newData['fk_photoid'] = selectedImage.id;
        }
        return newData;
    };
    const handleSubmit = async () => {
        setErrors({});
        setLoading(true);
        const cleanedFormData = removeEmptyValues(formData);
        const canvas = sceneInit.getScreenshot();
        cleanedFormData.screenPath = canvas;
        verifyToken().then((token) => {
            if (isLoggedIn) {
                axios
                    .post(`${apiUrl}/api/user/${user}/project`, cleanedFormData, {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: '*/*',
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then((response) => {
                        const message = response.data.message;
                        Notification(message, 'Success', 'success', 3000);
                        navigate('/project_list');
                    })
                    .catch((error) => {
                        if (error.response?.status === 422 || error.response?.status === 400) {
                            setTimeout(() => {
                                setErrors(error.response.data);
                            }, 500);
                        } else {
                            Notification('Error creating project.', 'Error', 'error', 3000);
                        }
                    });
            }
        });
        setTimeout(() => {
            setLoading(false);
        }, 500);
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
                                            <CardContent sx={{ height: '45vh', overflow: 'auto' }}>
                                                {imageData.length === 0 ? (
                                                    <Alert severity="info" sx={{ mt: 3 }}>
                                                        <AlertTitle>No images available</AlertTitle>
                                                        There are no images to display.
                                                    </Alert>
                                                ) : (
                                                    <ImageList cols={1}>
                                                        {imageData.map((item) => (
                                                            <ImageListItem key={item.id}>
                                                                <img
                                                                    src={`${apiUrl}/${item.path}`}
                                                                    alt={item.name}
                                                                    loading="lazy"
                                                                />
                                                                <ImageListItemBar
                                                                    title={item.name}
                                                                    subtitle={`Uploaded on: ${item.upload_date}`}
                                                                    position="below"
                                                                />
                                                                <Button
                                                                    fullWidth
                                                                    color="primary"
                                                                    startIcon={<SaveAlt />}
                                                                    variant="outlined"
                                                                    onClick={() =>
                                                                        selectImage(item.id)
                                                                    }>
                                                                    Select image "{item.name}"
                                                                </Button>
                                                            </ImageListItem>
                                                        ))}
                                                    </ImageList>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid
                                        item
                                        sx={{
                                            display: { xs: 'none', md: 'block' },
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
                                            <CardContent id="guiPlace" />
                                            <CardContent>
                                                <TextField
                                                    id="name"
                                                    label="Project name"
                                                    fullWidth
                                                    variant="filled"
                                                    sx={{ mb: 1 }}
                                                    value={formData.name}
                                                    error={Boolean(errors.name)}
                                                    helperText={errors.name}
                                                    onChange={handleChange}
                                                />
                                                <LoadingButton
                                                    fullWidth
                                                    color="primary"
                                                    onClick={handleSubmit}
                                                    disabled={selectedImage === null || loading}
                                                    loading={loading}
                                                    loadingPosition="start"
                                                    startIcon={<SaveAlt />}
                                                    variant="outlined">
                                                    Create new project
                                                </LoadingButton>
                                            </CardContent>
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

export default SceneView;
