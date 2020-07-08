import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'custom',
    label: '组件',
    // 分类
    category: 'enhance',
    // 可使用的布局
    user: ['form', 'column', 'list']
})

export default base
