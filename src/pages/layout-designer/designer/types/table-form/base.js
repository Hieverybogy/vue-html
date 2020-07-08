import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'tableForm',
    label: '自定义表格',
    // 分类
    category: 'enhance',
    // 可使用的布局
    user: ['form']
})

export default base