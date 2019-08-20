import Vue from 'vue';
import App from './app.vue';

import '../../assets/css/src/style.less'
import ZsUI from '../../components/index'
Vue.use(ZsUI);
//之所以把Hls挂载window对象上，是因为当DPlayer.video.type='hls'时，new DPlayer()对象会用到此对象。
window.Hls = require('hls.js');
new Vue({
    el: '#app',
    render: h => h(App)
});
