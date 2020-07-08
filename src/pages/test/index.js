import Vue from 'vue';
import VueRouter from 'vue-router'
import App from './aaa.vue';
import routes from './router.js';
import store from './store';

import '../../assets/css/src/style.less'
import ZsUI from '../../components/index'
Vue.use(ZsUI);
// 注册为全局组件
Vue.use(VueRouter)

const router = new VueRouter({
    routes
})
new Vue({
    el: '#app',
    store,
    router: router,
    render: h => h(App)
});
