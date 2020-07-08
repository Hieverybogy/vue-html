import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'label',
    label: 'label/标签',
    // 分类
    category: 'base',
    // 可使用的布局
    user: ['form', 'column'],
    create (opts, parentVnode, context) {
        if (this[context.layout]) {
            return this[context.layout].create(opts, parentVnode, context)
        }

        throw new Error(`${base.type}未定义${context.layout}布局`)
    },
    parseVnode (vnode, parentVnode, context) {
        if (this[context.preview.layout]) {
            return this[context.preview.layout].parseVnode(vnode, parentVnode, context)
        }

        throw new Error(`${base.type}未定义${context.preview.layout}布局`)
    }
})

export default base