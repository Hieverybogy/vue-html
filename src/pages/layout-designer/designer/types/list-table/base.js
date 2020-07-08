import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'listTable',
    label: '列表表格',
    // 分类
    category: 'listTable',
    // 可使用的布局
    user: ['list', 'online-list']
})

export default base
