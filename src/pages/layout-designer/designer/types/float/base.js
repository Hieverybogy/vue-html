import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'float',
    label: '小数',
    // 分类
    category: 'base',
    // 可使用的布局
    user: ['form', 'column', 'online-form'],
    index: 4
})

export default base