import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
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
        this.stats = undefined;
        this.controls = undefined;
        this.ambientLight = undefined;
        this.directionalLight = undefined;
    }

    initialize() {
        this.scene = new THREE.Scene();
        const canvas = document.getElementById(this.canvasId);
        const initialWidth = window.innerWidth * 0.6;
        const initialHeight = window.innerHeight * 0.6;

        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true
        });
        this.renderer.setSize(initialWidth, initialHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(this.fov, initialWidth / initialHeight, 1, 1000);
        this.camera.position.z = 48;

        this.clock = new THREE.Clock();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.stats = Stats();
        this.stats.dom.style.position = 'absolute';
        this.stats.dom.style.left = 'auto';
        this.stats.dom.style.right = '0px';
        this.stats.dom.style.top = 'auto';
        this.stats.dom.style.bottom = '0px';
        document.body.appendChild(this.stats.dom);
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
        this.stats.update();
        this.controls.update();
    }

    render() {
        this.uniforms.u_time.value += this.clock.getDelta();
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const newWidth = window.innerWidth * 0.9;
        const newHeight = window.innerHeight * 0.9;

        this.camera.aspect = newWidth / newHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(newWidth, newHeight);
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
        const statsElement = this.stats.dom;
        if (statsElement && statsElement.parentNode) {
            statsElement.parentNode.removeChild(statsElement);
        }
        while (this.scene.children.length > 0) {
            const child = this.scene.children[0];
            this.scene.remove(child);
        }
    }
}
