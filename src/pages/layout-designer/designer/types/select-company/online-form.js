import Base from './base.js'
const Type = Object.create(Base)

Type['online-form'] = {
    create (opts, parentVnode, context) {
        if (parentVnode && parentVnode.type === 'detail') {
            return Type.detail.create(opts, parentVnode, context)
        }

        const defaultOpts = {
            guid: 'selectCompany_' + Vue.$utils.guid(8),
            type: 'selectCompany',
            model: '',
            // 绑定字段
            fieldId: null,
            relationship: 1,
            // relationship为2时，multFieldId需指定一对多字段
            multFieldId: null,
            mapFieldIds: [
                {
                    fieldId: '', // 绑定字段
                    userFieldId: 'id' // 关联公司/部门id
                },
                {
                    fieldId: '', // 绑定字段
                    userFieldId: 'name' // 关联公司/部门名称
                }
            ],
            // 文本
            label: '公司/部门',
            // all/compnay/dept
            selectType: 'all',
            onlyLeafActive: false,
            attrs: {
                // withDept: false,
                // companyWithClick: true,
                // activeHasChild: true,
                clearable: true,
                readonly: false
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
            requiredErrorMsg: '请选择公司',
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
            this.parseMethods(vnode, parentVnode, context)
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
                const modelId = vnode.mapFieldIds.filter((item) => {
                    return item.userFieldId === 'id'
                })

                if (modelId && modelId[0].fieldId) {
                    context.data.rules[modelId[0].fieldId] = rules
                }
            }
        }
    },
    parseMethods (vnode, parentVnode, context) {
        const changeEvent = `${vnode.guid}_change`
        const inDetail = parentVnode && parentVnode.type === 'detail' || false
        // 赋值多个字段时需要在change事件中赋值
        if (vnode.mapFieldIds.length > 1 &&
            (!vnode.listeners.change || vnode.listeners.change.name === changeEvent)) {
            vnode.listeners['change'] = { name: changeEvent, args: (inDetail ? `${vnode.model}, $event` : ''), execution: inDetail }

            const fmts = []
            vnode.mapFieldIds.forEach(function (field) {
                // 跳过id
                if (field.userFieldId !== 'id') {
                    if (inDetail) {
                        fmts.push(`row.${field.fieldId} = item['${field.userFieldId}']`)
                    } else {
                        fmts.push(`this.${vnode.model}.${field.fieldId || 'null'} = item['${field.userFieldId}']`)
                    }
                }
            })

            context.methods[changeEvent] = {
                args: inDetail ? 'row, item' : 'item',
                name: changeEvent,
                content: fmts.join('\n')
            }
        }
    },
    parseVnodeForEdit (vnode, parentVnode, context) {
        const listenersStr = Type.parseListeners(vnode)
        const modelId = vnode.mapFieldIds.filter((item) => {
            return item.userFieldId === 'id'
        })

        return `<sapi-stru
            v-model="${vnode.model ? vnode.model + '.' : ''}${modelId && modelId[0].fieldId || 'null'}"
            ${listenersStr}
            ${vnode.selectType === 'company' ? '' : 'with-dept'} 
            ${vnode.attrs.clearable ? `clearable` : ''}
            ${vnode.attrs.readonly ? 'readonly' : ''}
            ${vnode.selectType === 'dept' ? `:company-with-click="false"` : `company-with-click`}
            ${!vnode.onlyLeafActive ? `active-has-child` : `:active-has-child="false"`}>
            </sapi-stru>`
    },
    parseVnodeForView (vnode, parentVnode, context) {
        const modelId = vnode.mapFieldIds.filter((item) => {
            return item.userFieldId === 'id'
        })

        return `<sapi-stru
            v-model="${vnode.model ? vnode.model + '.' : ''}${modelId && modelId[0].fieldId || 'null'}"
            ${vnode.selectType === 'company' ? '' : 'with-dept'} 
            readonly
            ${vnode.selectType === 'dept' ? `:company-with-click="false"` : `company-with-click`}
            ${!vnode.onlyLeafActive ? `active-has-child` : `:active-has-child="false"`}>
            </sapi-stru>`
    }
}

Type.detail = {
    create (opts, parentVnode, context) {
        const defaultOpts = {
            guid: 'selectCompany_' + Vue.$utils.guid(),
            type: 'selectCompany',
            model: '',
            // 绑定字段
            fieldId: null,
            // 绑定选中文本字段
            textFieldId: null,
            // 文本
            label: '公司/部门',
            // all/compnay/dept
            selectType: 'all',
            onlyLeafActive: false,
            attrs: {
                // withDept: false,
                // companyWithClick: true,
                // activeHasChild: true,
                clearable: true,
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
