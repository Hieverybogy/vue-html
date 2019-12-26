const routes = [{
    path: '/', // 首页
    name: 'index',
    component: () => import('./app.vue')
}]

export default routes