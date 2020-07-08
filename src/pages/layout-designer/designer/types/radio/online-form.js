import Base from './base.js'
const Type = Object.create(Base)

Type['online-form'] = {
    create (opts, parentVnode, context) {
        if (parentVnode && parentVnode.type === 'detail') {
            return Type.detail.create(opts, parentVnode, context)
        }

        const defaultOpts = {
            guid: 'radio_' + Vue.$utils.guid(8),
            category: 'base',
            type: 'radio',
            model: '',
            // 绑定字段
            fieldId: null,
            subFieldId: null,
            // 绑定值关联字段
            textFieldId: null,
            // 文本
            label: '单选',
            defaultValueType: 'none',
            defaultValue: '',
            attrs: {
                value: '',
                placeholder: '',
                maxlength: '',
                disabled: false
            },
            conditions: {},
            // 是否必填
            required: false,
            // 必填验证失败提示信息
            requiredErrorMsg: '请选择',
            // 是否占据整行
            fullline: false,
            // 是否单独占据一行，留一半空白
            alone: false,
            dataSourceType: 'custom',
            // 多选项
            options: [],
            api: null,
            optionsProp: '',
            // 自定义校验规则
            validator: ''
        }

        return Object.assign(defaultOpts, opts || {})
    },
    parseVnode (vnode, parentVnode, context) {
        // 新增、修改、查看共用一个vue选项
        if (!context.locked) {
            this.parseRules(vnode, parentVnode, context)
            this.parseEvent(vnode, parentVnode, context)
            Type.parseApi(vnode, `options_${vnode.guid}`, context)
        }

        if (context.mode === 'Add' || context.mode === 'Edit' || context.mode === 'Adjust') {
            return this.parseVnodeForEdit(vnode, parentVnode, context)
        } else {
            return this.parseVnodeForView(vnode, parentVnode, context)
        }
    },
    parseEvent (vnode, parentVnode, context) {
        // 单选、有绑定textFieldId并且未绑定change事件自动添加change事件
        if (vnode.textFieldId &&
            (!vnode.listeners || !vnode.listeners['change'] || vnode.listeners['change'] === `${vnode.guid}_change`)) {
            vnode.listeners = vnode.listeners || {}
            const eventName = `${vnode.guid}_change`
            vnode.listeners['change'] = { name: eventName, args: '', execution: false }
            let optionsName = `options_${vnode.guid}`
            if (vnode.dataSourceType === 'dataProp') {
                optionsName = vnode.optionsProp
            }

            context.methods[eventName] = {
                name: eventName,
                args: 'val',
                content: `
                    var _this = this
                    if (this.${optionsName}) {
                        this.${optionsName}.forEach(function (item) {
                            if (item.value === val) {
                                _this.${vnode.textFieldId} = item.label
                                return
                            }
                        })
                    }
                `
            }
        }
    },
    parseRules (vnode, parentVnode, context) {
        if (!parentVnode || parentVnode.type === 'collapseItem') {
            let rules
            if (vnode.required) {
                rules = [{
                    required: true, message: vnode.requiredErrorMsg, trigger: 'change'
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
        let optionsName = `options_${vnode.guid}`
        if (vnode.dataSourceType === 'dataProp') {
            optionsName = vnode.optionsProp
        }

        return `
            <el-radio-group 
                ${listenersStr}
                ${vnode.attrs['disabled-expression'] ? `:disabled="${vnode.attrs['disabled-expression']}"` : (vnode.attrs.readonly ? 'disabled' : '')}
                v-model="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? ('.' + vnode.subFieldId) : ''}">
                <el-radio :key='index' :label='item.value' 
                    v-for='(item, index) in ${optionsName}'>{{item.label}}</el-radio>
            </el-radio-group>`
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
        let optionsName = `options_${vnode.guid}`
        if (vnode.dataSourceType === 'dataProp') {
            optionsName = vnode.optionsProp
        }

        return `
            <el-radio-group 
                disabled
                v-model="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? ('.' + vnode.subFieldId) : ''}">
                <el-radio :key='index' :label='item.value' 
                    v-for='(item, index) in ${optionsName}'>{{item.label}}</el-radio>
            </el-radio-group>`
    }
}

Type.detail = {
    create (opts, parentVnode, context) {
        const defaultOpts = {
            guid: 'radio_' + Vue.$utils.guid(8),
            category: 'base',
            type: 'radio',
            model: '',
            // 绑定字段
            fieldId: null,
            // 文本
            label: '单选',
            attrs: {
                value: '',
                placeholder: '',
                maxlength: '',
                disabled: false
            },
            // 是否必填
            required: false,
            // 必填验证失败提示信息
            requiredErrorMsg: '',
            dataSourceType: 'custom',
            // 多选项
            options: [],
            api: null
        }

        return Object.assign(defaultOpts, opts || {})
    }
}

export default Type
