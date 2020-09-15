<template>
  <v-app>
    <v-navigation-drawer
      v-bind:width="325"
      v-model="drawer" clipped app>
      <!-- -->
      <v-expansion-panels
        multiple
        :accordion="true"
        :tile="true"
      >
        <v-expansion-panel @change="updateTree">
          <v-expansion-panel-header>COLLECTION</v-expansion-panel-header>
          <v-expansion-panel-content>
            <TreeHierarchy />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel @change="updateTree">
          <v-expansion-panel-header>SCENE</v-expansion-panel-header>
          <v-expansion-panel-content>
            <ScenePanel @hdr-selected="loadHdr" />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel @change="updateTree">
          <v-expansion-panel-header>MATERIAL</v-expansion-panel-header>
          <v-expansion-panel-content>
            <CustomColorPicker @material-loaded="applyMaterial" />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel @change="updateTree">
          <v-expansion-panel-header>LIGHTING</v-expansion-panel-header>
          <v-expansion-panel-content>
            <LightingPanel />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-navigation-drawer>
    <v-app-bar app color="primary" dark clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Application</v-toolbar-title>
      <v-spacer></v-spacer>
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
      -->
      <v-btn>
        <FileModelUploader @file-loaded="fileLoaded"></FileModelUploader>
      </v-btn>
    </v-app-bar>

    <v-main>
      <ViewPort ref="viewport" />
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';
import FileModelUploader from "./components/FileModelUploader";
import ViewPort from "./components/ViewPort";
import TreeHierarchy from "./components/TreeHierarchy";
import LightingPanel from "./components/LightingPanel";
import CustomColorPicker from "./components/CustomColorPicker";
import ScenePanel from "./components/ScenePanel";
import { store } from "@/assets/store/store";
// import WebObjectLoader from '@/assets/js/ObjectLoader';
// import * as THREE from 'three';

export default {
  name: "App",
  store,

  components: {
    ViewPort,
    FileModelUploader,
    TreeHierarchy,
    CustomColorPicker,
    LightingPanel,
    ScenePanel, // HelloWorld,
  },

  data: () => ({
    file: "",
    viewport: null,
    drawer: null,
  }),

  mounted: function () {
    this.viewport = this.$refs.viewport;
  },

  methods: {
    fileLoaded: function (file) {
      this.viewport.reset();
      this.viewport.load(file);
    },

    updateTree: function () {
      this.$root.$emit("model-loaded");
      this.$root.$emit("item-selected");
    },

    loadHdr(file){
      console.log("APP", file);
      this.viewport.loadHdr(file);
    },

    applyMaterial(file){
      this.viewport.applyMaterial(file);
    }
  },
};
</script>
