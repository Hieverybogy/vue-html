import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'upload',
    label: '附件',
    // 分类
    category: 'enhance',
    // 可使用的布局
    user: ['form', 'column', 'online-form'],
    index: 1
})

export default base