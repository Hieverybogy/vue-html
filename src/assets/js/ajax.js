/**
 * Created by JANZ on 2017/3/25.
 */
import Vue from 'vue';
import joggle from './joggle.js';
import { parseJSON } from './utils.js';
import VueResource from 'vue-resource';
Vue.use(VueResource);

Vue.prototype.$joggle = joggle;

Vue.prototype.$ajax = (url, sendData, loading, fn) => {

    if (typeof loading === 'boolean' && loading) {
        loading = Vue.prototype.$loading();
    }

    Vue.http.post(url, sendData)
        .then(res => {
            fn && fn(res.body, loading);
        })
        .catch(error => {
            if (loading) loading.close();
            if (parseJSON(error.body).code === 'ZS004001') {
                Vue.prototype.$message({
                    type: 'error',
                    duration: 1200,
                    message: '权限不足'
                });
                setTimeout(() => {
                    window.location = '/web/401.html';
                }, 1200);
            } else {
                Vue.prototype.$message({
                    type: 'error',
                    duration: 1200,
                    message: parseJSON(error.body).msg
                });
            }
        });
};