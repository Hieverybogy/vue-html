import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'detail',
    label: '子表单',
    // 分类
    category: 'enhance',
    // 可使用的布局
    user: ['form', 'online-form'],
    index: 2
})

export default base