import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import qdCode from "./components/qd-code/qd-code"
Vue.use(uView);
Vue.component("qd-code", qdCode)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
