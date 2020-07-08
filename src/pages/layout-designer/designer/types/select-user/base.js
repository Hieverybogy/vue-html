import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'selectUser',
    label: '选择用户',
    // 分类
    category: 'enhance',
    // 可使用的布局
    user: ['form', 'column', 'online-form']
})

export default base