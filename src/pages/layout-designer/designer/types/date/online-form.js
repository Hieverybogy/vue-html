
import Base from './base.js'
const Type = Object.create(Base)

Type['online-form'] = {
    create (opts, parentVnode, context) {
        if (parentVnode && parentVnode.type === 'detail') {
            return Type.detail.create(opts, parentVnode, context)
        }

        const defaultOpts = {
            guid: 'date_' + Vue.$utils.guid(8),
            type: 'date',
            model: '',
            // 绑定字段
            fieldId: null,
            subFieldId: null,
            fieldId2: null,
            subFieldId2: null,
            // 文本
            label: '时间',
            defaultValueType: 'none',
            defaultValue: '',
            attrs: {
                value: '',
                type: 'date',
                type2: 'daterange',
                format: 'yyyy-MM-dd',
                placeholder: '选择日期',
                placeholder1: '开始时间',
                placeholder2: '结束时间',
                readonly: false,
                multiType: 1
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
            requiredErrorMsg: '请选择时间',
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
            this.addMore(vnode, parentVnode, context)
            Type.parseDefaultValue(vnode, parentVnode, context)
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
                if (vnode.attrs.multiType === 2) {
                    context.data.rules[vnode.fieldId2 + (vnode.subFieldId2 ? '.' + vnode.subFieldId2 : '')] = rules
                }
            }
        }
    },
    // 表单编辑模式解析
    parseVnodeForEdit (vnode, parentVnode, context) {
        const listenersStr = this.parseListeners(vnode)
        return `
            <el-date-picker
                type="${vnode.attrs.multiType === 1 ? vnode.attrs.type : vnode.attrs.type2}" 
                ${listenersStr} 
                ${vnode.attrs['readonly-expression'] ? `:readonly="${vnode.attrs['readonly-expression']}"` : (vnode.attrs.readonly ? 'readonly' : '')}
                ${vnode.attrs.multiType === 1 ? `format="${vnode.attrs.format}"` : ''}
                value-format="yyyy-MM-dd hh:mm:ss"
                ${vnode.attrs.multiType === 1 ? `placeholder="${vnode.attrs.placeholder}"` : ''}
                ${vnode.attrs.multiType === 2 ? `range-separator="至"` : ''}
                ${vnode.attrs.multiType === 2 ? `start-placeholder="${vnode.attrs.placeholder1}"` : ''}
                ${vnode.attrs.multiType === 2 ? `end-placeholder="${vnode.attrs.placeholder2}"` : ''}
                ${!vnode.attrs.readonly ? 'v-model' : ':value'}="${vnode.attrs.multiType === 2 ? `dateTimeRange_${vnode.guid}` : `${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? ('.' + vnode.subFieldId) : ''}`}"></el-date-picker>
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
    // 表单查看模式解析
    parseVnodeForView (vnode, parentVnode, context) {
        return `
            <el-date-picker 
                type="${vnode.attrs.multiType === 1 ? vnode.attrs.type : vnode.attrs.type2}" 
                readonly
                ${vnode.attrs.multiType === 1 ? `format="${vnode.attrs.format}"` : ''}
                value-format="yyyy-MM-dd hh:mm:ss"
                ${vnode.attrs.multiType === 1 ? `placeholder="${vnode.attrs.placeholder}"` : ''}
                ${vnode.attrs.multiType === 2 ? `range-separator="至"` : ''}
                ${vnode.attrs.multiType === 2 ? `start-placeholder="${vnode.attrs.placeholder1}"` : ''}
                ${vnode.attrs.multiType === 2 ? `end-placeholder="${vnode.attrs.placeholder2}"` : ''}
                :value="${vnode.attrs.multiType === 2 ? `dateTimeRange_${vnode.guid}` : `${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? ('.' + vnode.subFieldId) : ''}`}"></el-date-picker>
        `
    },
    addMore(vnode, parentVnode, context) {
        // 保存起来处理格式化问题
        // context.data.dateFields.push({
        //     fieldId: `${vnode.fieldId}${vnode.subFieldId ? ('.' + vnode.subFieldId) : ''}`,
        //     format: vnode.attrs.format,
        //     parentFieldId: vnode.model,
        //     parentFieldType: 'object'
        // })

        const methodName = `dateRangeChange_${vnode.guid}`
        const dataName = `dateTimeRange_${vnode.guid}`

        // 当为选择时间范围时
        if (vnode.attrs.multiType === 2) {
            let _model1 = `${vnode.model ? vnode.model : ''}${vnode.fieldId ? '.' + vnode.fieldId : ''}${vnode.subFieldId ? ('.' + vnode.subFieldId) : ''}`
            let _model2 = `${vnode.model ? vnode.model : ''}${vnode.fieldId2 ? '.' + vnode.fieldId2 : ''}${vnode.subFieldId2 ? ('.' + vnode.subFieldId2) : ''}`

            let dateRangeChange = `
                if(!val || val.length === 0) { 
                    this.${_model1} = ""
                    this.${_model2} = ""
                } else {
                    this.${_model1} = val[0]
                    this.${_model2} = val[1]
                }
            `
            context.methods[methodName] = { name: methodName, content: dateRangeChange, args: 'val' }
            const changeConf = vnode.listeners['change']
            if (!changeConf || !changeConf.name) {
                vnode.listeners['change'] = { name: methodName, args: 'val', execution: false }
            }

            // 保存起来处理格式化问题
            // context.data.dateFields.push({
            //     fieldId: `${vnode.fieldId2}${vnode.subFieldId2 ? ('.' + vnode.subFieldId2) : ''}`,
            //     format: vnode.attrs.format,
            //     parentFieldId: vnode.model,
            //     parentFieldType: 'object'
            // })

            // 添加data属性
            context.data[dataName] = []
            // 添加请求成功后初始化方法
            context.created += `
                this.getDataSuccessQueue.push(function () {
                    this.${dataName} = [this.${_model1}, this.${_model2}]
                })
            `

            // 处理model
            if (vnode.subFieldId) {
                context.data.model[vnode.fieldId] = context.data.model[vnode.fieldId] || {}
                context.data.model[vnode.fieldId][vnode.subFieldId] = null
                context.data.model[vnode.fieldId][vnode.subFieldId2] = null
            } else {
                vnode.fieldId && (context.data.model[vnode.fieldId] = null)
                vnode.fieldId2 && (context.data.model[vnode.fieldId2] = null)
            }
        } else {
            // 删除multiType === 2时不存在name事件
            const changeConf = vnode && vnode.listeners && vnode.listeners['change']
            if (changeConf && changeConf.name === methodName) {
                delete vnode.listeners['change']
            }
        }
    }
}

Type.detail = {
    create (opts, parentVnode, context) {
        const defaultOpts = {
            guid: 'date_' + Vue.$utils.guid(8),
            type: 'date',
            model: '',
            // 绑定字段
            fieldId: null,
            subFieldId: null,
            fieldId2: null,
            subFieldId2: null,
            // 文本
            label: '时间',
            attrs: {
                value: '',
                type: 'date',
                type2: 'daterange',
                format: 'yyyy-MM-dd',
                placeholder: '选择日期',
                placeholder1: '开始时间',
                placeholder2: '结束时间',
                readonly: false,
                multiType: 1
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
