
const collapseItem = {
    type: 'collapseItem',
    label: '折叠卡',
    // 分类: 容器
    category: 'layout',
    // 可使用的布局
    user: ['form', 'online-form'],
    index: 1,
    create () {
        return {
            guid: Vue.$utils.guid(8),
            type: 'collapseItem',
            // 文本
            label: '折叠卡',
            attrs: {
                title: '折叠卡',
                isExpand: true
            },
            vnodes: []
        }
    },
    parseVnode (vnode, parentVnode, context) {
        return [`<sapi-form-collapses-item 
                ${vnode.attrs['v-if-expression'] ? `v-if="${vnode.attrs['v-if-expression']}"` : ''}
                ${vnode.attrs['title-expression'] ? `:title="${vnode.attrs['title-expression']}"` : `title="${vnode.attrs.title}"`}
                :is-expand="${vnode.attrs.isExpand}">`,
                (context.previewCurrentVnode ? '' : context.preview.parseVnodes(vnode.vnodes, vnode, context)),
            '</sapi-form-collapses-item>']
    }
}

export default collapseItem
