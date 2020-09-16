<template>
  <v-row>
    <v-file-input
      @change="onFilePickrChange"
      ref="file"
      class="d-none"
      id="open-model-in"
      name="open-model-in"
      accept=".fbx, .obj"
    ></v-file-input>
    <v-btn @click.prevent="openFilePickr" href="#" target="_blank">
      <span class="mr-2">LOAD</span>
      <v-icon>mdi-import</v-icon>
    </v-btn>
  </v-row>
</template>

<script>
export default {
  name: "FileModelUploader",

  data: () => ({
    file: "",
  }),

  methods: {
    openFilePickr: function () {
      document.querySelector("#open-model-in").click();
    },

    onFilePickrChange: function (file) {
      this.file = file;

      this.uploadFile();
    },

    uploadFile: function () {
      var self = this;

      if (this.file) {
        // OBJLoader
        var loader = new window.THREE.OBJLoader();
        var reader = new FileReader();

        var extension = this.file.name.split(".").pop();

        if (extension.toLowerCase() === "fbx") {
          console.log("extension", extension);
          loader = new window.THREE.FBXLoader();
        }

        reader.onload = function (e) {
          loader.load(
            e.target.result,
            function (obj) {
              obj["filename"] = self.file.name.split(".")[0];
              // Event when the file is loaded
              console.log(obj);
              self.$emit("file-loaded", obj);
            },

            function (xhr) {
              console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },

            // called when loading has errors
            function (error) {
              console.log("An error happened: ", error);
            }
          );
        };

        reader.readAsDataURL(this.file);
      }

      /*
        var CORRECT = 'Kaydara FBX Binary  \0';
        console.log(CORRECT === window.THREE.LoaderUtils.decodeText(new Uint8Array( res, 0, CORRECT.length )));
        */
      /*
            let formData = new FormData();
            formData.append('model', this.file);

            this.axios.post('http://localhost:8000/models',
                formData,
                {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    //'Access-Control-Allow-Origin' : '*',
                    'Access-Control-Allow-Headers':  'Content-Type, X-Auth-Token, Authorization, Origin',
                    'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,Authorization'
                }
              }
            ).then(function(data){
              console.log(data.data);
            })
            .catch(function(){
              console.log('FAILURE!!');
            });
            */
      /*
      WebObjectLoader.load(event, function(params){
        console.log(event, params);
        var loader = new window.THREE.FBXLoader();
          var obj = loader.load(
            "../raw/001.fbx",

            // onLoad callback
            // Here the loaded data is assumed to be an object
            function ( obj ) {
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
      */
    },
  },
};
</script>
