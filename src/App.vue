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

      <v-file-input class="d-none" id="open-model-in" name="open-model-in"></v-file-input>
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
// import * as THREE from 'three';

export default {
  name: 'App',

  components: {
    ViewPort// HelloWorld,
  },

  data: () => ({
    //
  }),

  methods: {
    openFilePickr: function(){
      document.querySelector('#open-model-in').click();
    },

    uploadFile: function(){

    }
  }
};
</script>
