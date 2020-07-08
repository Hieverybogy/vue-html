import Base from './base.js'
const Type = Object.create(Base)

Type['online-form'] = {
    create (opts, parentVnode, context) {
        if (parentVnode && parentVnode.type === 'detail') {
            return Type.detail.create(opts, parentVnode, context)
        }

        const defaultOpts = {
            guid: 'text_' + Vue.$utils.guid(8),
            type: 'text',
            model: '',
            // 绑定字段
            fieldId: null,
            subFieldId: null,
            // 文本
            label: '单行文本',
            defaultValueType: 'none',
            defaultValue: '',
            attrs: {
                value: '',
                placeholder: '',
                maxlength: '',
                readonly: false,
                // 可见表达式
                vIfExpression: '',
                vIfExpressionText: ''
            },
            // 事件
            listeners: {
                // eventName: { name: '', args: [],  execution: false }
            },
            conditions: {
                // 'v-if': [{
                //     type: 'field', // field/mode/data 分别表示业务字段、表单模式、绑定字段
                //     logic: '', // and/or 逻辑运算符，向前的逻辑运算符，所以第一项无效
                //     opertion: '', // 操作符
                //     prop: '', // 条件字段
                //     valueType: '', // 值类型：数字、日期、文本
                //     propName: '', // 条件名称
                //     value: '' // 判断值
                // }]
            },
            // 是否必填
            required: false,
            // 必填验证失败提示信息
            requiredErrorMsg: '请输入',
            // 是否占据整行
            fullline: false,
            // 是否单独占据一行，留一半空白
            alone: false,
            // 自定义校验规则
            validator: ''
        }

        return Object.assign(defaultOpts, opts || {})
    },
    parseVnode (vnode, parentVnode, context) {
        // 新增、修改、查看共用一个vue选项
        if (!context.locked) {
            this.parseRules(vnode, parentVnode, context)
            Type.parseDefaultValue(vnode, parentVnode, context)
        }

        if (context.mode === 'Add' || context.mode === 'Edit' || context.mode === 'Adjust') {
            return this.parseVnodeForEdit(vnode, parentVnode, context)
        } else {
            return this.parseVnodeForView(vnode, parentVnode, context)
        }
    },
    parseRules (vnode, parentVnode, context) {
        if (!parentVnode || parentVnode.type === 'collapseItem') {
            let rules
            if (vnode.required) {
                rules = [{
                    required: true, message: vnode.requiredErrorMsg, trigger: 'blur'
                }]
            }

            if (vnode.validator) {
                if (rules) {
                    rules.push({
                        validator: {
                            name: 'getCustomValidator',
                            args: `${vnode.validator}`,
                            content: ``,
                            // 立即执行
                            execution: true,
                            executionContext: ''
                        }
                    })
                } else {
                    rules = [{
                        validator: {
                            name: 'getCustomValidator',
                            args: `${vnode.validator}`,
                            content: ``,
                            // 立即执行
                            execution: true,
                            executionContext: ''
                        }
                    }]
                }
            }

            if (rules) {
                context.data.rules[vnode.fieldId + (vnode.subFieldId ? '.' + vnode.subFieldId : '')] = rules
            }
        }
    },
    parseVnodeForEdit (vnode, parentVnode, context) {
        const listenersStr = this.parseListeners(vnode)

        return `
            <el-input 
                maxlength="${vnode.attrs.maxlength || 100}"
                ${listenersStr} 
                ${vnode.attrs['readonly-expression'] ? `:readonly="${vnode.attrs['readonly-expression']}"` : (vnode.attrs.readonly ? 'readonly' : '')}
                ${vnode.attrs['placeholder-expression'] ? `:placeholder="${vnode.attrs['placeholder-expression']}"` : (vnode.attrs.placeholder ? `placeholder="${vnode.attrs.placeholder}"` : '')}
                v-model="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? '.' + vnode.subFieldId : ''}"></el-input>
        `
    },
    parseListeners (vnode) {
        const listeners = vnode.listeners
        let listenersStr = ''
        if (listeners) {
            Object.keys(listeners).forEach(function (eventName) {
                // name: '', args: [] || '',  execution: false
                const mOption = listeners[eventName]
                listenersStr += `@${eventName}="${mOption['name'] + (mOption.execution ? `(${typeof mOption.args === 'string' ? mOption.args : mOption.args.join(', ')})` : '')}"\n`
            })
        }

        return listenersStr
    },
    parseVnodeForView (vnode, parentVnode, context) {
        return `
        <el-input 
            maxlength="${vnode.attrs.maxlength || 100}" 
            readonly
            ${vnode.attrs.placeholder ? `placeholder="${vnode.attrs.placeholder}"` : ''}
            :value="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? '.' + vnode.subFieldId : ''}"></el-input>
        `
    }
}

Type.detail = {
    create (opts, parentVnode, context) {
        const defaultOpts = {
            guid: 'text_' + Vue.$utils.guid(),
            type: 'text',
            model: '',
            // 绑定字段
            fieldId: null,
            // 文本
            label: '单行文本',
            attrs: {
                value: '',
                placeholder: '',
                maxlength: '',
                readonly: false
            },
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
