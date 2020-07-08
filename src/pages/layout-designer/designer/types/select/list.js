import Base from './base.js'
const Type = Object.create(Base)

Type.list = {
    create (opts, parentVnode, context) {
        const defaultOpts = {
            guid: Vue.$utils.guid(),
            type: 'select',
            model: '',
            // 绑定字段
            fieldId: null,
            // 文本
            label: '下拉列表',
            attrs: {
                value: '',
                placeholder: '',
                disabled: false
            },
            dataSourceType: 'custom',
            // 多选项
            options: [],
            api: null // {url: '请求地址', params: '参数', labelField: '', valueField: '', dataProp: '${vnode.fieldId}_options'}
        }

        return Object.assign(defaultOpts, opts || {})
    },
    parseVnode (vnode, parentVnode, context) {
        const optionsProp = `${vnode.fieldId}_options`
        Type.parseApi(vnode, optionsProp, context)

        return `<el-select  
            @change="filterChange"
            v-model="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}">
            <el-option v-for='(item, index) in ${optionsProp}'
                :key='index' 
                :disabled='item.disabled' 
                :label='item.label' 
                :value='item.value'></el-option>
        </el-select>`
    }
}

export default Type
