import Base from './base.js'
const Type = Object.create(Base)

Type['online-list'] = {
    create (opts) {
        const defaultOpts = {
            guid: Vue.$utils.guid(),
            type: 'keyword',
            model: '',
            // 绑定字段
            fieldId: null,
            // 文本
            label: '关键字',
            attrs: {
                value: '',
                placeholder: '',
                maxlength: ''
            }
        }

        return Object.assign(defaultOpts, opts || {})
    },
    parseVnode (vnode, parentVnode, context) {
        return `
        <el-input maxlength="${vnode.attrs.maxlength}"  
            placeholder="${vnode.attrs.placeholder}" 
            :title="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}"
            v-model="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}" 
            @keydown.enter.native="filterChange" clearable>
            <el-button size="small" slot="append" icon="el-icon-search" @click="filterChange"></el-button>
        </el-input>
        `
    }
}

export default Type
