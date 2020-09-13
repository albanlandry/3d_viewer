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
    },

    mutations: {
        addChild(state, data) {
            state.sceneTree[data.id] = data;
        },

        remove(state, key) {
            if (state.sceneTree.has(key)) {
                state.sceneTree.delete(key);
            }
        },

        rename(state, key, new_key) {
            if (state.sceneTree.has(key)) {
                state.sceneTree[key].name = new_key;
            }
        },
    },

    getters: {
        DEFAULT_MATERIAL(state) {
            return state.default_material;
        },

        items(state) {
            return getItems(state.sceneTree);
        },
    },
});
// VUEX INIT END

/**
 * Compute the list of items from the scene tree view
 * @param {*} obj
 */
function getItems(sceneTree) {
    console.log(sceneTree);
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