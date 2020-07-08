import Base from './base.js'
import Config from '../../config.js'
const Type = Object.create(Base)

Type['online-form'] = {
    create (opts, parentVnode, context) {
        if (parentVnode && parentVnode.type === 'detail') {
            return Type.detail.create(opts, parentVnode, context)
        }

        const defaultOpts = {
            guid: 'imgsUpload_' + Vue.$utils.guid(),
            type: 'imgsUpload',
            model: '',
            // 绑定字段
            fieldId: null,
            subFieldId: null,
            // 文本
            label: '图片上传',
            attrs: {
                width: 148,
                height: 148,
                isShowFileName: true,
                limit: null,
                apiUrlDefault: true,  //是否选默认apiUrl
                apiUrl: '',
                urlDefault: true,   //是否选默认url
                url: '',
                isCustomFormat: false,
                rules: [1, 2, 3],  //上传规则
                customRules: '',   //自定义上传规则
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
    },
    parseVnode (vnode, parentVnode, context) {
        // 新增、修改、查看共用一个vue选项
        if (!context.locked) {
            this.parseRules(vnode, parentVnode, context)
            // 添加项目的的方法
            this.addMethod(vnode, parentVnode, context)
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
        }
    },
    parseVnodeForEdit (vnode, parentVnode, context) {
        return `<sapi-imgs-upload 
                v-model="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? '.' + vnode.subFieldId : ''}"
                ${vnode.attrs.width && vnode.attrs.width != 148 ? `width="${vnode.attrs.height}px"` : ''}
                ${vnode.attrs.height && vnode.attrs.height != 148 ? `height="${vnode.attrs.height}px"` : ''}
                ${!vnode.attrs.isShowFileName ? `:isShowFileName="${vnode.attrs.isShowFileName}"` : ''}
                ${vnode.attrs.limit ? `:limit="${vnode.attrs.limit}"` : ''}
                ${!vnode.attrs.apiUrlDefault ? `apiUrl="${vnode.attrs.apiUrl}"` : ''}
                ${!vnode.attrs.urlDefault ? `url="${vnode.attrs.url}"` : ''}
                ${vnode.attrs.readonly ? `:readonly="${vnode.attrs.readonly}"` : ''}
                :validate-update="validateImage"
            ></sapi-imgs-upload>`
    },
    parseVnodeForView (vnode, parentVnode, context) {
        return `<sapi-imgs-upload 
            v-model="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? '.' + vnode.subFieldId : ''}"
            ${vnode.attrs.width && vnode.attrs.width != 148 ? `width="${vnode.attrs.height}px"` : ''}
            ${vnode.attrs.height && vnode.attrs.height != 148 ? `height="${vnode.attrs.height}px"` : ''}
            ${!vnode.attrs.isShowFileName ? `:isShowFileName="${vnode.attrs.isShowFileName}"` : ''}
            ${vnode.attrs.limit ? `:limit="${vnode.attrs.limit}"` : ''}
            ${!vnode.attrs.apiUrlDefault ? `apiUrl="${vnode.attrs.apiUrl}"` : ''}
            ${!vnode.attrs.urlDefault ? `url="${vnode.attrs.url}"` : ''}
            readonly
        ></sapi-imgs-upload>`
    },
    addMethod (vnode, parentVnode, context) {
        // validateImage
        let validateImage = null
        if (!vnode.attrs.isCustomFormat) {
            validateImage = `
                const isJPGOrPng = file.type && (file.type.toLowerCase() === 'image/jpeg' ||
                    file.type.toLowerCase() === 'image/jpg' || file.type.toLowerCase() === 'image/png')
                const isLt500 = file.size / (1024 * 1024) <= 10`
            if (vnode.attrs.rules.indexOf(1)>-1) {
                validateImage += `
                    if (!file.size) {
                        Vue.msg('不能上传空文件')
                        return false
                    }
                `
            }
            if (vnode.attrs.rules.indexOf(2)>-1) {
                validateImage += `
                    if (!isJPGOrPng) {
                        Vue.msg('上传图片只能是 JPG/JGEG/PNG 格式')
                        return false
                    }
                `
            } 
            if (vnode.attrs.rules.indexOf(3)>-1) {
                validateImage += `
                    if (!isLt500) {
                        Vue.msg('上传图片大小不能超过 10M')
                        return false
                    }
                `
            }
            validateImage += `
                return true
            `
        } else if (vnode.attrs.isCustomFormat && vnode.attrs.customRules) {
            validateImage = this.vnode.attrs.customRules
        }
        context.methods.validateImage = {name: 'validateImage', content: validateImage, args: 'file' }
    }
}

Type.detail = {
    create (opts, parentVnode, context) {
        const defaultOpts = {
            guid: 'imgsUpload_' + Vue.$utils.guid(),
            type: 'imgsUpload',
            model: '',
            // 绑定字段
            fieldId: null,
            // 文本
            label: '图片上传',
            attrs: {
                width: 148,
                height: 148,
                isShowFileName: true,
                limit: null,
                apiUrlDefault: true,  //是否选默认apiUrl
                apiUrl: '',
                urlDefault: true,   //是否选默认url
                url: '',
                isCustomFormat: false,
                rules: [],  //上传规则
                customRules: '',   //自定义上传规则
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
