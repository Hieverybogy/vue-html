import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'imgsUpload',
    label: '图片上传',
    // 分类
    category: 'enhance',
    // 可使用的布局
    user: ['form', 'column']
})

export default base