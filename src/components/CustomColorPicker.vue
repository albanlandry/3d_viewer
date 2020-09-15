<template>
  <div v-if="showMaterial">
    <v-row v-if="showMaterial" justify="center" align="center">
      <v-col class="shrink" style="min-width: 220px;">
        <v-text-field v-model="color" hide-details class="ma-0 pa-0" solo>
          <template v-slot:append>
            <v-menu
              v-model="menu"
              top
              nudge-bottom="105"
              nudge-left="16"
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on }">
                <div :style="swatchStyle" v-on="on" />
              </template>
              <v-card>
                <v-card-text class="pa-0">
                  <v-color-picker @update:color="colorChanged" v-model="color" flat />
                </v-card-text>
              </v-card>
            </v-menu>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-file-input @change="updateImg" accept="image/*" label="TEXTURE"></v-file-input>
    <v-row>
        <v-col cols="12">
            <v-img v-bind:src="src" aspect-ratio="1.7"></v-img>
        </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data: () => ({
    color: "#1976D2",
    // mask: "!#XXXXXXXX",
    menu: false,
    showMaterial: false,
    src: ""
  }),

  mounted() {
    this.color = "#" + this.$store.getters.DEFAULT_MATERIAL.color.toString(16);

    this.$root.$on("item-selected", this.updateView);
  },

  computed: {
    swatchStyle() {
      const { color, menu } = this;
      return {
        backgroundColor: color,
        cursor: "pointer",
        height: "30px",
        width: "30px",
        borderRadius: menu ? "50%" : "4px",
        transition: "border-radius 200ms ease-in-out",
      };
    },
  },

  methods: {
    updateView(){
      if(this.$store.getters.selected){
        console.log("Selected:",this.$store.getters.selected);

        if(this.$store.getters.selected.material){
          this.color = "#" +this.$store.getters.selected.material.color.getHexString();
        }

        this.showMaterial = true;
      }
    },

    updateImg(file){
      var self = this;

      // We update the file only if there is at least one selected`
      if(file){
          var reader = new FileReader();

          reader.onload = function(e){
              self.src = e.target.result;
              self.$emit("material-loaded", file);
              console.log(file);
          }

          reader.readAsDataURL(file);
      }
    },

    colorChanged(color){
      // console.log("color", color.rgba);
      // Event emitted when the color is changed
      if(this.$store.getters.selected){
        this.$root.$emit("color-changed", color.rgba);
      }
    }
  }
};
</script>