import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'listTableColumn',
    label: '列表列',
    // 分类
    category: '',
    // 可使用的布局
    user: ['online-list']
})

export default base
