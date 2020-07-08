import Base from './base.js'
import Config from '../../config.js'
const Type = Object.create(Base)

Type.list = {
    create (opts, parentVnode, context) {
        const defaultOpts = {
            guid: Vue.$utils.guid(),
            type: 'areaSelect',
            model: '',
            // 绑定字段
            fieldId: null,
            // 文本
            label: '地区选择',
            attrs: {
                type: 'city',
                multiple: false,
                limit: '',
                readonly: false
            },
            // 是否必填
            required: false,
            // 必填验证失败提示信息
            requiredErrorMsg: '',
            // 是否占据整行
            fullline: false,
            // 是否单独占据一行，留一半空白
            alone: false,
            // 自定义校验规则
            validator: null
        }

        return Object.assign(defaultOpts, opts || {})
    },
    parseVnode (vnode, parentVnode, context) {
        if (!context.components['sapi-area-multiple']) {
            // 加入组件依赖
            context.components['sapi-area-multiple'] = Config.components['sapi-area-multiple']
        }

        return `<sapi-area-multiple 
            ${vnode.attrs.type ? `type="${vnode.attrs.type}"` : ''} 
            ${vnode.attrs.multiple ? `size="${vnode.attrs.multiple}"` : ''} 
            ${vnode.attrs.limit ? `count="${vnode.attrs.limit}"` : ''}
            readonly
            v-model="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}">
        </sapi-area-multiple>`
    }
}

export default Type
