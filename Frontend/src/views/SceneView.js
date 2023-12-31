import React, { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import SceneInit from '../components/SceneInit';
import { Card, Container, Grid } from '@mui/material';
import { GUI } from 'dat.gui';
import { Suspense } from 'react';
const SceneView = ({ drawerOpen }) => {
    let gui;
    useEffect(() => {
        const containerMaxWidth = Math.min(window.innerWidth, window.innerHeight);
        const sceneInit = new SceneInit('myThreeJsCanvas', containerMaxWidth);
        sceneInit.initialize();
        sceneInit.animate();

        const loadHumanHead = () => {
            const loader = new GLTFLoader();

            loader.load('/LeePerrySmith.glb', (gltf) => {
                const humanHead = gltf.scene;
                humanHead.scale.set(1, 1, 1);
                humanHead.rotation.set(0, 0, 0);
                sceneInit.scene.add(humanHead);
                const textureLoader = new THREE.TextureLoader();
                textureLoader.load(
                    'https://i.shgcdn.com/71fa9399-31ab-4bd0-a055-235e3ca625dc/-/format/auto/-/preview/3000x3000/-/quality/lighter/',
                    (texture) => {
                        const material = new THREE.MeshBasicMaterial({ map: texture });
                        gui = addTextureControls(material);
                        humanHead.traverse((node) => {
                            if (node.isMesh) {
                                node.material = material;
                            }
                        });
                        sceneInit.render();
                    }
                );
            });
        };

        const addTextureControls = (material) => {
            const newGui = new GUI();
            const guiContainer = newGui.domElement.parentElement;
            guiContainer.style.position = 'absolute';
            guiContainer.style.top = '50%';
            guiContainer.style.right = '0';
            guiContainer.style.transform = 'translateY(-50%)';
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
                });

            newGui
                .add(textureControls, 'offsetY', -1, 1)
                .step(0.001)
                .onChange((value) => {
                    material.map.offset.y = value;
                    sceneInit.render();
                });

            newGui
                .add(textureControls, 'scaleX', 0.1, 5)
                .step(0.001)
                .onChange((value) => {
                    material.map.repeat.x = 1 / value;
                    sceneInit.render();
                });

            newGui
                .add(textureControls, 'scaleY', 0.1, 5)
                .step(0.001)
                .onChange((value) => {
                    material.map.repeat.y = 1 / value;
                    sceneInit.render();
                });

            return newGui;
        };

        loadHumanHead();

        if (drawerOpen) {
            drawerOpen();
        }

        return () => {
            sceneInit.cleanup();
            if (gui) {
                gui.destroy();
            }
        };
    }, []);
    return (
        <Container maxWidth="xd" style={{ height: '100vh', display: 'flex' }}>
            <Grid container style={{ flex: 1 }}>
                <Grid item style={{ flex: 0.7 }}>
                    <canvas
                        id="myThreeJsCanvas"
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            left: '0', // Adjusted to left
                            top: '0' // Adjusted to top
                        }}
                    />
                </Grid>
                <Grid item style={{ flex: 0.3 }}>
                    <Card style={{ height: '100vh' }}>adsasd</Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default SceneView;
