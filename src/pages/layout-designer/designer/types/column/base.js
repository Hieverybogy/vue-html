import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'column',
    label: '明细表列',
    // 可使用的布局
    user: ['form', 'online-form']
})

export default base
