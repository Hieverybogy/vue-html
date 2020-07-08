import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'areaSelect',
    label: '地区选择',
    // 分类
    category: 'enhance',
    // 可使用的布局
    user: ['form', 'list']
})

export default base
