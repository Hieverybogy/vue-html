import Base from './base.js'
const Type = Object.create(Base)

Type.list = {
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
    },
    parseVnode (vnode, parentVnode, context) {
        const optionsProp = `${vnode.fieldId}_options`

        Type.parseApi(vnode, optionsProp, context)

        return `
            <el-radio-group 
                @change="filterChange"
                v-model="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}">
                <el-radio :key='index' :label='item.value' 
                    v-for='(item, index) in ${optionsProp}'>{{item.label}}</el-radio>
            </el-radio-group>`
    }
}

export default Type
