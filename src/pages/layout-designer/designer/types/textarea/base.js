import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'textarea',
    label: '多行文本',
    // 分类
    category: 'base',
    index: 2,
    // 可使用的布局
    user: ['form', 'column', 'online-form']
})

export default base