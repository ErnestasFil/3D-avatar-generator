import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
export default class SceneInit {
    constructor(canvasId) {
        this.scene = undefined;
        this.camera = undefined;
        this.renderer = undefined;
        this.fov = 45;
        this.nearPlane = 1;
        this.farPlane = 1000;
        this.canvasId = canvasId;
        this.clock = undefined;
        this.controls = undefined;
        this.ambientLight = undefined;
        this.directionalLight = undefined;
    }

    initialize(canvasRef) {
        this.scene = new THREE.Scene();
        const canvas = document.getElementById(this.canvasId);
        const initialWidth = canvasRef.current.clientWidth + 180 - 16;
        const initialHeight = window.innerHeight * 0.9;

        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            preserveDrawingBuffer: true
        });
        this.renderer.setSize(initialWidth, initialHeight);
        this.renderer.shadowMap.enabled = true;

        this.camera = new THREE.PerspectiveCamera(this.fov, initialWidth / initialHeight, 1, 1000);
        this.camera.position.z = 15;

        this.clock = new THREE.Clock();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.directionalLight.castShadow = true;
        this.directionalLight.position.set(0, 32, 64);
        this.scene.add(this.directionalLight);
        this.uniforms = {
            u_time: { type: 'f', value: 1.0 },
            colorB: { type: 'vec3', value: new THREE.Color(0xfff000) },
            colorA: { type: 'vec3', value: new THREE.Color(0xffffff) }
        };
    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));
        this.render();
        this.controls.update();
    }

    render() {
        if (window.innerWidth >= 900) {
            this.uniforms.u_time.value += this.clock.getDelta();
            this.renderer.render(this.scene, this.camera);
        }
    }

    onWindowResize(canvasRef, open) {
        if (window.innerWidth >= 900) {
            let newWidth = canvasRef.current.clientWidth - 16;
            const newHeight = window.innerHeight * 0.9;
            if (open !== undefined && open !== null && open) {
                newWidth -= 240 - 48 - 10;
            }

            if (open !== undefined && open !== null && !open) {
                newWidth += 240 - 48 - 10;
            }
            this.camera.aspect = newWidth / newHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(newWidth, newHeight);
        }
    }
    cleanup() {
        this.renderer.dispose();
        this.controls.dispose();
        const canvas = this.renderer.domElement;
        canvas.parentNode.removeChild(canvas);
        this.scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                if (object.material) {
                    object.material.dispose();
                }
                if (object.geometry) {
                    object.geometry.dispose();
                }
            }
        });
        while (this.scene.children.length > 0) {
            const child = this.scene.children[0];
            this.scene.remove(child);
        }
    }
    getScreenshot() {
        var strMime = 'image/jpeg';
        const imgData = this.renderer.domElement.toDataURL(strMime);
        return imgData;
    }
}
