import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'selectStation',
    label: '选择岗位',
    // 分类
    category: 'enhance',
    // 可使用的布局
    user: ['form', 'column']
})

export default base