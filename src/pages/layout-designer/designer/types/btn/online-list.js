import Base from './base.js'
const Type = Object.create(Base)

Type['online-form'] = {
    create (vnode, parentVnode, context) {
        return Type.create(vnode, parentVnode, context)
    },
    parseVnode (vnode, parentVnode, context) {
        return Type.parseVnode(vnode, parentVnode, context)
    }
}

export default Type
