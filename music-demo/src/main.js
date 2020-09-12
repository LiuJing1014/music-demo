import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './utils/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './Filter/filter'
import './utils/rem'


import '@/style/index.scss' //样式
import '@/utils/index'

Vue.config.productionTip = false
Vue.use(ElementUI);

// 解决路由跳转问题
import Router from 'vue-router'
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')