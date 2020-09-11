<template>
  <v-app>
    <v-navigation-drawer
    absolute="true"
    :clipped="$vuetify.breakpoint.lgAndUp"
    app>
      <!-- -->
    </v-navigation-drawer>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <!--
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
      -->
      <FileModelUploader @file-loaded="fileLoaded"></FileModelUploader>
    </v-app-bar>

    <v-main>
      <ViewPort ref = "viewport"/>
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';
import FileModelUploader from './components/FileModelUploader';
import ViewPort from './components/ViewPort';
import {store} from '@/assets/store/store'
// import WebObjectLoader from '@/assets/js/ObjectLoader';
// import * as THREE from 'three';

export default {
  name: 'App',
  store: store,

  components: {
    ViewPort, FileModelUploader// HelloWorld,
  },

  data: () => ({
    file: '',
    viewport: null
  }),

  mounted: function(){
    this.viewport = this.$refs.viewport;
  },

  methods: {
    fileLoaded: function(file){
      console.log(file);
      this.viewport.load(file)

    }
  }
};
</script>
