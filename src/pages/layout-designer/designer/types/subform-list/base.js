import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'subformList',
    label: '子表单列表',
    // 分类
    category: 'enhance',
    // 可使用的布局
    user: ['form']
})

export default base