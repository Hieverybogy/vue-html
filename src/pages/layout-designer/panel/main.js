import routers from './router.js';
import '@/pages/plat/static/css/tree-color.css';
import initImport from '@/static/js/mainBaseImport.js';
import '@/pages/plat/static/css/index.css';
// 这里接收三个参数，路由routers(Object)，第二个是是否需要验证权限(boolean)，第三个为语言初始化对象(Object)，第四个为回调函数(Function)
// element的模块现在改成按需加载，如果系统现在配置的模块还不存在，可以在第四个参数回调函数里面进行注册
// routers, checkedPermission, langs, callback, option
initImport.init(routers, false, void 0, void 0, { layout: 'panel-layout', attrs: { class: 'sapi-code-generator', autoHeight: true, copyRightVisible: false } })

