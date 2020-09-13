<template>
  <v-container>
    <v-file-input
      @change="onFilePickrChange"
      ref="file"
      class="d-none"
      id="open-model-in"
      name="open-model-in"
    ></v-file-input>
    <v-btn @click.prevent="openFilePickr" href="#" target="_blank" text>
      <span class="mr-2">Open File</span>
      <v-icon>mdi-import</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
export default {
  name: "FileModelUploader",

  data: () => ({
    file: "",
  }),

  methods: {
    openFilePickr: function() {
      document.querySelector("#open-model-in").click();
    },

    onFilePickrChange: function(file) {
      this.file = file;

      this.uploadFile();
    },

    uploadFile: function() {
      var self = this;
      var loader = new window.THREE.FBXLoader();

      this.file.arrayBuffer().then(function(res) {
        var obj = loader.parse(res);
        obj["filename"] = self.file.name.split(".")[0];

        // Event when the file is loaded
        self.$emit("file-loaded", obj);
        /*
                var CORRECT = 'Kaydara FBX Binary  \0';
                console.log(CORRECT === window.THREE.LoaderUtils.decodeText(new Uint8Array( res, 0, CORRECT.length )));
                */
      });
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
