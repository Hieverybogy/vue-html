import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'placeholder',
    label: '占位符',
    // 分类
    category: 'base',
    // 可使用的布局
    user: ['form', 'column']
})

export default base