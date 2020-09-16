import Vue from "vue";
import Vuex from "vuex";

// VUEX INIT
Vue.use(Vuex);
export const store = new Vuex.Store({
    state: {
        sceneTree: {},
        default_material: {
            color: 0xbbbbbb,
            flatShading: true
        },
        sceneObjects: {},
        showMaterial: false,
        selected: null,
        lightTypes: {
            jf: 1,
            lf: 2,
            hf: 3,
            ff: 4,
        }
    },

    mutations: {
        addChild(state, data) {
            state.sceneTree[data.id] = data;
            state.sceneObjects = getObjects(state.sceneObjects, data);
        },

        reset(state) {
            state.sceneTree = {};
            state.sceneObjects = {};
            state.selected = null;
        },

        rename(state, key, new_key) {
            if (state.sceneTree.has(key)) {
                state.sceneTree[key].name = new_key;
            }
        },

        selectItem(state, id) {
            state.selected = state.sceneObjects[id];
        },

        objectWithEnvMap(state) {
            var keys = Object.keys(state.sceneObjects);
            var items = [];

            console.log(keys)

            keys.forEach(function(val) {
                if (state.sceneObjects[val].material) {
                    items.push(state.sceneObjects[val]);
                }
            });

            return items;
        }
    },

    getters: {
        DEFAULT_MATERIAL(state) {
            return state.default_material;
        },

        items: function(state) {
            return getItems(state.sceneTree);
        },

        selected(state) {
            return state.selected;
        },

        sceneObjects(state) {
            return state.sceneObjects;
        }
    },
});
// VUEX INIT END

/**
 *
 * @param {*} objs
 * @param {*} data
 */
function getObjects(objs, data) {
    var items = Object.assign({}, objs);
    // Adding object to the objects container
    items[data.id] = data;

    if (data.children.length > 0) {
        data.traverse(function(child) {
            if (child instanceof window.THREE.Mesh) {
                items = getObjects(items, child);
            }

            return items;
        });
    }

    return items;
}

/**
 * Compute the list of items from the scene tree view
 * @param {*} obj
 */
function getItems(sceneTree) {
    var items = [];

    for (const [key] of Object.entries(sceneTree)) {
        var item = getChildren(sceneTree[key]);
        items.push(item);
    }

    return items;
}

/**
 *
 * @param {*} obj
 */
function getChildren(obj) {
    // Parent item
    var item = {};
    item["id"] = obj.id;
    item["name"] = obj.name;

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
                item["children"].push(getChildren(child));
                // console.log("Recursive Call", child, item);
            }
        });

        return item;
    } else {
        return item;
    }
}