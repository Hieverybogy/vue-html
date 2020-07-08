
import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'radio',
    label: '单选',
    // 分类
    category: 'base',
    index: 7,
    // 可使用的布局
    user: ['form', 'column', 'list', 'online-form']
})

export default base