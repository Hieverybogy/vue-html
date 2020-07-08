import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'fileList',
    label: '文件列表',
    // 分类
    category: 'enhance',
    // 可使用的布局
    user: ['form']
})

export default base