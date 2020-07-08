import Base from './base.js'
const Type = Object.create(Base)

Type.form = {
    create (opts, parentVnode, context) {
        if (parentVnode && parentVnode.type === 'detail') {
            return Type.detail.create(opts, parentVnode, context)
        }

        const defaultOpts = {
            guid: Vue.$utils.guid(),
            category: 'base',
            type: 'radio',
            model: '',
            // 绑定字段
            fieldId: null,
            subFieldId: null,
            // 文本
            label: '单选',
            attrs: {
                value: '',
                placeholder: '',
                maxlength: '',
                readonly: false
            },
            // 是否必填
            required: false,
            // 必填验证失败提示信息
            requiredErrorMsg: '请选择',
            // 是否占据整行
            fullline: false,
            // 是否单独占据一行，留一半空白
            alone: false,
            dataSourceType: 'custom',
            // 多选项
            options: [],
            api: null
        }

        return Object.assign(defaultOpts, opts || {})
    },
    parseVnode (vnode, parentVnode, context) {
        if (context.mode === 'Add' || context.mode === 'Edit') {
            return this.parseVnodeForEdit(vnode, parentVnode, context)
        } else {
            return this.parseVnodeForView(vnode, parentVnode, context)
        }
    },
    parseVnodeForEdit (vnode, parentVnode, context) {
        if (!parentVnode || parentVnode.type === 'collapseItem') {
            let rules
            if (vnode.required) {
                rules = [{
                    required: true, message: vnode.requiredErrorMsg, trigger: 'change'
                }]
            }

            if (rules) {
                context.data.rules[vnode.fieldId + (vnode.subFieldId ? '.' + vnode.subFieldId : '')] = rules
            }
        }

        const optionsProp = `${vnode.fieldId}${vnode.subFieldId ? '_' + vnode.subFieldId : ''}_options`

        Type.parseApi(vnode, optionsProp, context)

        return `
            <el-radio-group 
                ${vnode.attrs.disabled ? 'disabled' : ''} 
                v-model="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? ('.' + vnode.subFieldId) : ''}">
                <el-radio :key='index' :label='item.value' 
                    v-for='(item, index) in ${optionsProp}'>{{item.label}}</el-radio>
            </el-radio-group>`
    },
    parseVnodeForView (vnode, parentVnode, context) {
        const optionsProp = `${vnode.fieldId}${vnode.subFieldId ? '_' + vnode.subFieldId : ''}_options`
        Type.parseApi(vnode, optionsProp, context)

        return `
            <el-radio-group 
                disabled
                v-model="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? ('.' + vnode.subFieldId) : ''}">
                <el-radio :key='index' :label='item.value' 
                    v-for='(item, index) in ${optionsProp}'>{{item.label}}</el-radio>
            </el-radio-group>`
    }
}

Type.detail = {
    create (opts, parentVnode, context) {
        const defaultOpts = {
            guid: Vue.$utils.guid(),
            category: 'base',
            type: 'radio',
            model: '',
            // 绑定字段
            fieldId: null,
            // 文本
            label: '单选',
            attrs: {
                value: '',
                placeholder: '',
                maxlength: '',
                readonly: false
            },
            // 是否必填
            required: false,
            // 必填验证失败提示信息
            requiredErrorMsg: '',
            dataSourceType: 'custom',
            // 多选项
            options: [],
            api: null
        }

        return Object.assign(defaultOpts, opts || {})
    }
}

export default Type