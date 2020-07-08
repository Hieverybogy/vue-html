import Base from './base.js'
const Type = Object.create(Base)

Type['online-form'] = {
    create (opts, parentVnode, context) {
        if (parentVnode && parentVnode.type === 'detail') {
            return Type.detail.create(opts, parentVnode, context)
        }

        const defaultOpts = {
            guid: 'selectUser_' + Vue.$utils.guid(8),
            type: 'selectUser',
            model: '',
            // 绑定字段
            fieldId: null,
            subFieldId: null,
            relationship: 2,
            multFieldId: '',
            mapFieldIds: [
                // {
                //     fieldId: '', // 绑定字段
                //     userFieldId: '' // 关联用户的字段
                // }
            ],
            // 文本
            label: '选择用户',
            attrs: {
                title: '选择用户',
                multiple: true,
                data: [],
                height: 34,
                hasImg: false,
                readonly: false,
                placeholder: '选择用户',
                hasMore: true,
                type: false,
                format: ''
            },
            // 是否必填
            required: false,
            // 必填验证失败提示信息
            requiredErrorMsg: '请选择用户',
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
            // 添加项目的的方法
            this.addMethod(vnode, parentVnode, context)
            this.addSelectUserTemplate(vnode, parentVnode, context)
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
                context.data.rules[vnode.fieldId + (vnode.subFieldId ? '.' + vnode.subFieldId : '')] = rules
            }
        }
    },
    parseVnodeForEdit (vnode, parentVnode, context) {
        // 暂时不支持明细表
        return `
            <sapi-select-btn 
                v-model="${vnode.guid}_data"
                :format="${vnode.guid}_format" 
                @select="${vnode.guid}_btnClick" 
                ${vnode.attrs.placeholder ? `placeholder="${vnode.attrs.placeholder}"` : ''}
                ${vnode.attrs.height ? `height="${vnode.attrs.height}px"` : ''}
                ${vnode.attrs.hasMore ? `:hasMore="${vnode.attrs.hasMore}"` : `:hasMore="false"`}
                ${vnode.attrs.readonly ? `:readonly="${vnode.attrs.readonly}"` : ''}
            ></sapi-select-btn>`
    },
    parseVnodeForView (vnode, parentVnode, context) {
        return `<sapi-select-btn 
                v-model="${vnode.guid}_data"
                :format="${vnode.guid}_format" 
                @select="${vnode.guid}_btnClick" 
                ${vnode.attrs.placeholder ? `placeholder="${vnode.attrs.placeholder}"` : ''}
                ${vnode.attrs.height ? `height="${vnode.attrs.height}px"` : ''}
                ${vnode.attrs.hasMore ? `hasMore="${vnode.attrs.hasMore}"` : `hasMore="false"`}
                readonly
            ></sapi-select-btn>`
    },
    addMethod (vnode, parentVnode, context) {
        // 添加当前选择人员的配置
        context.data[`${vnode.guid}_data`] = []
        context.data[`${vnode.guid}_userData`] = []
        // *********** methods ***********/
        const fieldIds = vnode.mapFieldIds.map(function (field) {
            return field.fieldId
        })

        // 选择时重置用户选择框绑定属性
        context.methods[`${vnode.guid}_btnClick`] = {
            name: `${vnode.guid}_btnClick`,
            args: '',
            content: `
                this.selectUserDataKey = '${vnode.guid}'
                this.selectUserData = this.${vnode.guid}_userData
                this.selectUserMultiple = ${vnode.attrs.multiple}
                this.selectUserHasImg = ${vnode.attrs.hasImg}
                this.selectUserType = '${vnode.attrs.type ? 'select-station' : 'select-user'}'
                this.selectUserVisible = true
                console.log(this.${vnode.guid}_userData)
            `
        }

        let fmt = ''
        vnode.mapFieldIds.forEach(function (field) {
            if (vnode.relationship === 1) {
                fmt += `
                    data['${field.fieldId}'] = this.${vnode.model ? vnode.model + '.' : ''}${field.fieldId || 'null'}
                    userData['${field.userFieldId}'] = this.${vnode.model ? vnode.model + '.' : ''}${field.fieldId || 'null'}
                    if (!isExistVal && data['${field.fieldId}']) {
                        isExistVal = true
                    }
                `
            } else {
                fmt += `
                    data['${field.fieldId}'] = item.${field.fieldId}
                    userData['${field.userFieldId}'] = item.${field.fieldId}
                `
            }
        })
        // 初始化显示用户
        context.methods[`${vnode.guid}_init`] = {
            name: `${vnode.guid}_init`,
            args: '',
            content: `
                var _this = this

                this.${vnode.guid}_data = []
                this.${vnode.guid}_userData = []
                ${vnode.relationship === 1 ? `
                var data = {}
                var userData = {}
                var isExistVal = false

                ${fmt}

                if (isExistVal) {
                    this.${vnode.guid}_data.push(data)
                    this.${vnode.guid}_userData.push(data)
                }
                ` : `
                var datas = this.${vnode.model ? vnode.model + '.' : ''}${vnode.multFieldId || 'null'}
                datas && datas.forEach(function (item) {
                    var data = {}
                    var userData = {}
                    ${fmt}
                    _this.${vnode.guid}_data.push(data)
                    _this.${vnode.guid}_userData.push(data)
                })
                `}
            `
        }

        // 添加到请求完成后执行队列
        context.created += `
            this.getDataSuccessQueue.push(this.${vnode.guid}_init)
        `

        // 格式化
        context.methods[`${vnode.guid}_format`] = {
            name: `${vnode.guid}_format`,
            args: 'item',
            content: `
                var fieldIds = ['${fieldIds.join('\',\'')}']
                return '${vnode.attrs.format}'.replace(/{([^}]*)}/g, function (pat, key) {
                    var i = Number(key) - 1
                    if (fieldIds[i]) {
                        return item[fieldIds[i]]
                    }

                    return ''
                })
            `
        }

        let fmts = ''
        vnode.mapFieldIds.forEach(function (field) {
            if (!vnode.attrs.multiple) {
                fmts += `
                    this.${vnode.model ? vnode.model + '.' : ''}${field.fieldId || 'null'} = data.${field.userFieldId || 'null'}
                    obj['${field.fieldId}'] = data.${field.userFieldId || 'null'}
                `
            } else {
                fmts += `
                    obj['${field.fieldId}'] = item.${field.fieldId}
                    model['${field.userFieldId}'] = item.${field.fieldId}
                `
            }
        })
        // 选中用户成功之后回调：格式化字段，一对一改变对应的字段值，一对多重写字段值
        context.methods[`${vnode.guid}_callback`] = {
            name: `${vnode.guid}_callback`,
            args: 'data',
            content: `
                this.${vnode.guid}_data = []
                console.log(this.${vnode.guid}_userData)
                this.${vnode.guid}_userData = this.selectUserData
                if (data) {
                    ${!vnode.attrs.multiple ? `
                    var obj = {}
                    ${fmts}
                    this.${vnode.guid}_data.push(obj)
                    ` : `
                    this.${vnode.model ? vnode.model + '.' : ''}${vnode.multFieldId || 'null'} = []
                    data.forEach(function (item) {
                        var obj = {}
                        var model = {}
                        ${fmts}
                        this.${vnode.guid}_data.push(obj)
                        this.${vnode.model ? vnode.model + '.' : ''}${vnode.multFieldId || 'null'}.push(model)
                    })
                    `}
                }
            `
        }
    },
    addSelectUserTemplate (vnode, parentVnode, context) {
        // 多个选择用户公用一个sapi-select-user组件
        if (context.locked && context.data.hasOwnProperty('selectUserVisible')) {
            return
        }

        context.data.selectUserVisible = false
        context.data.selectUserTitle = ''
        context.data.selectUserMultiple = false
        context.data.selectUserData = null
        context.data.selectUserDataKey = ''
        context.data.selectUserHasImg = false
        context.data.selectUserType = ''

        context.methods['selectUserCallback'] = {
            name: 'selectUserCallback',
            args: 'data',
            content: `
                this[this.selectUserDataKey + '_callback'](data)
            `
        }

        context.otherTemplate += `
            <sapi-select-user
                v-model="selectUserVisible"
                :title="selectUserTitle"
                :multiple="selectUserMultiple"
                :data.sync="selectUserData"
                :hasImg="selectUserHasImg"
                @callback="selectUserCallback"
                :type="selectUserType"
            ></sapi-select-user>
        `
    }
}

Type.detail = {
    create (opts, parentVnode, context) {
        const defaultOpts = {
            guid: Vue.$utils.guid(8),
            type: 'selectUser',
            model: '',
            // 绑定字段
            fieldId: null,
            relationship: 1,
            multFieldId: '',
            mapFieldIds: [
                // {
                //     fieldId: '', // 绑定字段
                //     userFieldId: '', // 关联用户的字段
                //     custom: false, // 是否格式化
                //     format: '' // 格式化模板：例如，“{name}({company})”解析为“张三(数智爱德)”
                // }
            ],
            // 文本
            label: '选择用户',
            attrs: {
                title: '选择用户',
                multiple: true,
                data: [],
                height: 34,
                hasImg: false,
                readonly: false,
                placeholder: '选择用户',
                hasMore: true,
                type: false,
                format: '{name}'
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
