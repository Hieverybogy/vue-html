import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'select',
    label: '下拉列表',
    // 分类
    category: 'base',
    index: 5,
    // 可使用的布局
    user: ['form', 'column', 'list', 'online-form', 'online-list']
})

export default base