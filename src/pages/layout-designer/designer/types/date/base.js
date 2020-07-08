import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'date',
    label: '时间',
    // 分类
    category: 'base',
    index: 5,
    // 可使用的布局
    user: ['form', 'column', 'list', 'online-form']
})

export default base
