import Base from './base.js'
const Type = Object.create(Base)

Type['online-form'] = {
    create (opts, parentVnode, context) {
        if (parentVnode && parentVnode.type === 'detail') {
            return Type.detail.create(opts, parentVnode, context)
        }

        const defaultOpts = {
            guid: 'upload_' + Vue.$utils.guid(),
            type: 'upload',
            model: '',
            // 绑定字段
            fieldId: null,
            subFieldId: null,
            // 文本
            label: '附件',
            attrs: {
                size: '',
                count: '',
                type: '',
                readonly: false,
                placeholder: '',
                hasUser: true,
                hasSize: true,
                hasDate: false,
                hasLoad: true,
                hasPreview: true,
                previewExtend: null,
                downloadExtend: null,
                uploadExtend: null
            },
            conditions: {},
            // 是否必填
            required: false,
            // 必填验证失败提示信息
            requiredErrorMsg: '请选择文件',
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
        }

        if (context.mode === 'Add' || context.mode === 'Edit' || context.mode === 'Adjust') {
            return this.parseVnodeForEdit(vnode, parentVnode, context)
        } else {
            return this.parseVnodeForView(vnode, parentVnode, context)
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
        return `<sapi-upload 
                ${listenersStr} 
                ${vnode.attrs.type ? `type="${vnode.attrs.type}"` : ''} 
                ${vnode.attrs.size ? `size="${vnode.attrs.size}"` : ''} 
                ${vnode.attrs.count ? `count="${vnode.attrs.count}"` : ''}
                ${vnode.attrs.hasUser ? `has-user` : ':has-user="false"'}
                ${vnode.attrs.hasSize ? `has-size` : ':has-size="false"'}
                ${vnode.attrs.hasDate ? `has-date` : ':has-date="false"'}
                ${vnode.attrs.hasLoad ? `has-load` : ':has-load="false"'}
                ${vnode.attrs.hasPreview ? `has-preview` : ':has-preview="false"'}
                ${vnode.attrs.previewExtend ? `:preview-extend="${vnode.attrs.previewExtend}"` : ''}
                ${vnode.attrs.downloadExtend ? `:download-extend="${vnode.attrs.downloadExtend}"` : ''}
                ${vnode.attrs.uploadExtend ? `:upload-extend="${vnode.attrs.uploadExtend}"` : ''}
                ${vnode.attrs['readonly-expression'] ? `:readonly="${vnode.attrs['readonly-expression']}"` : (vnode.attrs.readonly ? 'readonly' : '')}
                ${vnode.attrs['placeholder-expression'] ? `:placeholder="${vnode.attrs['placeholder-expression']}"` : (vnode.attrs.placeholder ? `placeholder="${vnode.attrs.placeholder}"` : '')}
                v-model="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? ('.' + vnode.subFieldId) : ''}">
            </sapi-upload>`
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
        return `<sapi-upload 
            ${vnode.attrs.type ? `type="${vnode.attrs.type}"` : ''} 
            ${vnode.attrs.size ? `size="${vnode.attrs.size}"` : ''} 
            ${vnode.attrs.count ? `count="${vnode.attrs.count}"` : ''}
            ${vnode.attrs.hasUser ? `has-user` : ':has-user="false"'}
            ${vnode.attrs.hasSize ? `has-size` : ':has-size="false"'}
            ${vnode.attrs.hasDate ? `has-date` : ':has-date="false"'}
            ${vnode.attrs.hasLoad ? `has-load` : ':has-load="false"'}
            ${vnode.attrs.hasPreview ? `has-preview` : ':has-preview="false"'}
            ${vnode.attrs.previewExtend ? `:preview-extend="${vnode.attrs.previewExtend}"` : ''}
            readonly
            v-model="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? ('.' + vnode.subFieldId) : ''}">
        </sapi-upload>`
    }
}

Type.detail = {
    create (opts, parentVnode, context) {
        const defaultOpts = {
            guid: 'upload_' + Vue.$utils.guid(),
            type: 'upload',
            model: '',
            // 绑定字段
            fieldId: null,
            // 文本
            label: '附件',
            attrs: {
                size: '',
                count: '',
                type: '',
                readonly: false
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
