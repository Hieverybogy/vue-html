
import Base from './base.js'
const Type = Object.create(Base)

Type.form = {
    create (opts, parentVnode, context) {
        if (parentVnode && parentVnode.type === 'detail') {
            return Type.detail.create(opts, parentVnode, context)
        }

        const defaultOpts = {
            guid: Vue.$utils.guid(),
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
        if (context.mode === 'Add' || context.mode === 'Edit') {
            return this.parseVnodeForEdit(vnode, parentVnode, context)
        } else {
            return this.parseVnodeForView(vnode, parentVnode, context)
        }
    },
    // 表单编辑模式解析
    parseVnodeForEdit (vnode, parentVnode, context) {
        // 不存在父节点：表示节点不在明细表中
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
                if (vnode.attrs.multiType === 2) {
                    context.data.rules[vnode.fieldId2 + (vnode.subFieldId2 ? '.' + vnode.subFieldId2 : '')] = rules
                }
            }
        }

        this.addMore(vnode, parentVnode, context)

        return `
            <el-date-picker @change="dateRangeChange"
                type="${vnode.attrs.multiType === 1 ? vnode.attrs.type : vnode.attrs.type2}" 
                ${vnode.attrs.readonly ? 'readonly' : ''} 
                ${vnode.attrs.multiType === 1 ? `format="${vnode.attrs.format}"` : ''}
                ${vnode.attrs.multiType === 1 ? `placeholder="${vnode.attrs.placeholder}"` : ''}
                ${vnode.attrs.multiType === 2 ? `range-separator="至"` : ''}
                ${vnode.attrs.multiType === 2 ? `start-placeholder="${vnode.attrs.placeholder1}"` : ''}
                ${vnode.attrs.multiType === 2 ? `end-placeholder="${vnode.attrs.placeholder2}"` : ''}
                ${!vnode.attrs.readonly ? 'v-model' : ':value'}="${vnode.attrs.multiType === 2 ? 'dateTimeRange' : `${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? ('.' + vnode.subFieldId) : ''}`}"></el-date-picker>
        `
    },
    // 表单查看模式解析
    parseVnodeForView (vnode, parentVnode, context) {
        this.addMore(vnode, parentVnode, context)

        return `
            <el-date-picker 
                type="${vnode.attrs.multiType === 1 ? vnode.attrs.type : vnode.attrs.type2}" 
                readonly
                ${vnode.attrs.multiType === 1 ? `format="${vnode.attrs.format}"` : ''}
                ${vnode.attrs.multiType === 1 ? `placeholder="${vnode.attrs.placeholder}"` : ''}
                ${vnode.attrs.multiType === 2 ? `range-separator="至"` : ''}
                ${vnode.attrs.multiType === 2 ? `start-placeholder="${vnode.attrs.placeholder1}"` : ''}
                ${vnode.attrs.multiType === 2 ? `end-placeholder="${vnode.attrs.placeholder2}"` : ''}
                :value="${vnode.attrs.multiType === 2 ? 'dateTimeRange' : `${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? ('.' + vnode.subFieldId) : ''}`}"></el-date-picker>
        `
    },
    addMore(vnode, parentVnode, context) {
        // 保存起来处理格式化问题
        context.data.dateFields.push({
            fieldId:  `${vnode.fieldId}${vnode.subFieldId ? ('.' + vnode.subFieldId) : ''}`,
            format: vnode.attrs.format,
            parentFieldId: vnode.model,
            parentFieldType: 'object'
        })
      
        // 当为选择时间范围时
        if (vnode.attrs.multiType === 2) {
            context.data.dateTimeRange = []
            let _model1 = `${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? ('.' + vnode.subFieldId) : ''}`
            let _model2 = `${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId2}${vnode.subFieldId2 ? ('.' + vnode.subFieldId2) : ''}`

            let dateRangeChange = `
                if(!val || val.length === 0) { 
                    this.${_model1} = "";
                    this.${_model2} = "";
                } else {
                    this.${_model1} = val[0];
                    this.${_model2} = val[1];
                }
            `
            context.methods.dateRangeChange = {name: 'dateRangeChange', content: dateRangeChange, args: 'val'}


            // 保存起来处理格式化问题
            context.data.dateFields.push({
                fieldId: `${vnode.fieldId2}${vnode.subFieldId2 ? ('.' + vnode.subFieldId2) : ''}`,
                format: vnode.attrs.format,
                parentFieldId: vnode.model,
                parentFieldType: 'object'
            })
            // 编辑/详情查询接口时进行赋值
            context.data.dealData = `this.dateTimeRange = [this.${_model1}, this.${_model2}]`

            // 处理model
            if (vnode.subFieldId) {
                context.data.model[vnode.fieldId] = context.data.model[vnode.fieldId] || {}
                context.data.model[vnode.fieldId][vnode.subFieldId] = null
                context.data.model[vnode.fieldId][vnode.subFieldId2] = null
            } else {
                context.data.model[vnode.fieldId] = null
                context.data.model[vnode.fieldId2] = null
            }
        }
    }
}

Type.detail = {
    create (opts, parentVnode, context) {
        const defaultOpts = {
            guid: Vue.$utils.guid(),
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
