import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
// Axios IMPORT
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios, axios);
// Axios import END

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
