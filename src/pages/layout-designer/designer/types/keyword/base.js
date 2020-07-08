import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'keyword',
    label: '关键字',
    // 分类
    category: 'base',
    // 可使用的布局
    user: []
})

export default base