const config = {
    components: {
        'sapi-upload': {
            path: '@/components/sapi-upload', // 加载路径
            immediately: true // 立即加载
        },
        'sapi-import': {
            path: '@/components/sapi-import',
            immediately: false
        },
        'sapi-export': {
            path: '@/components/sapi-export',
            immediately: false
        },
        'sapi-area-multiple': {
            path: '@/components/sapi-area-multiple', // 加载路径
            immediately: true // 立即加载
        },
        'sapi-select-btn': {
            path: '@/components/sapi-select-btn.vue',
            immediately: true
        },
        'sapi-select-station': {
            path: '@/components/selectStation', // 加载路径
            immediately: true // 立即加载
        },
        'sapi-imgs-upload': {
            path: '@/components/sapi-imgs-upload', // 加载路径
            immediately: true // 立即加载
        },
        'sapi-stru': {
            path: '@/components/selectStru', // 加载路径
            immediately: true // 立即加载
        },
		'sapi-select-btn': {
            path: '@/components/sapi-select-btn.vue',
            immediately: true
        },
        'sapi-user': {
            path: '@/components/selectUser',
            immediately: true
        }
    },
    customerComponent: {},
    mixins: {
        // 生成表单混合方法
        'formMixin': {
            path: '@/static/js/units/formBase',
            immediately: true
        }
    },
    // 自定义扩展mixins：列表单元格匹配方法
    customerMixin: {}
}

export default config

// 扩展自定义的组件信息
export function getExtendComponents () {
    return Object.assign(config.customerComponent, window.customerComponent)
}

// 扩展自定义的混合信息
export function getExtendMixins () {
    return Object.assign(config.customerMixin, window.customerMixin)
}
