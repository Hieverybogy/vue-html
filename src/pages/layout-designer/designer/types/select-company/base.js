import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'selectCompany',
    label: '选择公司/部门',
    // 分类
    category: 'enhance',
    // 可使用的布局
    user: ['form', 'list', 'online-form']
})

export default base
