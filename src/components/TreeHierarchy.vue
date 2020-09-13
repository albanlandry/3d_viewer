<template>
  <v-treeview
    :active.sync="active"
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
    active: [],
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
      self.updateItem();
      console.log("EVENT EMITTED", self.items);
    });
  },

  computed: {
    selected() {
      if (!this.active.length) return undefined;

      alert(this.active);

      return this.$store.getters.items;
    },
  },
};
</script>
