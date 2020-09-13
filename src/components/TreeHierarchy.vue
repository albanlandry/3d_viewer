<template>
  <v-treeview
    :open-on-click="true"
    :dense="true"
    :activatable="true"
    :items="items"
  ></v-treeview>
</template>

<script>
export default {
  data: () => ({
    items: [],
  }),

  methods: {
    updateItem() {
      this.items = this.$store.getters.items;
    },
  },

  mounted() {
    var self = this;
    // Listening to model-loaded events
    this.$root.$on("model-loaded", () => {
      // Update the list of item
      console.log("EVENT EMITTED");
      self.items = self.$store.getters.items;
    });
  },
  /*
  computed: {
    items() {
      return this.$store.getters.items;
    },
  },
  */
};
</script>
