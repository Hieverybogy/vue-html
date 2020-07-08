import Base from './base.js'

const Checkbox = Object.create(Base)

// 列表过滤区
Checkbox['online-list'] = {
    create (opts, parentVnode, context) {
        const defaultOpts = {
            guid: Vue.$utils.guid(),
            type: 'checkbox',
            model: 'params',
            // 绑定字段
            fieldId: null,
            // 文本
            label: '多选',
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

        return Object.assign(defaultOpts, opts)
    },
    parseVnode (vnode, parentVnode, context) {
        const optionsProp = `${vnode.fieldId}_options`
        Checkbox.parseApi(vnode, optionsProp, context)

        return `
        <el-checkbox-group 
            @change="filterChange"
            v-model="${vnode.model ? (vnode.model + '.') : ''}${vnode.fieldId}">
            <el-checkbox :key='index' :label='item.value' 
                v-for='(item, index) in ${optionsProp}'>{{item.label}}</el-checkbox>
        </el-checkbox-group>`
    }
}

export default Checkbox
