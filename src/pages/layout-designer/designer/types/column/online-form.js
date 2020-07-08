import Base from './base.js'
const Type = Object.create(Base)

Type['online-form'] = {
    create (opts) {
        const defaultOpts = {
            guid: 'column_' + Vue.$utils.guid(8),
            type: 'column',
            // 绑定字段
            fieldId: null,
            width: '',
            align: 'left',
            headerAlign: 'left',
            showOverflowTooltip: false,
            fixed: false,
            // 文本
            label: '列名称',
            vnode: null,
            attrs: {
            },
            listeners: {},
            conditions: {},
            titleVisible: true,
            useCustomTemplate: false
        }

        return Object.assign(defaultOpts, opts || {})
    },
    parseVnode (vnode, parentVnode, context) {
        return `
        <el-table-column 
            ${vnode.attrs['v-if-expression'] ? `v-if="${vnode.attrs['v-if-expression']}"` : ''}
            ${vnode.attrs['label-expression'] ? `:label="${vnode.attrs['label-expression']}"` : `label="${vnode.label}"`}
            prop="${vnode.fieldId}"
            ${vnode.fixed ? `fixed="${vnode.fixed}"` : ''}
            align="${vnode.align}"
            header-align="${vnode.headerAlign}"
            ${vnode.showOverflowTooltip ? 'show-overflow-tooltip' : ''}
            ${vnode.width ? `width="${vnode.width}px"` : ''}>
            <template slot-scope='props'>${this.parseColumnVnode(vnode, parentVnode, context)}</template>
        </el-table-column>`
    },
    parseColumnVnode (vnode, parentVnode, context) {
        // 如果是弹出层展示明细或者查看模式，只返回文本
        if (context.preview.Types[vnode.vnode.type] && context.preview.Types[vnode.vnode.type].parseVnode) {
            return `${context.preview.Types[vnode.vnode.type].parseVnode(vnode.vnode, parentVnode, context)}`
        } else {
            throw new Error(`未找到${vnode.type}类型的控件`)
        }
    }
}

export default Type
