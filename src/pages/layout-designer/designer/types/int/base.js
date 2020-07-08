import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'int',
    label: '整数',
    // 分类
    category: 'base',
    index: 3,
    // 可使用的布局
    user: ['form', 'column', 'online-form']
})

export default base
