import Base from './base.js'
const Type = Object.create(Base)

Type['online-form'] = {
    create (opts, parentVnode, context) {
        if (parentVnode && parentVnode.type === 'detail') {
            return Type.detail.create(opts, parentVnode, context)
        }

        const defaultOpts = {
            guid: 'select_' + Vue.$utils.guid(8),
            type: 'select',
            model: '',
            // 绑定字段
            fieldId: null,
            subFieldId: null,
            // 绑定值关联的文本字段
            textFieldId: null,
            // 文本
            label: '下拉列表',
            defaultValueType: 'none',
            defaultValue: '',
            attrs: {
                value: '',
                placeholder: '',
                disabled: false,
                multiple: false
            },
            // 事件
            listeners: {
                // eventName: { name: '', args: [],  execution: false }
            },
            conditions: {},
            // 是否必填
            required: false,
            // 必填验证失败提示信息
            requiredErrorMsg: '请选择下拉',
            // 是否占据整行
            fullline: false,
            // 是否单独占据一行，留一半空白
            alone: false,
            dataSourceType: 'custom',
            // 多选项
            options: [],
            api: null, // {url: '请求地址', params: '参数', labelField: '', valueField: '', dataProp: '${vnode.fieldId}_options'}
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
        if (!vnode.attrs.multiple && vnode.textFieldId &&
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

        return `<el-select 
            ${!vnode.attrs.disabled ? 'v-model' : ':value'}="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? ('.' + vnode.subFieldId) : ''}"
            ${vnode.attrs.multiple ? 'multiple' : ''}
            ${listenersStr}
            ${vnode.attrs['disabled-expression'] ? `:disabled="${vnode.attrs['disabled-expression']}"` : (vnode.attrs.readonly ? 'disabled' : '')}
            ${vnode.attrs['placeholder-expression'] ? `:placeholder="${vnode.attrs['placeholder-expression']}"` : (vnode.attrs.placeholder ? `placeholder="${vnode.attrs.placeholder}"` : '')}
            >
            <el-option v-for='(item, index) in ${optionsName}'
                :key='index' 
                :disabled='item.disabled' 
                :label='item.label' 
                :value='item.value'></el-option>
        </el-select>`
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
        return `<el-select 
            disabled
            ${vnode.attrs.multiple ? 'multiple' : ''}
            :value="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? ('.' + vnode.subFieldId) : ''}">
            <el-option v-for='(item, index) in ${optionsName}'
                :key='index' 
                :disabled='item.disabled' 
                :label='item.label' 
                :value='item.value'></el-option>
        </el-select>`
    }
}

Type.detail = {
    create (opts, parentVnode, context) {
        const defaultOpts = {
            guid: 'select_' + Vue.$utils.guid(8),
            type: 'select',
            model: '',
            // 绑定字段
            fieldId: null,
            // 绑定值关联的文本字段
            textFieldId: null,
            // 文本
            label: '下拉列表',
            attrs: {
                value: '',
                placeholder: '',
                disabled: false
            },
            // 是否必填
            required: false,
            // 必填验证失败提示信息
            requiredErrorMsg: '',
            dataSourceType: 'custom',
            // 多选项
            options: [],
            api: null, // {url: '请求地址', params: '参数', labelField: '', valueField: '', dataProp: '${vnode.fieldId}_options'}
            optionsProp: null
        }

        return Object.assign(defaultOpts, opts || {})
    }
}

export default Type
