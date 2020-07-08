import Base from './base.js'

const Checkbox = Object.create(Base)

Checkbox['online-form'] = {
    create (opts, parentVnode, context) {
        if (parentVnode && parentVnode.type === 'detail') {
            return Checkbox.Detail.create(opts, parentVnode, context)
        }

        const defaultOpts = {
            guid: 'checkbox_' + Vue.$utils.guid(8),
            type: 'checkbox',
            model: '',
            // 绑定字段
            fieldId: null,
            subFieldId: null,
            // 文本
            label: '多选',
            defaultValueType: 'none',
            defaultValue: '',
            attrs: {
                value: '',
                placeholder: '',
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
            api: null, // {url: '请求地址', params: '参数', labelField: '', valueField: '', dataProp: '${vnode.fieldId}_options'}
            optionsProp: '',
            // 自定义校验规则
            validator: ''
        }

        return Object.assign(defaultOpts, opts)
    },
    parseVnode (vnode, parentVnode, context) {
        // 新增、修改、查看共用一个vue选项
        if (!context.locked) {
            this.parseRules(vnode, parentVnode, context)
            Checkbox.parseApi(vnode, `options_${vnode.guid}`, context)
            Checkbox.parseDefaultValue(vnode, parentVnode, context)
        }

        if (parentVnode && parentVnode.type === 'detail') {
            return Checkbox.detail.parseVnode(vnode, parentVnode, context)
        } else if (context.mode === 'Add' || context.mode === 'Edit' || context.mode === 'Adjust') {
            return this.parseVnodeForEdit(vnode, parentVnode, context)
        } else {
            return this.parseVnodeForView(vnode, parentVnode, context)
        }
    },
    parseRules (vnode, parentVnode, context) {
        let rules
        if (vnode.required) {
            rules = [{
                required: true, message: vnode.requiredErrorMsg, trigger: 'change'
            }]
        }

        if (rules) {
            context.data.rules[vnode.fieldId + (vnode.subFieldId ? '.' + vnode.subFieldId : '')] = rules
        }
    },
    parseVnodeForEdit (vnode, parentVnode, context) {
        const listenersStr = this.parseListeners(vnode)
        let optionsName = `options_${vnode.guid}`
        if (vnode.dataSourceType === 'dataProp') {
            optionsName = vnode.optionsProp
        }

        return `
            <el-checkbox-group 
            ${listenersStr}
            ${vnode.attrs['disabled-expression'] ? `:disabled="${vnode.attrs['disabled-expression']}"` : (vnode.attrs.readonly ? 'disabled' : '')}
                ${vnode.attrs.disabled ? ':value' : 'v-model'}="${vnode.model ? (vnode.model + '.') : ''}${vnode.fieldId}${vnode.subFieldId ? '.' + vnode.subFieldId : ''}">
                <el-checkbox :key='index' :label='item.value' 
                    v-for='(item, index) in ${optionsName}'>{{item.label}}</el-checkbox>
            </el-checkbox-group>`
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
            <el-checkbox-group 
                disabled
                :value="${vnode.model ? (vnode.model + '.') : ''}${vnode.fieldId}${vnode.subFieldId ? '.' + vnode.subFieldId : ''}">
                <el-checkbox :key='index' :label='item.value' 
                    v-for='(item, index) in ${optionsName}'>{{item.label}}</el-checkbox>
            </el-checkbox-group>`
    }
}

Checkbox.detail = {
    create (opts, parentVnode, context) {
        const defaultOpts = {
            guid: 'checkbox_' + Vue.$utils.guid(),
            type: 'checkbox',
            model: '',
            // 绑定字段
            fieldId: null,
            // 文本
            label: '多选',
            attrs: {
                value: '',
                placeholder: '',
                disabled: false
            },
            dataSourceType: 'custom',
            // 多选项
            options: [],
            api: null // {url: '请求地址', params: '参数', labelField: '', valueField: '', dataProp: '${vnode.fieldId}_options'}
        }

        return Object.assign(defaultOpts, opts)
    },
    parseVnode (vnode, parentVnode, context) {
        if (context.mode === 'Add' || context.mode === 'Edit' || context.mode === 'Adjust') {
            return this.parseVnodeForEdit(vnode, parentVnode, context)
        } else {
            return this.parseVnodeForView(vnode, parentVnode, context)
        }
    },
    parseVnodeForEdit (vnode, parentVnode, context) {
        // 验证必填等在明细里统一校验
        const optionsProp = `${vnode.fieldId}${vnode.subFieldId ? '_' + vnode.subFieldId : ''}_options`
        Checkbox.parseApi(vnode, optionsProp, context)

        return `
            <el-checkbox-group 
                ${vnode.attrs.disabled ? 'disabled' : ''} 
                ${vnode.attrs.disabled ? ':value' : 'v-model'}="${vnode.model ? (vnode.model + '.') : ''}${vnode.fieldId}${vnode.subFieldId ? '.' + vnode.subFieldId : ''}">
                <el-checkbox :key='index' :label='item.value' 
                    v-for='(item, index) in ${optionsProp}'>{{item.label}}</el-checkbox>
            </el-checkbox-group>`
    },
    parseVnodeForView (vnode, parentVnode, context) {
        const optionsProp = `${vnode.fieldId}${vnode.subFieldId ? '_' + vnode.subFieldId : ''}_options`
        Checkbox.parseApi(vnode, optionsProp, context)

        return `
            <el-checkbox-group 
                disabled :value="${vnode.model ? (vnode.model + '.') : ''}${vnode.fieldId}${vnode.subFieldId ? '.' + vnode.subFieldId : ''}">
                <el-checkbox :key='index' :label='item.value' 
                    v-for='(item, index) in ${optionsProp}'>{{item.label}}</el-checkbox>
            </el-checkbox-group>`
    }
}

export default Checkbox
