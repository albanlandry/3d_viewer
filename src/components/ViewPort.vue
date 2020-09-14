<style scoped>
.container-wrap {
  display: flex;
  flex-direction: row;
  overflow: hidden;
  margin: 0px auto;
  padding: 0px;
  background-color: aqua;
  height: 100%;
}

.container-wrap .viewport {
  overflow: hidden;
  flex: 1;
  margin: 0 auto;
  background-color: bisque;
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
// import BasicArrowHelper from '@/assets/js/ViewerHelpers';

export default {
  data: () => ({
    scene: null,
    camera: null,
    renderer: null,
    objects: [],
    WIDTH: 500,
    HEIGHT: 500,
    container: null,
    arrowHelper: new window.THREE.AxesHelper(40),
    control: null,
    orbit: null,
    cameraOrtho: null,
    cameraPersp: null,

  }),

  mounted: function () {
    // In case the basic material changes
    this.$root.$on('color-changed', this.changeBasicMaterial);
    // Adding light events
    this.$root.$on('add-light', this.newLight);
    // Listen to the selection of element from the treeview
    this.$root.$on("item-selected", this.attachTransfContrller);
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
    init: function () {
      // Set the scene size.
      var canvas = document.querySelector("#mainCanvas");
      this.renderer = new window.THREE.WebGLRenderer({ canvas });

      // Create a new camera
      const fov = 45;
      const aspect = this.WIDTH / this.HEIGHT; // the canvas default
      const near = 0.1;
      const far = 10000;
      this.camera = new window.THREE.PerspectiveCamera(fov, aspect, near, far);
      this.camera.position.set(200, 100, 200);

      // Camera rendering modes
      this.cameraPersp = new window.THREE.PerspectiveCamera( 50, aspect, 0.01, 30000 );
      this.cameraOrtho = new window.THREE.OrthographicCamera( - 600 * aspect, 600 * aspect, 600, - 600, 0.01, 30000 );

      this.scene = new window.THREE.Scene();
      this.scene.background = new window.THREE.Color(0xdddddd);
      // this.scene.fog = new window.THREE.Fog(0xa0a0a0, 200, 1000);

      /***************************** LIGHTING */
      var hemiLight = new window.THREE.HemisphereLight(0xffffff, 0xffffff);
      hemiLight.position.set(0, 200, 0);
      hemiLight.intensity = 1;
      hemiLight.name = "hemisphere."+hemiLight.id
      // this.scene.add(hemiLight);
      this.load(hemiLight);

      var directionalLight = new window.THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(0, 200, 100);
      directionalLight.castShadow = true;
      directionalLight.shadow.camera.top = 180;
      directionalLight.shadow.camera.bottom = -100;
      directionalLight.shadow.camera.left = -120;
      directionalLight.shadow.camera.right = 120;
      directionalLight.intensity = 0.3;
      this.scene.add(directionalLight);
      // this.load(directionalLight);

      /*
      const pointLight = new window.THREE.PointLight(0xffffff);
      const pointLight2 = new window.THREE.PointLight(0xffffff);
      const pointLight3 = new window.THREE.PointLight(0xffffff);

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
      */

      /*** GRID HELPER **************************************/
      var grid = new window.THREE.GridHelper(5000, 50, 0x000000, 0x000000);
      grid.material.opacity = 0.2;
      grid.material.transparent = true;
      this.scene.add(grid);

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
      this.scene.add(this.arrowHelper);

      // Render the scene
      // Start the renderer.
      this.renderer.setSize(this.WIDTH, this.HEIGHT);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.render(this.scene, this.camera);

      // var loader = new THREE.FBXLoader();

      // Orbit controller
      this.orbit = new window.THREE.OrbitControls(
        this.camera,
        this.renderer.domElement
      );
      this.orbit.enablePan = false;
      // controls.enableZoom = false;
      this.orbit.target.set(0, 15, 0);
      this.orbit.update();

      // Initialize the basic behaviour of the transforma controller
      this.INIT_TRANSFORM_CONTROL();
      this.scene.add(this.control);

      // Centralized window listeners initialization
      this.INIT_WINDOW_LISTENERS();
    }, // init

    /******
     * Initialize the basic behaviour of the transforma controller
     */
    INIT_TRANSFORM_CONTROL(){
      var self = this;
      this.control = new window.THREE.TransformControls( this.camera, this.renderer.domElement );

      /************** EVENTS LISTENERS *************/
      this.control.addEventListener( 'change', function(){
        self.renderer.render(self.scene, self.camera);
      } );

      this.control.addEventListener( 'dragging-changed', function ( event ) {
        self.orbit.enabled = ! event.value;
      });
    },

    /**
     * Initialize all the listening funcitonaliteis related to the window
     * */
    INIT_WINDOW_LISTENERS(){
      var self = this;
      window.addEventListener("resize", this.onWindowResize, false);

      window.addEventListener( 'keydown', function ( event ) {

        switch ( event.keyCode ) {

          case 81: // Q
            self.control.setSpace( self.control.space === "local" ? "world" : "local" );
            break;

          case 16: // Shift
            self.control.setTranslationSnap( 100 );
            self.control.setRotationSnap( window.THREE.MathUtils.degToRad( 15 ) );
            self.control.setScaleSnap( 0.25 );
            break;

          case 87: // W
            self.control.setMode( "translate" );
            break;

          case 69: // E
            self.control.setMode( "rotate" );
            break;

          case 82: // R
            self.control.setMode( "scale" );
            break;

          case 67: // C
            var position = self.camera.position.clone();

            self.camera = self.camera.isPerspectiveCamera ? self.cameraOrtho : self.cameraPersp;
            self.camera.position.copy( position );

            self.orbit.object = self.camera;
            self.control.camera = self.camera;

            self.camera.lookAt( self.orbit.target.x, self.orbit.target.y, self.orbit.target.z );
            self.onWindowResize();
            break;

          case 86: // V
            var randomFoV = Math.random() + 0.1;
            var randomZoom = Math.random() + 0.1;

            self.cameraPersp.fov = randomFoV * 160;
            self.cameraOrtho.bottom = - randomFoV * 500;
            self.cameraOrtho.top = randomFoV * 500;

            self.cameraPersp.zoom = randomZoom * 5;
            self.cameraOrtho.zoom = randomZoom * 5;
            self.onWindowResize();
            break;

          case 187:
          case 107: // +, =, num+
            self.control.setSize( self.control.size + 0.1 );
            break;

          case 189:
          case 109: // -, _, num-
            self.control.setSize( Math.max( self.control.size - 0.1, 0.1 ) );
            break;

          case 88: // X
            self.control.showX = ! self.control.showX;
            break;

          case 89: // Y
            self.control.showY = ! self.control.showY;
            break;

          case 90: // Z
            self.control.showZ = ! self.control.showZ;
            break;

          case 32: // Spacebar
            self.control.enabled = ! self.control.enabled;
            break;

        }

      } );

      window.addEventListener( 'keyup', function ( event ) {

        switch ( event.keyCode ) {

          case 16: // Shift
            self.control.setTranslationSnap( null );
            self.control.setRotationSnap( null );
            self.control.setScaleSnap( null );
            break;

        }

      } );
    },

    animate: function () {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
    },

    onWindowResize: function () {
      this.WIDTH = this.container.offsetWidth;
      this.HEIGHT = this.container.offsetHeight;

      this.camera.aspect = this.WIDTH / this.HEIGHT;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(this.WIDTH, this.HEIGHT);
    },

    /**
     * Load an object to the scene
     * */
    load: function (obj) {
      if (!this.scene) {
        throw "ViewPort Not initialized";
      }

      obj.scale.set(5, 5, 5);
      obj.position.set(0, 0, 0);

      console.log(obj);
      // Setting the default material it
      /*
      if(!obj.material){
        this.setMaterial(
          obj,
          new window.THREE.MeshPhongMaterial(this.$store.getters.DEFAULT_MATERIAL)
        );
      }
      */

      this.scene.add(obj);

      this.$store.commit("addChild", obj);
      console.log(this.$store.getters.items);
      // Emit an updated event
      this.$root.$emit("model-loaded");
    },

    setMaterial: function (obj, material) {
      obj.traverse(function (child) {
        if (child instanceof window.THREE.Mesh) {
          child.material = material;
          // console.log(child);
        }
      });
    },

    changeBasicMaterial(color){
      // Update the material of the selected element
      if(this.$store.state.selected){
        this.setMaterial(
          this.$store.state.selected,
          new window.THREE.MeshPhongMaterial({color: new window.THREE.Color(`rgb(${color.r}, ${color.g}, ${color.b})`)})
          );
      }
    },

    newLight(id){
      var light = null;

      // For 0, create a PointLight
      if(id == 0){
        light = new window.THREE.PointLight(0xffffff, 1, 100);
        light.name = "Point."+light.id;
      }

      // For 0, create a Directional light
      if(id == 1){
        light = new window.THREE.DirectionalLight( 0xffffff, 0.5 );
        light.name = "Directional."+light.id;
      }

      // For 0, create a Spot light
      if(id == 2){
        light = new window.THREE.SpotLight( 0xffffff );
        light.name = "Spot."+light.id;
      }

      // For 0, create a Hemisphere light
      if(id == 3){
        light = new window.THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        light.name = "Hemisphere."+light.id;
      }

      // We load the light to the scene only if it was successfully created
      if(light){
        this.load(light);
      }else
        throw new Error("INCORRECT ID PROVIDED");
    },

    /****
     * Attach the transform to the currently selected object
     */
    attachTransfContrller(){
      if(this.$store.getters.selected){
        // If there is any attached object to the controller
        // We firstly detach it from the later selected
        this.control.detach();

        console.log(this.$store.getters.selected);
        // Then attach it to the currently selected object
        this.control.attach(this.$store.getters.selected);
        console.log("Selected controller attached");
      }
    }
  },
};
</script>
