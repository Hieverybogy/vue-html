import Base from './base.js'
const Type = Object.create(Base)

Type.form = {
    create (opts) {
        const defaultOpts = {
            guid: Vue.$utils.guid(),
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
            canAdd: true,
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
            // 自定义校验规则
            validator: null
        }

        return Object.assign(defaultOpts, opts || {})
    },
    parseVnode (vnode, parentVnode, context) {
        const columnsHtml = []
        const topBtns = []
        const isEditMode = context.mode === 'Add' || context.mode === 'Edit'
        const requires = []
        if (vnode.useDialog) {
            // 弹出层添加子表明细
            // 创建一个子文件
        }

        this.parseColumnHtml(vnode, context, isEditMode, columnsHtml, requires)

        this.parseTopBtns(vnode, context, isEditMode, topBtns)

        this.parseRules(vnode, context, isEditMode, requires)

        return `
            ${topBtns.join('')}
            <el-table class="common-table" 
                ${!vnode.useOperateColumn && isEditMode ? `@selection-change="${vnode.aliasFieldId}SelectionChange"` : ''}
                :data='${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? ('.' + vnode.subFieldId) : ''}'>${columnsHtml.join('')}
            </el-table>
        `
    },
    parseTopBtns (vnode, context, isEditMode, topBtns) {
        if (!isEditMode) {
            return []
        }

        // 添加按钮
        topBtns.push('<div class="operate-btn-warp"><ul class="btn-wrap">')
        const addMethodName = vnode.aliasFieldId + '_addClick'
        topBtns.push(`<li class="icon-build" @click="${addMethodName}"></li>`)
        const fieldIds = vnode.columns.map((column) => {
            return `${column.fieldId}: null`
        })
        context.methods[addMethodName] = {
            name: addMethodName,
            content: `let obj = {
                        ${fieldIds.join(',')}
                    }
                if (!this.model.${vnode.fieldId}) {
                    this.model.${vnode.fieldId} = []
                }
                this.model.${vnode.fieldId}.push(obj)`
        }

        // 没有使用操作列的情况下，添加删除
        if (!vnode.useOperateColumn) {
            const deleteMethod = vnode.aliasFieldId + '_deleteClick'
            topBtns.push(`<li class="icon-deleter" @click="${deleteMethod}"></li>`)
            const idKey = vnode.aliasFieldId + 'DeleteDatas'
            context.data[idKey] = []
            context.methods[deleteMethod] = {
                name: deleteMethod,
                content: `let deleteDatas = this.${idKey}
                    if (deleteDatas.length == 0) {
                        Vue.msg('最少选择一项，才能进行删除')
                        return false
                    }
                    let datas = this.model.${vnode.fieldId}
                    deleteDatas.forEach(data => {
                        let index = datas.findIndex(current => current === data)
                        if (index > -1) {
                            datas.splice(index, 1)
                        }
                    })`
            }
        }

        topBtns.push('</ul></div>')
    },
    parseColumnHtml (vnode, context, isEditMode, columnsHtml, requires) {
        // 添加选择列
        if (!vnode.useOperateColumn && isEditMode) {
            columnsHtml.push(`<el-table-column type="selection" width="45"></el-table-column>`)

            let changeMethod = vnode.aliasFieldId + 'SelectionChange'
            let idKey = vnode.aliasFieldId + 'DeleteDatas'
            context.methods[changeMethod] = {
                name: changeMethod,
                args: 'datas',
                content: `this.${idKey} = [].concat(datas)`
            }
        }

        vnode.columns.forEach((column) => {
            columnsHtml.push(`
            <el-table-column label="${column.label}" ${column.width ? `width="${column.width}px"` : ''}>
                <template slot-scope='props'>${this.parseColumnVnode(column, vnode, context)}</template>
            </el-table-column>`)

            if (column.isRequired) {
                requires.push(column)
            }
        })

        if (vnode.useOperateColumn && isEditMode) {
            const deleteMethod = vnode.aliasFieldId + '_deleteClick'
            const EditMethod = vnode.aliasFieldId + '_editClick'
            columnsHtml.push(`
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        ${!vnode.useDialog ? '' : `<el-button @click="${EditMethod}(scope.row)" type="text" size="small">编辑</el-button>`}
                        <el-button @click="${deleteMethod}(scope.row, scope.$index)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            `)

            context.methods[deleteMethod] = {
                name: deleteMethod,
                args: 'row, index',
                content: `this.model.${vnode.fieldId}.splice(index, 1)`
            }

            if (vnode.useDialog) {
                context.methods[`${vnode.aliasFieldId}_openDialog`] = {
                    name: `${vnode.aliasFieldId}_openDialog`,
                    args: 'row',
                    content: `
                        this.innerView = "${vnode.aliasFieldId}"
                        this.innerOption = row
                        this.innerVisible = true
                    `
                }
            }
        }
    },
    parseColumnVnode (column, parentVnode, context) {
        // 如果是弹出层展示明细或者查看模式，只返回文本
        if (context.mode === 'View' || column.useDialog) {
            return `<span v-text="props.row['${column.fieldId}']"></span>`
        } else if (context.preview.Types[column.vnode.type] && context.preview.Types[column.vnode.type].parseVnode) {
            return `${context.preview.Types[column.vnode.type].parseVnode(column.vnode, parentVnode, context)}`
        } else {
            throw new Error(`未找到${column.type}类型的控件`)
        }
    },
    parseRules (vnode, context, isEditMode, requires) {
        if (isEditMode && (vnode.required || requires.length > 0)) {
            // 校验规则、方法
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
