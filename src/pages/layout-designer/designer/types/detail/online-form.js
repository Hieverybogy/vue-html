import Base from './base.js'
const Type = Object.create(Base)

Type['online-form'] = {
    create (opts) {
        const defaultOpts = {
            guid: 'detail_' + Vue.$utils.guid(8),
            type: 'detail',
            model: '',
            // 绑定字段
            fieldId: null,
            subFieldId: null,
            aliasFieldId: '',
            // 文本
            label: '子表单',
            columns: [
                // {
                //     fieldId: '列id',
                //     label: '列名称',
                //     type: 'column',
                //     width: '',
                //     // 包含节点类型
                //     vnode: {}
                // }
            ],
            attrs: {
            },
            listeners: {},
            conditions: {},
            titleVisible: true,
            canAdd: true,
            addBtnName: '新增',
            canDelete: true,
            canEdit: true,
            useOperateColumn: true,
            useDialog: false,
            // 是否必填
            required: false,
            // 必填验证失败提示信息
            requiredErrorMsg: '',
            // 是否占据整行
            fullline: true,
            // 是否单独占据一行，留一半空白
            alone: false,
            labelWidthAuto: true,
            // 自定义校验规则
            validator: null
        }

        return Object.assign(defaultOpts, opts || {})
    },
    parseVnode (vnode, parentVnode, context) {
        const columnsHtml = []
        const bottomAddBtn = []
        const isEditMode = context.mode === 'Add' || context.mode === 'Edit' || context.mode === 'Adjust'
        const requires = []
        this.parseColumnHtml(vnode, context, isEditMode, columnsHtml, requires)
        this.parseBottomAddBtn(vnode, context, isEditMode, bottomAddBtn)

        if (!context.locked) {
            this.parseRules(vnode, context, requires)
        }

        return `
            <el-table class="common-table" 
                :data='${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}'>${columnsHtml.join('')}
            </el-table>
            ${bottomAddBtn.join('')}
        `
    },
    parseBottomAddBtn (vnode, context, isEditMode, bottomAddBtn) {
        if (!isEditMode) {
            return []
        }

        const addMethodName = vnode.guid + '_addClick'
        if (!context.locked && (!vnode.listeners['add'] || vnode.listeners['add']['name'] === addMethodName)) {
            const fieldIds = vnode.columns.map((column) => {
                return `${column.fieldId}: null`
            })

            context.methods[addMethodName] = {
                name: addMethodName,
                content: `var obj = {
                            ${fieldIds.join(',')}
                        }
                    if (!this.model.${vnode.fieldId}) {
                        this.model.${vnode.fieldId} = []
                    }
                    this.model.${vnode.fieldId}.push(obj)`
            }

            const addConf = vnode.listeners['add']
            if (!addConf || !addConf.name) {
                vnode.listeners['add'] = { name: addMethodName, args: '', execution: false }
            }
        }
        const mOption = vnode.listeners['add']
        const addListenersStr = `${mOption['name'] + (mOption.execution ? `(${typeof mOption.args === 'string' ? mOption.args : mOption.args.join(', ')})` : '')}`
        // 添加按钮
        bottomAddBtn.push('<div class="common-table__bottom-btn">')
        bottomAddBtn.push(`<span @click="${addListenersStr}"><i class="el-icon-circle-plus"></i>${vnode.addBtnName || '新增'}`)
        bottomAddBtn.push('</span></div>')
    },
    parseColumnHtml (vnode, context, isEditMode, columnsHtml, requires) {
        vnode.columns.forEach((column) => {
            columnsHtml.push(context.previewCurrentVnode ? '' : context.preview.Types[column.type].parseVnode(column, vnode, context))

            if (column.isRequired) {
                requires.push(column)
            }
        })

        if (vnode.useOperateColumn && isEditMode && vnode.canDelete) {
            const deleteMethod = vnode.guid + '_deleteClick'

            if (!context.locked && (!vnode.listeners['delete'] || vnode.listeners['delete']['name'] === deleteMethod)) {
                context.methods[deleteMethod] = {
                    name: deleteMethod,
                    args: 'row, index',
                    content: `this.model.${vnode.fieldId}.splice(index, 1)`
                }

                const deleteConf = vnode.listeners['delete']
                if (!deleteConf || !deleteConf.name) {
                    vnode.listeners['delete'] = { name: deleteMethod, args: 'scope.row, scope.$index', execution: true }
                }
            }

            const mOption = vnode.listeners['delete']
            const deleteListenersStr = `${mOption['name'] + (mOption.execution ? `(${typeof mOption.args === 'string' ? mOption.args : mOption.args.join(', ')})` : '')}`
            columnsHtml.push(`
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="60">
                    <template slot-scope="scope">
                        <el-button @click="${deleteListenersStr}" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            `)
        }
    },
    // parseColumnVnode (column, parentVnode, context) {
    //     // 如果是弹出层展示明细或者查看模式，只返回文本
    //     if (context.mode === 'View' || column.useDialog) {
    //         return `<span v-text="props.row['${column.fieldId}']"></span>`
    //     } else if (context.preview.Types[column.vnode.type] && context.preview.Types[column.vnode.type].parseVnode) {
    //         return `${context.preview.Types[column.vnode.type].parseVnode(column.vnode, parentVnode, context)}`
    //     } else {
    //         throw new Error(`未找到${column.type}类型的控件`)
    //     }
    // },
    parseRules (vnode, context, requires) {
        if ((vnode.required || requires.length > 0)) {
            // 校验规则、方法
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
                context.data.rules[vnode.fieldId] = rules
            }

            const rule = {
                type: 'array',
                defaultField: { type: 'object' }
            }

            if (vnode.required) {
                rule.required = true
                rule.message = vnode.requiredErrorMsg
            }

            requires.forEach((item) => {
                if (!rule.defaultField.fields) {
                    rule.defaultField.fields = {}
                }

                rule.defaultField.fields[item.fieldId] = this.parseColumnRule(item)
            })

            context.data.rules[vnode.fieldId] = rule
        }
    },
    // 获取字段验证规则
    parseColumnRule (vnode) {
        if (vnode.required) {
            const rule = {
                required: true,
                message: vnode.requiredErrorMsg,
                trigger: []
            }

            switch (vnode.type) {
                case 'text':
                case 'textarea':
                case 'int':
                case 'float':
                    rule.trigger.push('blur')
                    break
                case 'select':
                case 'checkbox':
                case 'radio':
                case 'upload':
                    rule.trigger.push('change')
                    break
            }

            return rule
        }

        return null
    }
}

export default Type
