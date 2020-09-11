import Vue from 'vue';
import Vuex from 'vuex';

// VUEX INIT
Vue.use(Vuex);
export const store = new Vuex.Store({
    state: {
        sceneTree: new Map(),
    },
    mutations: {
        addChild(state, key, data) {
            state.sceneTree.set(key, data);
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
        }
    }
});
// VUEX INIT END