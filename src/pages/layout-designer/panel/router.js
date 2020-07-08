/**
 * 注释：填写后台路径时请填写完整名称
 * 比如：路由的路径/menu，他在admin目录下，那么完整名称为：/plat/admin.html#/menu
 * 这样写的作用就是无论后台菜单移动到哪个模块下，都可以正常运行
 * **/
import lang from './i18n.js'
import * as commonLangs from "@/static/js/units/langConfig.js";
import ElementUI from 'element-ui';
import utils from '@/static/js/utils.js'

var router = {
    beforeEach (to, from, next) {
        if (to.meta && to.meta.i18n) {
            if (!lang[to.meta.i18n]) {
                utils.warn(`${to.path}未配置多语言`)
                next()
                return
            }
            const currentLangs = commonLangs.langExtend(lang[to.meta.i18n], commonLangs.defaultLangs);
            Vue.toLocale(currentLangs, false, ElementUI).then(function (data) {
                next()
            })
        } else {
            next()
        }
    },
    routes: [{
        path: '/',
        component: () => {}
    },
    {
        path: '/designer',
        name: 'codeGenerator',
        meta: { title: '代码设计器' },
        component: () => import('../designer/web-ueditor.vue')
    },
    {
        path: '/403',
        component: () => import('@/pages/home/403/403.vue')
    },
    {
        path: '*',
        component: () => import('@/pages/home/404/404.vue')
    }]
}

export default router
