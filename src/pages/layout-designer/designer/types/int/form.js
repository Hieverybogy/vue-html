import Base from './base.js'
const Type = Object.create(Base)

Type.form = {
    create (opts, parentVnode, context) {
        if (parentVnode && parentVnode.type === 'detail') {
            return Type.detail.create(opts, parentVnode, context)
        }

        const defaultOpts = {
            guid: Vue.$utils.guid(),
            type: 'int',
            // 绑定字段
            fieldId: null,
            subFieldId: null,
            // 绑定字段模型名称
            model: '',
            // 文本
            label: '整数',
            attrs: {
                value: '',
                placeholder: '',
                max: '',
                min: '',
                format: 'normal',
                readonly: false
            },
            // 单位
            unit: '',
            // 是否必填
            required: false,
            // 必填验证失败提示信息
            requiredErrorMsg: '请输入',
            // 是否占据整行
            fullline: false,
            // 是否单独占据一行，留一半空白
            alone: false
        }

        return Object.assign(defaultOpts, opts || {})
    },
    parseVnode (vnode, parentVnode, context) {
        if (context.mode === 'Add' || context.mode === 'Edit') {
            return this.parseVnodeForEdit(vnode, parentVnode, context)
        } else {
            return this.parseVnodeForView(vnode, parentVnode, context)
        }
    },
    parseVnodeForEdit (vnode, parentVnode, context) {
        if (!parentVnode || parentVnode.type === 'collapseItem') {
            let rules
            if (vnode.required) {
                rules = [{
                    required: true, message: vnode.requiredErrorMsg, trigger: 'blur'
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

        return `
            <sapi-number 
                ${vnode.attrs.readonly ? 'readonly' : ''}
                type="${vnode.attrs.format === 'thousand' ? 'thousand' : vnode.type}" 
                ${vnode.attrs.min ? `min="${vnode.attrs.min}" ` : ''} 
                ${vnode.attrs.max ? `max="${vnode.attrs.max}" ` : ''}
                v-model="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? ('.' + vnode.subFieldId) : ''}">
                ${vnode.unit ? `<template slot="suffix"><div>${vnode.unit}</div></template>` : ''}
            </sapi-number>
        `
    },
    parseVnodeForView (vnode, parentVnode, context) {
        return `
        <sapi-number 
            readonly
            type="${vnode.attrs.format === 'thousand' ? 'thousand' : vnode.type}" 
            ${vnode.attrs.min ? `min="${vnode.attrs.min}" ` : ''} 
            ${vnode.attrs.max ? `max="${vnode.attrs.max}" ` : ''}
            v-model="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? ('.' + vnode.subFieldId) : ''}">
            ${vnode.unit ? `<template slot="suffix"><div>${vnode.unit}</div></template>` : ''}
        </sapi-number>
    `
    }
}

Type.detail = {
    create (opts, parentVnode, context) {
        const defaultOpts = {
            guid: Vue.$utils.guid(),
            type: 'int',
            // 绑定字段
            fieldId: null,
            // 绑定字段模型名称
            model: '',
            // 文本
            label: '整数',
            attrs: {
                value: '',
                placeholder: '',
                max: '',
                min: '',
                format: 'normal',
                readonly: false
            },
            // 单位
            unit: '',
            // 是否必填
            required: false,
            // 必填验证失败提示信息
            requiredErrorMsg: ''
        }

        return Object.assign(defaultOpts, opts || {})
    }
}

export default Type
