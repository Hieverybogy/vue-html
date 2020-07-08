import Base from './base.js'
const Type = Object.create(Base)

Type.form = {
    create (opts, parentVnode, context) {
        if (parentVnode && parentVnode.type === 'detail') {
            return Type.detail.create(opts, parentVnode, context)
        }

        const defaultOpts = {
            guid: Vue.$utils.guid(),
            type: 'placeholder',
            model: '',
            // 绑定字段
            fieldId: null,
            subFieldId: null,
            isNoNeedFieldId: true,
            // 文本
            label: '占位符',
            attrs: {},
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
                context.methods[vnode.fieldId + '_validator'] = ({
                    name: vnode.fieldId + '_validator',
                    args: 'rule,value,callback',
                    content: vnode.validator
                })

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
            <el-input readonly placeholder="占位符"></el-input>
        `
    },
    parseVnodeForView (vnode, parentVnode, context) {
        return `
            <el-input readonly placeholder="占位符"></el-input>
        `
    }
}

Type.detail = {
    create (opts, parentVnode, context) {
        const defaultOpts = {
            guid: Vue.$utils.guid(),
            type: 'placeholder',
            model: '',
            // 绑定字段
            fieldId: null,
            // 文本
            label: '占位符',
            attrs: {},
            // 是否必填
            required: false,
            // 必填验证失败提示信息
            requiredErrorMsg: '',
            // 自定义校验规则
            validator: null
        }

        return Object.assign(defaultOpts, opts || {})
    }
}

export default Type