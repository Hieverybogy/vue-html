import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'text',
    label: '单行文本',
    // 分类
    category: 'base',
    // 可使用的布局
    user: ['form', 'column', 'online-form'],
    index: 1
})

export default base