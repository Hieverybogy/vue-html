import Base from './base.js'
const Type = Object.create(Base)

Type['tree-list'] = {
    create (opts, parentVnode, context) {
        const defaultOpts = {
        }

        return Object.assign(defaultOpts, opts || {})
    },
    parseVnode (vnode, parentVnode, context) {
        const optionsProp = `${vnode.fieldId}_treeNodes`
        Type.parseApi(vnode, optionsProp, context)
        const model = JSON.stringify(vnode.api.struTree.model).replace(/\"/g, '\'')
        return `<stru-tree
                    :data="${optionsProp}"
                    :props="${model}"
                    :expandOnClickNode="${vnode.attrs.expandOnClickNode}"
                    :uniqueOpened="${vnode.attrs.uniqueOpened}"
                    @on-click="treeNodeClick"
                ></stru-tree>
        `
    }

}

export default Type
