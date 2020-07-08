const typeMixin = {
    inject: ['ueditor'],
    props: {
        vnode: {
            type: Object,
            required: true
        },
        parentVnode: {
            validator () {
                return true
            }
        },
        dataModel: {
            type: Array
        },
        container: {
            type: String,
            default: 'default'
        },
        layout: {
            type: String,
            default: ''
        },
        layoutAttrs: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {
            subDataModelVisible: false,
            subDataModel: [],
            systemDefaultValue: [
                { label: '登录用户姓名', value: 'name' },
                { label: '登录用户账号', value: 'userid' },
                { label: '登录用户公司简称', value: 'company.name' },
                { label: '登录用户公司全称', value: 'company.fullname' },
                { label: '登录用户公司id', value: 'company.id' },
                { label: '登录用户部门简称', value: 'department.name' },
                { label: '登录用户部门全称', value: 'department.fullname' },
                { label: '登录用户部门id', value: 'department.id' },
                { label: '登录用户id', value: 'id' },
                { label: '登录用户关联员工id', value: 'employeeid' },
                { label: '登录用户电子邮箱', value: 'email' },
                { label: '登录用户联系电话', value: 'mobile' },
                { label: '登录用户办公电话', value: 'telephone' },
                { label: '登录用户新浪微博', value: 'weibo' },
                { label: '登录用户微信', value: 'weixin' }
            ]
        }
    },
    computed: {
        inTableColumn () {
            return this.container === 'column'
        },
        inListLayout () {
            return this.layout === 'list'
        },
        bindingMethods () {
            const rst = [{ value: '', label: '请选择' }]
            Object.keys(this.ueditor.bindingMethodsOption || {}).forEach((key) => {
                rst.push({ value: key, label: this.ueditor.bindingMethodsOption[key] })
            })

            return rst
        }
    },
    methods: {
        change (id) {
            let data = this.dataModel.find(field => {
                return field.FieldId === id
            })

            // 不需要考虑一对一情况，一对一属性都统一到dataModel中了，以后可能有二级以上的一对一关系
            // // 一对一的关系，需要绑定子属性
            // if (data.Relationship === 1) {
            //     this.subDataModel = data.Children
            //     this.subDataModelVisible = true
            // } else {
            //     this.subDataModel = []
            //     this.subDataModelVisible = false
            //     this.vnode.subFieldId = null
            // }

            if (data) {
                this.vnode.label = data.FieldName
                this.vnode.attrs && (this.vnode.attrs.maxlength = data.Length || 100)

                let str = '请输入'
                if (this.vnode.requiredErrorMsg.indexOf('请选择') > -1) {
                    str = '请选择'
                } else if (this.vnode.requiredErrorMsg.indexOf('请输入') > -1) {
                    str = '请输入'
                }
                this.vnode.requiredErrorMsg = str + data.FieldName

                if (this.vnode.hasOwnProperty('required')) {
                    this.vnode.required = !data.IsNullable
                }
            }

            // 改变需要取消校验信息
            this.updateState()
        },
        updateState () {
            // 改变需要取消校验信息
            this.$root.$emit('validate-preview-field', this.vnode)
            this.addRecord()
        },
        subChange (id) {
            let data = this.subDataModel.find(field => {
                return field.FieldId === id
            })

            if (data) {
                this.vnode.label = data.FieldName
                this.vnode.attrs && (this.vnode.attrs.maxlength = data.Length)
            }

            // 改变需要取消校验信息
            this.$root.$emit('validate-preview-field', this.vnode)
            this.addRecord()
        },
        addRecord () {
            this.ueditor.addRecord()
        },
        init () {
            if (!this.vnode.fieldId || !this.dataModel) {
                return
            }

            let data = this.dataModel.find(field => {
                return field.FieldId === this.vnode.fieldId
            })

            // 一对一的关系，需要绑定子属性
            if (data && data.Relationship === 1) {
                this.subDataModel = data.Children
                this.subDataModelVisible = true
            }
        },
        setCondition (reference, conditionProp) {
            this.ueditor.openConditionView(this.$refs[reference], this.vnode, conditionProp)
        },
        setBindEvent (reference) {
            this.ueditor.openBindeventView(this.$refs[reference], this.vnode, this.eventType)
        },
        showPopover (reference, tagName, prop) {
            this.ueditor.openCondExprView(this.$refs[reference], tagName, prop)
        }
    },
    created () {
        if (this.vnode.type !== 'column') {
            this.init()
        }
    }
}

export default typeMixin
