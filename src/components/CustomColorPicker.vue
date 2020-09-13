<template>
  <v-row v-if="showMaterial" justify="center" align="center">
    <v-col class="shrink" style="min-width: 220px;">
      <v-text-field v-model="color" v-mask="mask" hide-details class="ma-0 pa-0" solo>
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
                <v-color-picker v-model="color" flat />
              </v-card-text>
            </v-card>
          </v-menu>
        </template>
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    color: "#1976D2FF",
    mask: "!#XXXXXXXX",
    menu: false,
  }),
  mounted() {
    console.log(this.$store.getters.DEFAULT_MATERIAL.color.toString(16));
    this.color = "#" + this.$store.getters.DEFAULT_MATERIAL.color.toString(16);
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

    showMaterial() {
      return this.$store.getters.showMaterial;
    },
  },
};
</script>