<template>
  <v-treeview
     v-model="selection"
    :open-on-click="true"
    :dense="true"
    :activatable="true"
    :items="items"
  >
    <template v-slot:prepend="{ item}">
      <v-icon v-if="!item.children">{{ types[item.type] }}</v-icon>
      <v-icon v-if="item.children">mdi-shape</v-icon>
    </template>
    <template slot="label" slot-scope="{ item }">
      <a @click="selectItem(item.id)">{{ item.name }}</a>
    </template>
  </v-treeview>
</template>

<script>
export default {
  data: () => ({
    selection: [],
    items: [],
    types: {
      light: 'mdi-lightbulb-on-outline',
      mesh: 'mdi-triangle',
      obj: 'mdi-json',
    },
  }),

  watch:{
    selection(newValue) {
      this.onUpdate(newValue)
    }
  },

  methods: {
    updateItem() {
      // console.log("updated", this.$store.state.sceneTree);
      this.items = this.getItems(this.$store.state.sceneTree);
    },

    onUpdate(selection) {
      this.$store.commit('selectItem', selection);
    },

    selectItem(id){
      this.$store.commit('selectItem', id);
      this.$root.$emit('item-selected');
    },

    getItems(sceneTree) {
        console.log('Get-Items', sceneTree);
        var items = [];

        for (const [key] of Object.entries(sceneTree)) {
            var item = this.getChildren(sceneTree[key]);
            items.push(item);
        }

        return items;
    },

    /**
     *
     * @param {*} obj
     */
    getChildren(obj) {
        // Parent item
        var self = this;
        var item = {};
        item["id"] = obj.id;

        // We set the name of the object if there is one set
        // Otherwise, it will keep the previously
        if(obj.name.length > 0){
          item["name"] = obj.name;
        }

        if (obj.filename) {
            item["name"] = obj.filename;
        }

        // Determine the type of item based on its class
        if (obj instanceof window.THREE.Light) {
            item['type'] = "light";
        } else if (obj instanceof window.THREE.Mesh) {
            item['type'] = "mesh";
        } else {
            item['type'] = "obj";
        }

        if (obj.children.length > 0) {
            item["children"] = [];

            obj.traverse(function(child) {
                if (child instanceof window.THREE.Mesh) {
                    // Recursive call
                    item["children"].push(self.getChildren(child));
                    // console.log("Recursive Call", child, item);
                }
            });

            return item;
        } else {
            return item;
        }
    }
  },

  mounted(){
    console.log("TreeView Mounted");
  },

  created() {
    console.log("TreeView Created", this)
    var self = this;
    // Listening to model-loaded events
    this.$root.$on("model-loaded", () => {
      // Update the list of item
      self.updateItem();
      console.log("EVENT EMITTED", self.items);
      console.log("Store", self.$store.state.sceneTree);
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
