export default {
    components: {
        'set-options': () => import('../components/set-options.vue'),
        'set-api': () => import('../components/set-api.vue')
    },
    data () {
        return {
            view: '',
            currentOption: null,
            settingVisible: false,
            reference: null
        }
    },
    computed: {
        bindingProps () {
            return this.ueditor.bindingDataOption || {}
        }
    },
    methods: {
        setDataSource (event) {
            if (this.vnode.dataSourceType === 'custom') {
                this.currentOption = this.vnode.options
                this.view = 'set-options'
            } else {
                this.currentOption = this.vnode.api
                this.view = 'set-api'
            }
            this.settingVisible = true
            let reference = event.target
            if (event.target.tagName.toUpperCase() === 'SPAN') {
                reference = event.target.parentNode
            }

            this.reference = reference
        },
        callback (rst) {
            if (this.view === 'set-options') {
                this.vnode.options = rst
            } else {
                this.vnode.api = rst
            }
            this.addRecord()

            // 改变需要取消校验信息
            this.$root.$emit('validate-preview-field', this.vnode)
        }
    }
}
