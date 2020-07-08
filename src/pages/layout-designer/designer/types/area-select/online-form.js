import Base from './base.js'
const Type = Object.create(Base)

Type['online-form'] = {
    create (opts, parentVnode, context) {
        if (parentVnode && parentVnode.type === 'detail') {
            return Type.detail.create(opts, parentVnode, context)
        }

        const defaultOpts = {
            guid: 'areaSelect_' + Vue.$utils.guid(),
            type: 'areaSelect',
            model: '',
            // 绑定字段
            fieldId: null,
            subFieldId: null,
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
            requiredErrorMsg: '请选择地区',
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
        // 新增、修改、查看共用一个vue选项
        if (!context.locked) {
            this.parseRules(vnode, parentVnode, context)
        }

        if (context.mode === 'Add' || context.mode === 'Edit' || context.mode === 'Adjust') {
            return this.parseVnodeForEdit(vnode, parentVnode, context)
        } else {
            return this.parseVnodeForView(vnode, parentVnode, context)
        }
    },
    parseRules (vnode, parentVnode, context) {
        // 不存在父节点：表示节点不在明细表中
        if (!parentVnode || parentVnode.type === 'collapseItem') {
            let rules
            if (vnode.required) {
                rules = [{
                    required: true, message: vnode.requiredErrorMsg, trigger: 'change'
                }]
            }

            if (vnode.validator) {
                context.methods[vnode.fieldId + '_validator'] = {
                    name: vnode.fieldId + '_validator',
                    args: 'rule,value,callback',
                    content: vnode.validator
                }

                if (rules) {
                    rules.push({
                        validator: `this.${vnode.fieldId}_validator`
                    })
                } else {
                    rules = [{
                        validator: `this.${vnode.fieldId}_validator`
                    }]
                }
            }

            if (rules) {
                context.data.rules[vnode.fieldId + (vnode.subFieldId ? '.' + vnode.subFieldId : '')] = rules
            }
        }
    },
    parseVnodeForEdit (vnode, parentVnode, context) {
        return `<sapi-area-multiple 
                ${vnode.attrs.type ? `type="${vnode.attrs.type}"` : ''} 
                ${vnode.attrs.multiple ? `size="${vnode.attrs.multiple}"` : ''} 
                ${vnode.attrs.limit ? `count="${vnode.attrs.limit}"` : ''}
                ${vnode.attrs.readonly ? 'readonly' : ''}
                v-model="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? '.' + vnode.subFieldId : ''}">
            </sapi-area-multiple>`
    },
    parseVnodeForView (vnode, parentVnode, context) {
        return `<sapi-area-multiple 
            ${vnode.attrs.type ? `type="${vnode.attrs.type}"` : ''} 
            ${vnode.attrs.multiple ? `size="${vnode.attrs.multiple}"` : ''} 
            ${vnode.attrs.limit ? `count="${vnode.attrs.limit}"` : ''}
            readonly
            v-model="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? '.' + vnode.subFieldId : ''}">
        </sapi-area-multiple>`
    }
}

Type.detail = {
    create (opts, parentVnode, context) {
        const defaultOpts = {
            guid: 'areaSelect_' + Vue.$utils.guid(),
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
    }
}

export default Type
