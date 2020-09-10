<style scoped>
    .container-wrap {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        width: 100%;
        height: 100%;
        margin: -5px auto;
        padding: 0px;
        background-color:aqua;
    }

    .container-wrap .viewport {
        overflow: hidden;
        width: 100%;
        flex: 1;
        margin: 0 auto;
        background-color:bisque;
    }
</style>

<template>
    <div id="mainViewport" class="container-wrap">
        <canvas id="mainCanvas" class="viewport"></canvas>
    </div>
</template>

<script lang="ts">
    // window.THREE = require('THREE');
    // import * as THREE from 'three';
    // import { OrbitControls } from 'https://unpkg.com/three@<VERSION>/examples/jsm/controls/OrbitControls.js';
    import BasicArrowHelper from '@/assets/js/ViewerHelpers';

    export default {
        data: () => ({
            scene: null,
            camera: null,
            renderer: null,
            objects: [],
            WIDTH: 500,
            HEIGHT: 500,
            container: null,
            arrowHelper: new BasicArrowHelper()
        }),

        mounted: function(){
            // Mount external scripts
            /*
            let recaptchaScript = document.createElement('script')
            recaptchaScript.setAttribute('src', '/js/threejs/controls/OrbitControls.js')
            document.head.appendChild(recaptchaScript)
            */
            // Initialize the viewer
            this.container = document.querySelector("#mainViewport");

            this.WIDTH = this.container.offsetWidth;
            this.HEIGHT = this.container.offsetHeight;

            this.init();
            this.animate();
        },

        methods: {
            init: function(){
                // Set the scene size.
                var canvas = document.querySelector("#mainCanvas")
                this.renderer = new window.THREE.WebGLRenderer({canvas});

                // Create a new camera
                const fov = 45;
                const aspect = this.WIDTH / this.HEIGHT;  // the canvas default
                const near = 0.1;
                const far = 1000;
                this.camera = new window.THREE.PerspectiveCamera(fov, aspect, near, far);
                this.camera.position.set( 200, 100, 200 );

                this.scene = new window.THREE.Scene();
                this.scene.background = new window.THREE.Color( 0xdddddd );
                this.scene.fog = new window.THREE.Fog( 0xa0a0a0, 200, 1000 );

                /***************************** LIGHTING */
                var hemiLight = new window.THREE.HemisphereLight( 0xffffff, 0xffffff );
                hemiLight.position.set( 0, 200, 0 );
                hemiLight.intensity = 1;
                this.scene.add( hemiLight );

                var directionalLight = new window.THREE.DirectionalLight( 0xffffff );
                directionalLight.position.set( 0, 200, 100 );
                directionalLight.castShadow = true;
                directionalLight.shadow.camera.top = 180;
                directionalLight.shadow.camera.bottom = - 100;
                directionalLight.shadow.camera.left = - 120;
                directionalLight.shadow.camera.right = 120;
                directionalLight.intensity = 0.3;
                this.scene.add( directionalLight );

                const pointLight = new window.THREE.PointLight(0xFFFFFF);
                const pointLight2 = new window.THREE.PointLight(0xFFFFFF);
                const pointLight3 = new window.THREE.PointLight(0xFFFFFF);

                // set its position
                pointLight.position.x = 10;
                pointLight.position.y = 50;
                pointLight.position.z = 130;

                pointLight2.position.y = -50;
                pointLight2.position.x = 0;

                pointLight3.position.y = -100;
                pointLight3.position.x = 0;

                // add to the scene
                this.scene.add(pointLight);
                this.scene.add(pointLight2);

                /*** GRID HELPER **************************************/
                var grid = new window.THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
                grid.material.opacity = 0.2;
                grid.material.transparent = true;
                this.scene.add( grid );

                // Next up we create a BoxGeometry which contains the data for a box.
                /*
                const boxWidth = 50;
                const boxHeight = 50;
                const boxDepth = 50;
                const geometry = new window.THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
                */

                // Basic object creation material creation
                // var textureLoader = new THREE.TextureLoader();
                // var map = textureLoader.load('../raw/textures/001_D.png');
                // const material = new window.THREE.MeshBasicMaterial({color: 0x44aa88 /* map: map */});
                // const cube = new window.THREE.Mesh(geometry, material);
                // this.scene.add(cube);
                this.scene.add(this.camera);

                // The arrowHelper
                this.scene.add(this.arrowHelper.getObject());


                // Render the scene
                // Start the renderer.
                this.renderer.setSize(this.WIDTH, this.HEIGHT);
                this.renderer.setPixelRatio( window.devicePixelRatio );
                this.renderer.render(this.scene, this.camera);

                // var loader = new THREE.FBXLoader();

                // Orbit controller
                var controls = new window.THREE.OrbitControls( this.camera, this.renderer.domElement );
                controls.enablePan = false;
                // controls.enableZoom = false;
                controls.target.set( 0, 15, 0 );
                controls.update();

                window.addEventListener( 'resize', this.onWindowResize, false );
            }, // init

            animate: function(){
                requestAnimationFrame( this.animate );
                this.renderer.render( this.scene, this.camera );
            },

            onWindowResize: function(){
                this.WIDTH = this.container.offsetWidth;
                this.HEIGHT = this.container.offsetHeight;

                this.camera.aspect = this.WIDTH / this.HEIGHT;
                this.camera.updateProjectionMatrix();

                this.renderer.setSize( this.WIDTH, this.HEIGHT );
            }
        }
    }
</script>