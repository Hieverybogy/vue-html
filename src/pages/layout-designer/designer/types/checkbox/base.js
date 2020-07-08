import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'checkbox',
    label: '多选',
    // 分类
    category: 'base',
    // 可使用的布局
    user: ['form', 'column', 'list', 'online-form', 'online-list'],
    index: 8
})

export default base
