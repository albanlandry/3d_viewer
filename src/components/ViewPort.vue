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
    ambientLight: new window.THREE.AmbientLight( 0x111111 ),
    arrowHelper: new window.THREE.AxesHelper(40),
    camera: null,
    cameraOrtho: null,
    cameraPersp: null,
    constants: {
				combine: {
					'THREE.MultiplyOperation': window.THREE.MultiplyOperation,
					'THREE.MixOperation': window.THREE.MixOperation,
					'THREE.AddOperation': window.THREE.AddOperation
				},

				side: {
					'THREE.FrontSide': window.THREE.FrontSide,
					'THREE.BackSide': window.THREE.BackSide,
					'THREE.DoubleSide': window.THREE.DoubleSide
				},

				blendingMode: {
					'THREE.NoBlending': window.THREE.NoBlending,
					'THREE.NormalBlending': window.THREE.NormalBlending,
					'THREE.AdditiveBlending': window.THREE.AdditiveBlending,
					'THREE.SubtractiveBlending': window.THREE.SubtractiveBlending,
					'THREE.MultiplyBlending': window.THREE.MultiplyBlending,
					'THREE.CustomBlending': window.THREE.CustomBlending
				},

				equations: {
					'THREE.AddEquation': window.THREE.AddEquation,
					'THREE.SubtractEquation': window.THREE.SubtractEquation,
					'THREE.ReverseSubtractEquation': window.THREE.ReverseSubtractEquation
				},

				destinationFactors: {
					'THREE.ZeroFactor': window.THREE.ZeroFactor,
					'THREE.OneFactor': window.THREE.OneFactor,
					'THREE.SrcColorFactor': window.THREE.SrcColorFactor,
					'THREE.OneMinusSrcColorFactor': window.THREE.OneMinusSrcColorFactor,
					'THREE.SrcAlphaFactor': window.THREE.SrcAlphaFactor,
					'THREE.OneMinusSrcAlphaFactor': window.THREE.OneMinusSrcAlphaFactor,
					'THREE.DstAlphaFactor': window.THREE.DstAlphaFactor,
					'THREE.OneMinusDstAlphaFactor': window.THREE.OneMinusDstAlphaFactor
				},

				sourceFactors: {
					'THREE.DstColorFactor': window.THREE.DstColorFactor,
					'THREE.OneMinusDstColorFactor': window.THREE.OneMinusDstColorFactor,
					'THREE.SrcAlphaSaturateFactor': window.THREE.SrcAlphaSaturateFactor
				}
			},
    container: null,
    control: null,
    envMap: null,
    gui: null,
    HEIGHT: 500,
    helpers: {
      spotLightHelper: null,
      hLightHelper: null,
    },
    objects: [],
    orbit: null,
    scene: null,
    renderer: null,
    WIDTH: 500,
  }),

  computed: {
    envMaps() {
      const selection = this.$store.state.selected;
      var self = this;

      // If there is a selectd object which has a material property
      if (selection && selection.material) {
        return {
          none: null,
          reflection: self.envMap,
          refraction: self.envMap,
        };
      }

      return {
        reflection: null,
        refraction: null,
      };
    },

    diffuseMaps() {
      const selection = this.$store.state.selected;

      // If there is a selectd object which has a material property
      if (selection && selection.material) {
        return {
          none: null,
          diffuse: selection.material,
        };
      }

      return {
        reflection: null,
        refraction: null,
      };
    },

    roughnessMaps() {
      const selection = this.$store.state.selected;
      // If there is a selectd object which has a material property
      if (selection && selection.material) {
        return {
          none: null,
          diffuse: selection.material,
        };
      }

      return {
        reflection: null,
        refraction: null,
      };
    },
  },

  mounted: function () {
    // In case the basic material changes
    this.$root.$on("color-changed", this.changeBasicMaterial);
    // Light related events
    this.$root.$on("add-light", this.newLight);
    this.$root.$on("update-light-power", this.updateLightPower);
    this.$root.$on("update-light-color", this.updateLightColor);
    this.$root.$on("app-reset", this.reset);

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
    //  window.innerWidth / window.innerHeight
    this.WIDTH = this.container.offsetWidth;
    this.HEIGHT = this.container.offsetHeight;

    this.init();
    this.animate();
  },

  methods: {
    animate: function () {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
    },

    /**
     * Applies the current material to the selected object in the scene
     * @param file {File}
     */
    applyMaterial(file) {
      var self = this;
      var selection = this.$store.getters.selected;
      // console.log(file);
      // Initialize the texture loader
      var extension = file.name.split(".").pop();
      var loader = new window.THREE.TextureLoader();

      if (extension.toLowerCase() === "mtl") {
        loader = new window.THREE.MTLLoader();
      }

      // We apply the material only if the selected element is a Mesh
      // We alson check whether the give file is a valid file
      // to perform the material mapping
      if (
        selection &&
        selection instanceof window.THREE.Mesh
        // || selection.constructor.name === "Jc"
      ) {
        if (file) {
          var reader = new FileReader();

          reader.onload = function (e) {
            loader.load(e.target.result, function (texture) {
              // We create the material when the texture is loaded
              var material = new window.THREE.MeshPhongMaterial({
                map: texture,
              });

              console.log("Material: ", material);
              // Set the material as the selected object's material
              // self.setMaterial(selection, material);
              selection.material = material;

              // Refresh the scene
              self.render();
            });
          };

          reader.readAsDataURL(file);
        }
      }
    },

    /****
     * Attach the transform to the currently selected object
     */
    attachTransfContrller() {
      const selection = this.$store.getters.selected;
      if (
        selection &&
        this.$store.state.lightTypes[selection.constructor.name]
      ) {
        // this.INIT_TRANSFORM_CONTROL();
        this.control.enabled = true;
        // If there is any attached object to the controller
        // We firstly detach it from the later selected
        this.control.detach();

        // console.log(this.$store.getters.selected);
        // Then attach it to the currently selected object
        this.control.attach(this.$store.getters.selected);
      } else {
        this.control.detach();
        this.control.enabled = false;

        // if (this.control) this.REMOVE_TRANSFORM_CONTROL();
      }

      // Enable the material panel
      if (this.gui) this.gui.destroy();
      this.createGui();
    },

    /** */
    changeBasicMaterial(color) {
      // Update the material of the selected element
      if (this.$store.state.selected) {
        this.setMaterial(
          this.$store.state.selected,
          new window.THREE.MeshPhongMaterial({
            color: new window.THREE.Color(
              `rgb(${color.r}, ${color.g}, ${color.b})`
            ),
          })
        );
      }
    },

    /*** METHODS RELATED TO THE VIEWPORT INNER GUI */
    createGui() {
      const selection = this.$store.getters.selected;
      this.gui = new window.dat.GUI();
      this.gui.domElement.style.position = 'fixed';
      this.gui.domElement.style.top = '80px';
      this.gui.domElement.style.right = '10px';

      // console.log(this.scene);
      // Update the gui elements
      this.guiScene(this.gui, this.scene);

      // console.log(selection);
      if (selection && selection.material) {
        selection.material = new window.THREE.MeshPhysicalMaterial( selection.material );
        selection.material.type = "MeshPhysicalMaterial";
        selection.material.needsUpdate = true;
        // console.log(selection.material);

        this.guiMaterial( this.gui, selection, selection.material, selection.geometry );
        // this.guiMeshPhongMaterial( this.gui, selection, material, selection.geometry );
        this.guiMeshStandardMaterial( this.gui, selection, selection.material, selection.geometry );
        // this.guiMaterial(this.gui, selection, selection.material);
      }
    },

    exportScene() {
      // detach the control
      this.control.detach();
      this.control.enabled = false;

      // Instantiate a exporter
      const self = this;
      var exporter = new window.THREE.GLTFExporter();

      // Parse the input and generate the glTF output
      exporter.parse(
        this.scene,
        function (gltf) {
          console.log(gltf);
          self.$emit("scene-export", gltf);
          // downloadJSON( gltf );
        },
        { maxTextureSize: Infinity }
      );
    },

    /** */
    getObjectsKeys(obj) {
      var keys = [];
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          keys.push(key);
        }
      }

      return keys;
    },

    /**
     * Creates the gui that displays the details of a material.
     * Bind the corresponds events
     */
    guiMaterial(gui, mesh, material, geometry) {
      // var self = this;
      var folder = gui.addFolder( 'THREE.Material' );

      folder.add( material, 'transparent' );
      folder.add( material, 'opacity', 0, 1 ).step( 0.01 );
      // folder.add( material, 'blending', constants.blendingMode );
      // folder.add( material, 'blendSrc', constants.destinationFactors );
      // folder.add( material, 'blendDst', constants.destinationFactors );
      // folder.add( material, 'blendEquation', constants.equations );
      folder.add( material, 'depthTest' );
      folder.add( material, 'depthWrite' );
      // folder.add( material, 'polygonOffset' );
      // folder.add( material, 'polygonOffsetFactor' );
      // folder.add( material, 'polygonOffsetUnits' );
      folder.add( material, 'alphaTest', 0, 1 ).step( 0.01 ).onChange( this.needsUpdate( material, geometry ) );
      folder.add( material, 'visible' );
      folder.add( material, 'side', this.constants.side ).onChange( this.needsUpdate( material, geometry ) );
    },

    guiMeshPhongMaterial( gui, mesh, material, geometry ) {
        var self = this;
				var data = {
					color: material.color.getHex(),
					emissive: material.emissive.getHex(),
					specular: material.specular.getHex(),
          /*
          envMaps: envMapKeys[ 0 ],
					map: diffuseMapKeys[ 0 ],
          alphaMap: alphaMapKeys[ 0 ]
          */
				};

				var folder = gui.addFolder( 'THREE.MeshPhongMaterial' );

				folder.addColor( data, 'color' ).onChange( self.handleColorChange( material.color ) );
				folder.addColor( data, 'emissive' ).onChange( self.handleColorChange( material.emissive ) );
				folder.addColor( data, 'specular' ).onChange( self.handleColorChange( material.specular ) );

				folder.add( material, 'shininess', 0, 100 );
				folder.add( material, 'flatShading' ).onChange( self.needsUpdate( material, geometry ) );
				folder.add( material, 'wireframe' );
				folder.add( material, 'wireframeLinewidth', 0, 10 );
				folder.add( material, 'vertexColors' ).onChange( self.needsUpdate( material, geometry ) );
				folder.add( material, 'fog' );
        /*
        folder.add( data, 'envMaps', envMapKeys ).onChange( updateTexture( material, 'envMap', envMaps ) );
				folder.add( data, 'map', diffuseMapKeys ).onChange( updateTexture( material, 'map', diffuseMaps ) );
        folder.add( data, 'alphaMap', alphaMapKeys ).onChange( updateTexture( material, 'alphaMap', alphaMaps ) );
        */
				folder.add( material, 'combine', self.constants.combine ).onChange( self.updateCombine( material ) );
				folder.add( material, 'reflectivity', 0, 1 );
				folder.add( material, 'refractionRatio', 0, 1 );
		},

		guiMeshStandardMaterial( gui, mesh, material, geometry ) {
				var data = {
					color: material.color.getHex(),
          emissive: material.emissive.getHex(),
          /*
					envMaps: envMapKeys[ 0 ],
					map: diffuseMapKeys[ 0 ],
					roughnessMap: roughnessMapKeys[ 0 ],
          alphaMap: alphaMapKeys[ 0 ]
          */
				};

				var folder = gui.addFolder( 'THREE.MeshStandardMaterial' );
				folder.addColor( data, 'color' ).onChange( this.handleColorChange( material.color ) );
				folder.addColor( data, 'emissive' ).onChange( this.handleColorChange( material.emissive ) );

				folder.add( material, 'roughness', 0, 1 ).onChange( function ( value ) {
					material.roughness = value;
				} );
				folder.add( material, 'metalness', 0, 1 );
				folder.add( material, 'flatShading' ).onChange( this.needsUpdate( material, geometry ) );
				folder.add( material, 'wireframe' );
				folder.add( material, 'wireframeLinewidth', 0, 10 );
				folder.add( material, 'vertexColors' ).onChange( this.needsUpdate( material, geometry ) );
        folder.add( material, 'fog' );
        /*
				folder.add( data, 'envMaps', envMapKeys ).onChange( this.updateTexture( material, 'envMap', envMaps ) );
				folder.add( data, 'map', diffuseMapKeys ).onChange( this.updateTexture( material, 'map', diffuseMaps ) );
				folder.add( data, 'roughnessMap', this.roughnessMapKeys ).onChange( this.updateTexture( material, 'roughnessMap', roughnessMaps ) );
        folder.add( data, 'alphaMap', this.alphaMapKeys ).onChange( this.updateTexture( material, 'alphaMap', alphaMaps ) );
        */
				// TODO metalnessMap
    },
    /** The scene folder */
		guiScene( gui, scene ) {
				var folder = gui.addFolder( 'Scene' );

				var data = {
					background: '#000000',
					'ambient light': this.ambientLight.color.getHex()
				};

				folder.addColor( data, 'ambient light' ).onChange( this.handleColorChange( this.ambientLight.color ) );

				this.guiSceneFog( folder, scene );
    },

    guiSceneFog( folder, scene ) {
				var fogFolder = folder.addFolder( 'scene.fog' );
        var fog = this.scene.fog = new window.THREE.Fog(0xa0a0a0, 500, 1000);

				var data = {
					fog: {
						'THREE.Fog()': false,
						'scene.fog.color': fog.color.getHex()
					}
				};

				fogFolder.add( data.fog, 'THREE.Fog()' ).onChange( function ( useFog ) {
					if ( useFog ) {
						scene.fog = fog;
					} else {
						scene.fog = null;
					}
				} );

				fogFolder.addColor( data.fog, 'scene.fog.color' ).onChange( this.handleColorChange( fog.color ) );

		},

    /**
     * Handles gui color changes
     */
    handleColorChange(color) {
      return function (value) {
        if (typeof value === "string") {
          value = value.replace("#", "0x");
        }

        color.setHex(value);
      };
    },

    /** */
    init: function () {
      // Set the scene size.
      var canvas = document.querySelector("#mainCanvas");
      this.renderer = new window.THREE.WebGLRenderer({ canvas });

      // Create a new camera
      const fov = 45;
      const aspect = window.innerWidth / window.innerHeight; // the canvas default
      const near = 0.1;
      const far = 10000;
      this.camera = new window.THREE.PerspectiveCamera(fov, aspect, near, far);
      this.camera.position.set(200, 100, 200);

      // Camera rendering modes
      this.cameraPersp = new window.THREE.PerspectiveCamera(
        50,
        aspect,
        0.01,
        30000
      );

      this.cameraOrtho = new window.THREE.OrthographicCamera(
        -600 * aspect,
        600 * aspect,
        600,
        -600,
        0.01,
        30000
      );

      this.scene = new window.THREE.Scene();
      this.scene.background = new window.THREE.Color(0xeeeeee);
      this.scene.fog = new window.THREE.Fog(0xa0a0a0, 500, 1000);

      /***************************** Ground */
      /*
      var ground = new window.THREE.Mesh( new window.THREE.PlaneBufferGeometry( 10000, 10000 ),
        new window.THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
      ground.rotation.x = - Math.PI / 2;
      ground.receiveShadow = true;
      this.scene.add( ground );
      */

      /***************************** LIGHTING */
      this.scene.add( this.ambientLight );

      var hemiLight = new window.THREE.HemisphereLight(0xffffff, 0xffffff);
      hemiLight.position.set(0, 200, 0);
      hemiLight.intensity = 1;
      hemiLight.name = "hemisphere." + hemiLight.id;
      // this.scene.add(hemiLight);
      // this.load(hemiLight);

      var directionalLight = new window.THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(0, 200, 100);
      directionalLight.castShadow = true;
      directionalLight.shadow.camera.top = 180;
      directionalLight.shadow.camera.bottom = -100;
      directionalLight.shadow.camera.left = -120;
      directionalLight.shadow.camera.right = 120;
      directionalLight.intensity = 0.3;
      directionalLight.name = "directional." + directionalLight.id;
      // this.load(directionalLight);

      /*** GRID HELPER **************************************/
      var grid = new window.THREE.GridHelper(5000, 50, 0x000000, 0x000000);
      grid.material.opacity = 0.2;
      grid.material.transparent = true;
      // this.scene.add(grid);

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
      // this.scene.add(this.arrowHelper);

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
    INIT_TRANSFORM_CONTROL() {
      var self = this;
      this.control = new window.THREE.TransformControls(
        this.camera,
        this.renderer.domElement
      );

      /************** EVENTS LISTENERS *************/
      this.control.addEventListener("change", function () {
        self.renderer.render(self.scene, self.camera);
      });

      this.control.addEventListener("dragging-changed", function (event) {
        self.orbit.enabled = !event.value;
      });
    },

    /**
     * Initialize all the listening funcitonaliteis related to the window
     * */
    INIT_WINDOW_LISTENERS() {
      var self = this;
      window.addEventListener("resize", this.onWindowResize, false);

      window.addEventListener("keydown", function (event) {
        switch (event.keyCode) {
          case 81: // Q
            self.control.setSpace(
              self.control.space === "local" ? "world" : "local"
            );
            break;

          case 16: // Shift
            self.control.setTranslationSnap(100);
            self.control.setRotationSnap(window.THREE.MathUtils.degToRad(15));
            self.control.setScaleSnap(0.25);
            break;

          case 87: // W
            self.control.setMode("translate");
            break;

          case 69: // E
            self.control.setMode("rotate");
            break;

          case 82: // R
            self.control.setMode("scale");
            break;

          case 67: // C
            var position = self.camera.position.clone();

            self.camera = self.camera.isPerspectiveCamera
              ? self.cameraOrtho
              : self.cameraPersp;
            self.camera.position.copy(position);

            self.orbit.object = self.camera;
            self.control.camera = self.camera;

            self.camera.lookAt(
              self.orbit.target.x,
              self.orbit.target.y,
              self.orbit.target.z
            );
            self.onWindowResize();
            break;

          case 86: // V
            var randomFoV = Math.random() + 0.1;
            var randomZoom = Math.random() + 0.1;

            self.cameraPersp.fov = randomFoV * 160;
            self.cameraOrtho.bottom = -randomFoV * 500;
            self.cameraOrtho.top = randomFoV * 500;

            self.cameraPersp.zoom = randomZoom * 5;
            self.cameraOrtho.zoom = randomZoom * 5;
            self.onWindowResize();
            break;

          case 187:
          case 107: // +, =, num+
            self.control.setSize(self.control.size + 0.1);
            break;

          case 189:
          case 109: // -, _, num-
            self.control.setSize(Math.max(self.control.size - 0.1, 0.1));
            break;

          case 88: // X
            self.control.showX = !self.control.showX;
            break;

          case 89: // Y
            self.control.showY = !self.control.showY;
            break;

          case 90: // Z
            self.control.showZ = !self.control.showZ;
            break;

          case 32: // Spacebar
            self.control.enabled = !self.control.enabled;
            break;
        }
      });

      window.addEventListener("keyup", function (event) {
        switch (event.keyCode) {
          case 16: // Shift
            self.control.setTranslationSnap(null);
            self.control.setRotationSnap(null);
            self.control.setScaleSnap(null);
            break;
        }
      });
    },

    /**
     * Load an object to the scene
     * */
    load: function (obj, setMaterial) {
      if (!this.scene) {
        throw "ViewPort Not initialized";
      }

      obj.scale.set(5, 5, 5);
      obj.position.set(0, 0, 0);
      // Setting the default material it

      if (setMaterial) {
        this.setMaterial(
          obj,
          new window.THREE.MeshPhongMaterial(
            this.$store.getters.DEFAULT_MATERIAL
          )
        );
      }

      this.scene.add(obj);

      this.$store.commit("addChild", obj);
      // Emit an updated event
      this.$root.$emit("model-loaded");
    },

    /** */
    loadHdr(file) {
      var self = this;
      var loader = null;

      var pmremGenerator = new window.THREE.PMREMGenerator(this.renderer);
      pmremGenerator.compileEquirectangularShader();

      // Configuring the hdr loader
      loader = new window.THREE.RGBELoader();
      loader.setDataType(window.THREE.UnsignedByteType);

      if (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
          self.src = e.target.result;
          self.file = e.target.result;

          loader.load(e.target.result, function (texture) {
            // var envMap = pmremGenerator.fromEquirectangular( texture ).texture;
            var envMap = pmremGenerator.fromCubemap(texture).texture;
            self.envMap = envMap;
            self.scene.background = envMap;
            self.scene.environment = envMap;

            // Free resources
            texture.dispose();
            pmremGenerator.dispose();

            // Refresh the envMap of all the materials presents in the scene
            self.refreshEnvMap();
            // Refresh the scene
            self.render();
          });
        };

        reader.readAsDataURL(file);
      }
    },

    /** */
    newLight(id) {
      var light = null;

      // For 0, create a PointLight
      if (id == 0) {
        light = new window.THREE.PointLight(0xffffff, 1, 100);
        light.name = "Point." + light.id;
      }

      // For 0, create a Directional light
      if (id == 1) {
        light = new window.THREE.DirectionalLight(0xffffff, 0.5);
        light.name = "Directional." + light.id;
      }

      // For 0, create a Spot light
      if (id == 2) {
        light = new window.THREE.SpotLight(0xffffff);
        light.name = "Spot." + light.id;
      }

      // For 0, create a Hemisphere light
      if (id == 3) {
        light = new window.THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        light.name = "Hemisphere." + light.id;
      }

      // We load the light to the scene only if it was successfully created
      if (light) {
        this.load(light);
      } else throw new Error("INCORRECT ID PROVIDED");
    },

    needsUpdate(material, geometry) {
      var mat = material;
      return function () {
        material.vertexColors = mat.vertexColors;
        material.side = parseInt(material.side); //Ensure number
        material.needsUpdate = true;
        console.log(geometry);
        /*
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.normal.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
        */
      };
    },

    /** */
    onWindowResize: function () {
      this.WIDTH = this.container.offsetWidth;
      this.HEIGHT = this.container.offsetHeight;

      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.WIDTH, this.HEIGHT);

      this.render();
    },

    /***
     *
     */
    objectWithEnvMap() {
      const selection = this.$store.state.sceneObjects;
      var keys = Object.keys(selection);
      var items = [];

      // We consider only the objects with a material
      keys.forEach(function (val) {
        if (selection[val].material) {
          console.log(selection[val]);
          items.push(selection[val]);
        }
      });

      return items;
    },

    /**
     * Loop through the objects and update their envMap
     */
    refreshEnvMap() {
      var self = this;
      var tree = this.objectWithEnvMap();

      console.log(tree);

      // Update the objects envMap
      tree.forEach(function (obj) {
        obj.material.envMap = self.envMap;
      });
    },

    /***
     * Remove the object from the scene which corresponds to
     * the given selector
     * @param selector {String/Number}
     */
    remove(selector) {
      let obj = null;
      try {
        // Try to remove the object by id
        obj = this.scene.getObjectById(selector);
        this.scene.remove(obj);
      } catch (e) {
        // Try to remove the object by name if the removal by id
        // failed
        try {
          obj = this.scene.getObjectByName(selector);
          this.scene.remove(obj);
        } catch (e1) {
          console.log(e1);
        }
      }
    },

    removeHelpers(){
      this.REMOVE_TRANSFORM_CONTROL();
    },

    removeSpotLightHelper(){

    },

    /** */
    REMOVE_TRANSFORM_CONTROL() {
      this.control.addEventListener("change", null, false);
      this.control.addEventListener("dragging-changed", null, false);
      this.control.dispose();
    },

    /***
     * Refresh the scene
     */
    render() {
      this.renderer.render(this.scene, this.camera);
    },

    /** */
    reset() {
      var self = this;
      const children = this.$store.getters.sceneObjects;

      this.control.enabled = false;
      this.control.detach();

      Object.keys(children).forEach(function (item) {
        self.scene.remove(children[item]);
      });

      // this.render.domElementdocument.addEventListener('dblclick', null, false);
      // Remove all the objects from the scene
      /*
      this.scene.traverse(function(child){
        self.scene.remove(child);
      });
      */

      this.$store.commit("reset");
    },

    /** */
    setMaterial: function (obj, material) {
      material.roughness = 0.5;
      material.metalness = 0.5;

      obj.traverse(function (child) {
        if (child instanceof window.THREE.Mesh) {
          child.material = material;
        }
      });
    },

    /**
     * Update the combination of materials inside the object
     */
    updateCombine( material ) {
				return function ( combine ) {
					material.combine = parseInt( combine );
					material.needsUpdate = true;

				};
		},

    /***
     * Update the color of the currently selected light
     */
    updateLightColor(color) {
      const c = color.rgba;

      const selection = this.$store.state.selected;
      if (selection) {
        selection.color = new window.THREE.Color(`rgb(${c.r}, ${c.g}, ${c.b})`);
      }
    },

    /***
     * Update the power of the currently selected light
     */
    updateLightPower(value) {
      const selection = this.$store.state.selected;
      if (selection) {
        selection.intensity = value;
      }
    },

    updateTexture(material, materialKey, textures) {
      return function (key) {
        material[materialKey] = textures[key];
        material.needsUpdate = true;
      };
    },
  },
};
</script>
