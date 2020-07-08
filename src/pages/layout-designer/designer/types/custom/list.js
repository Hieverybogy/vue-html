import Base from './base.js'
import Config, { getExtendComponents } from '../../config.js'
const Type = Object.create(Base)

Type.list = {
    create (opts, parentVnode, context) {
        const defaultOpts = {
            guid: Vue.$utils.guid(),
            type: 'custom',
            model: '',
            // 绑定字段
            fieldId: null,
            // 文本
            label: '组件',
            componentName: '',
            readonly: false
        }

        return Object.assign(defaultOpts, opts || {})
    },
    parseVnode (vnode, parentVnode, context) {
        // 判断是否加载自定义的组件配置
        if (Object.keys(Config).length === 0) {
            getExtendComponents()
        }

        if (!vnode.componentName || !Config.customerComponent[vnode.componentName]) {
            return ''
        }

        const conf = Config.customerComponent[vnode.componentName]
        let fieldId = vnode.fieldId
        let currentFieldId
        let optionHtml
        if (conf.props) {
            let isUsePropToParent = Vue.$utils.isBoolean(conf.isUsePropToParent) ? conf.isUsePropToParent : true
            let i = 0
            let propsLen = Object.keys(conf.props).length
            let model = context.data[vnode.fieldId]

            let fieldsStr = '{ '
            for (let key in conf.props) {
                let param = conf.props[key]
                isUsePropToParent && (model[key] = null)
                if (i + 1 === propsLen) {
                    isUsePropToParent && (fieldId = key)
                    fieldsStr += `${key}: '${param}'`
                } else {
                    fieldsStr += `${key}: '${param}', `
                }

                i++
            }
            fieldsStr += ' }'
            if (isUsePropToParent === true) {
                currentFieldId = ''
            } else {
                currentFieldId = '.' + fieldId
            }

            optionHtml = `:props="${fieldsStr}"`
        } else {
            // data[formKey][fieldId] = value
            currentFieldId = '.' + fieldId
        }

        let params = conf.params
        let paramHtml = ''
        if (params && Object.keys(params).length > 0) {
            for (let key in params) {
                paramHtml += `:${key}="${params[key]}" `
            }
        }
        let viewName = vnode.componentName
        context.components[viewName] = conf

        return `
            <${viewName}  
                v-model="${vnode.model ? vnode.model + '.' : ''}${currentFieldId}"
                ${vnode.placeholder ? `placeholder="${vnode.placeholder}"` : ''} 
                ${optionHtml} 
                ${paramHtml}>
            </${viewName}>`
    }
}

export default Type
