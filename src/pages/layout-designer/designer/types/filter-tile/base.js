import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'filterTile',
    label: '排列选择',
    // 分类
    category: 'moreFilters',
    index: 1,
    // 可使用的布局
    user: ['online-list']
})

export default base
