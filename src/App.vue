<template>
  <v-app>
    <v-navigation-drawer
    :clipped="$vuetify.breakpoint.lgAndUp"
    app>
      <!-- -->
    </v-navigation-drawer>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-file-input @change="uploadFile" class="d-none" id="open-model-in" name="open-model-in"></v-file-input>
      <v-btn
        @click.prevent="openFilePickr"
        href="#"
        target="_blank"
        text
      >
        <span class="mr-2">Open File</span>
        <v-icon>mdi-import</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <ViewPort/>
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';
import ViewPort from './components/ViewPort';
import WebObjectLoader from '@/assets/js/ObjectLoader';
// import * as THREE from 'three';

export default {
  name: 'App',

  components: {
    ViewPort// HelloWorld,
  },

  data: () => ({
  }),

  methods: {
    openFilePickr: function(){
      document.querySelector('#open-model-in').click();
    },

    uploadFile: function(event){

      WebObjectLoader.load(event, function(params){
        console.log(event, params);
        var loader = new window.THREE.FBXLoader();
          var obj = loader.load(
            "../raw/001.fbx",

            // onLoad callback
            // Here the loaded data is assumed to be an object
            function ( obj ) {
              /*
              obj.traverse( function ( child ) {
                if(child instanceof THREE.Mesh){
                  var tempGeometry = new THREE.Geometry().fromBufferGeometry( child.geometry );
                  tempGeometry.mergeVertices();
                  tempGeometry.computeVertexNormals();
                  child.geometry = new THREE.BufferGeometry().fromGeometry( tempGeometry );
                }
              })
              */
              console.log(typeof obj);
              // Add the loaded object to the scene
              //obj.material.flatShading = false;
              obj.scale.set(10, 10, 10);
              // obj.material = material;
              // scene.add( obj );
            },

            // onProgress callback
            function ( xhr ) {
              console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },

            // onError callback
            function ( err ) {
              console.error( 'An error happened: ', err );
            }
          );

          console.log(obj);
      })
    }
  }
};
</script>
