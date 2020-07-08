import Preview from './preview.vue'
import Types from './types.js'
const PreviewExtend = Vue.extend(Preview)
import './base.less'

function Layout(opts, vm, complete) {
    opts = opts || {}
    this.opts = opts
    this.Types = Types
    this.layout = 'flow-form'
    this.modelNo = ''
    this.moduleId = opts.moduleId || ''
    this.ueditor = vm
    this.complete = complete
    this.previewEl = opts.previewEl

    this.attrs = this.opts.attrs || {
        title: opts.title || '',
        layout: 'flow-form',
        doubleColumns: false,
        dialogOption: {
            width: '1000px',
            top: '25%'
        },
        slots: this.getBlankSlots(),
        // 可定义的mixin对象
        mixinCode: this.ueditor.defaultMixinCode,
        // 解析后的vue对象
        code: '',
        // 解析后的模板
        template: {
            Add: '',
            Edit: '',
            View: ''
        }
    }

    // 组件配置信息
    this.init()
}

Layout.prototype = {
    init() {
        this.mount(this.previewEl)
        this.getAttrsData()
    },
    mount(el) {
        this.vm = new PreviewExtend({
            propsData: {
                attrs: this.attrs,
                ueditor: this.ueditor,
                value: true,
                append: true
            }
        })
        this.vm.$mount(el)
    },
    validate(callback) {
        // if (!this.attrs.title) {
        //     this.ueditor.rightSideTabName = 'pageSetting'
        //     this.ueditor.$nextTick(function() {
        //         this.$errorTips('请设置标题', this.$root.layoutAttrsPanel.$refs.pageTitle)
        //     })
        //     return
        // }

        if (!this.attrs.slots.default ||
            this.attrs.slots.default.length === 0) {
            Vue.errorMsg('请设置表单内容')
            return
        }

        const _this = this

        this.vm.$nextTick(function() {
            _this.vm.$refs.form.validate((valid) => {
                if (valid) {
                    callback()
                }
            })
        })
    },
    setValidateRules(vnodes) {
        vnodes.forEach((vnode) => {
            this.vm.setRule(vnode)

            if (vnode.vnodes) {
                this.setValidateRules(vnode.vnodes)
            }
        })
    },
    getBlankSlots() {
        return {
            default: {
                visible: true,
                existCollapses: false,
                vnodes: [],
                isClear: true
            }
        }
    },
    getAttrsData() {
        if (!this.opts.pageId) {
            return
        }
        const _this = this
        this.getFormHistory(function (data) {
            _this.getFormTemplate(data)
        }, function () {
            _this.vm.attrs = _this.attrs
            _this.ueditor.layoutAttrs = _this.attrs
            _this.updateCodeAndTmp()
            typeof _this.complete === 'function' && _this.complete(_this.attrs)
        })
    },
    getFormHistory (success, error) {
        if (!this.opts.pageId) {
            return
        }

        // GET /{version}/{appcode}/forms/{formid}/history
        this.ueditor.$get(`${this.ueditor.$formServerUrl}/${this.opts.appCode}/forms/${this.opts.pageId}/history`, function(data) {
            Vue.$utils.isFunction(success) && success(data)
        }, function (data) {
            Vue.$utils.isFunction(error) && error(data)
        })
    },
    getFormTemplate (data) {
        const _this = this
        // type 1:PC;2:App;3:会签
        // GET /{version}/{appcode}/forms/history/{historyid}/template/{type}
        this.historyId = data.id
        this.ueditor.$get(`${this.ueditor.$formServerUrl}/${this.opts.appCode}/forms/history/${this.historyId}/template/1`, function(data) {
            _this.resFormData = data
            if (data.formTemplateHistoryVO) {
                let attrs
                try {
                    attrs = JSON.parse(data.formTemplateHistoryVO.content)
                } catch (err) {
                    attrs = null
                }

                if (attrs && attrs.hasOwnProperty('slots')) {
                    _this.attrs = attrs
                    _this.vm.attrs = attrs
                    _this.ueditor.layoutAttrs = attrs
                    _this.ueditor.addRecord()
                    _this.setValidateRules(_this.attrs.slots.default.vnodes || [])
                }
            }

            typeof _this.complete === 'function' && _this.complete(_this.attrs)
        }, function () {
            _this.vm.attrs = _this.attrs
            _this.ueditor.layoutAttrs = _this.attrs
            _this.updateCodeAndTmp()
            typeof _this.complete === 'function' && _this.complete(_this.attrs)
        })
    },
    save(publish, callback) {
        const _this = this
        this.publish = publish
        this.validate(function() {
            // POST /{version}/{appcode}/forms/history/template/{type}
            // PUT /{version}/{appcode}/forms/history/effect/{id}
            if (_this.publish) {
                _this.ueditor.$put(`${_this.ueditor.$formServerUrl}/${_this.opts.appCode}/forms/history/effect/${_this.historyId}`, {
                    id: _this.opts.pageId
                }, function (data) {
                    Vue.successMsg('发布成功')
                    typeof callback === 'function' && callback()
                }, function() {
                    typeof callback === 'function' && callback('error')
                })
            } else {
                const data = _this.getPostData()
                _this.ueditor.$post(`${_this.ueditor.$formServerUrl}/${_this.opts.appCode}/forms/history/template/1`, data, function (data) {
                    Vue.successMsg('保存成功')
                    typeof callback === 'function' && callback()
                }, function() {
                    typeof callback === 'function' && callback('error')
                })
            }
        })
    },
    clear() {
        this.vm.$set(this.vm.attrs, 'slots', this.getBlankSlots())
        this.ueditor.setActiveVnode(null)
    },
    getPostData() {
        return {
            content: JSON.stringify(this.attrs),
            deviceType: 1,
            formHistoryId: this.historyId,
            formId: this.opts.pageId,
            version: this.resFormData.version,
            formName: this.resFormData.formName
        }
    },
    updateCodeAndTmp() {
        let context = null

        const filesClass = ['View']
        filesClass.forEach((c) => {
            if (!context) {
                context = this.getFileContext(c)
            } else {
                context.mode = c
            }

            this.attrs.template[c] = this.parseFileTemplate(context)
            // rst.context只需解析一次
            if (!context.locked) {
                context.locked = true
            }
        })

        this.attrs.code = this.parseScriptCode(context)
    },
    parseScriptCode(context) {
        const mehtods = this.parseContentMethods(context)
        const data = this.parseContentData(context)
        const created = this.parseContentCreated(context)
        const watch = this.parseContentWatch(context)

        return `
        {
            props: {
                formOption: Object
            },
            data: function () {
                return ${data}
            },
            watch: {
                ${watch}
            },
            methods: {
                ${mehtods}
            },
            created: function () {
                ${created}
            }
        }`
    },
    parseContentMethods(context) {
        let methodsStr = ''
        const methodsDD = {
            ...context.methods,
            open(ctx) {
                return {
                    name: 'open',
                    args: [],
                    content: `
                        let formOption = this.formOption
                        let model = this.model
                        for (let key in model) {
                            if (formOption.hasOwnProperty(key)) {
                                model[key] = formOption[key]
                            }
                        }
                    `
                }
            }
        }

        for (let method in methodsDD) {
            let fnConf = methodsDD[method]
            if (Vue.$utils.isFunction(fnConf)) {
                fnConf = fnConf(context)
            }

            if (!fnConf.hasOwnProperty('name') || !fnConf.hasOwnProperty('content')) {
                continue
            }

            methodsStr += `${fnConf.name}: function (${fnConf.args && fnConf.args.join(', ') || ''}) {
                ${fnConf.content || ''}
            },`
        }

        return methodsStr
    },
    parseContentData (context) {
        delete context.data.dateFields
        delete context.data.dealData
        return JSON.stringify(context.data)
    },
    parseContentCreated (context) {
        let str = ''

        if (context.created) {
            str += context.created
        }

        return str
    },
    parseContentWatch (context) {
        const watchs = [
            ...context.watch,
            { name: 'formOption', option: ['immediate', 'deep'], content: `this.open()` },
            { name: 'model', option: ['immediate', 'deep'], content: `this.open()` }
        ]
        let watchStr = ''

        for (let method in watchs) {
            let fn = watchs[method]
            if (Vue.$utils.isFunction(fn)) {
                fn = fn(context)
            }

            if (!fn.hasOwnProperty('name') || !fn.hasOwnProperty('content')) {
                continue
            }

            if (fn.hasOwnProperty('option') && fn.option.length>0) {
                watchStr += `${fn.name}: {
                    handler(val, oldVal) {
                        ${fn.content}
                    },
                    ${fn.option.indexOf('immediate') > -1 ? 'immediate: true,' : ''}
                    ${fn.option.indexOf('deep') > -1 ? 'deep: true' : ''}
                },`
            } else {
                watchStr += `${fn.name}: function (${fn.args && fn.args.join(', ') || ''}) {
                    ${fn.content}
                },`
            }
        }

        return watchStr
    },
    // 解析保存过程中的依赖
    getFileContext (mode) {
        return {
            // context是否锁定
            locked: false,
            mode: mode,
            modelNo: this.modelNo,
            preview: this,
            components: {},
            mixins: {},
            template: '',
            props: {},
            data: {
                // 挂载绑定的属性
                model: this.ueditor.vmDataModel,
                dateFields: [],
                // 需校验的规则
                rules: {}
            },
            // 观察方法
            watch: {},
            // 方法: name: {content, args, name}
            methods: {}
        }
    },
    // mode: View
    parseFileTemplate (context) {
        const defaultSlotTmp = this.parseDefaultSlot(context)
        let title = this.attrs.title ? `<div style="padding: 15px 36px;color: #3D3F4B;font-size: 24px;border-bottom: 1px solid #DCDFE6;">${this.attrs.title}</div>` : '<div></div>'

        return `
            <div>
                ${title}
                <sapi-form
                    style="margin-top: 0;padding: 0"
                    ref="form"
                    label-width="120px">
                    ${defaultSlotTmp}
                </sapi-form>
            </div>
            `
    },
    parseDefaultSlot (context) {
        const defObj = this.attrs.slots.default
        let tmpArr
        if (defObj.existCollapses) {
            tmpArr = [['<sapi-form-collapses>'], this.parseVnodes(defObj.vnodes, null, context), ['</sapi-form-collapses>']]
        } else {
            tmpArr = this.parseVnodes(defObj.vnodes, null, context)
        }

        const tmpStrArr = []
        this.getTmpString(tmpArr, tmpStrArr)

        return tmpStrArr.join('')
    },
    getTmpString (tmpArr, tmpStrArr) {
        tmpArr.forEach((tmp) => {
            if (Vue.$utils.isArray(tmp)) {
                this.getTmpString(tmp, tmpStrArr)
            } else {
                tmpStrArr.push(tmp)
            }
        })
    },
    parseVnodes (vnodes, parentVnode, context) {
        if (!vnodes || vnodes.length === 0) {
            return []
        }

        var tmps = []
        vnodes.forEach((vnode) => {
            tmps.push(this.parseVnode(vnode, parentVnode, context))
        })

        return tmps
    },
    parseVnode (vnode, parentVnode, context) {
        if (this.Types[vnode.type]) {
            if (this.Types[vnode.type].category === 'base' ||
                this.Types[vnode.type].category === 'enhance') {
                return this.parseBaseVnode(vnode, parentVnode, context)
            } else {
                return this.Types[vnode.type].parseVnode(vnode, parentVnode, context)
            }
        } else {
            throw new Error(`不存在自定义的${vnode.type}类型`)
        }
    },
    parseBaseVnode (vnode, parentVnode, context) {
        const mode = context.mode

        return [`<sapi-form-item 
            ${vnode.attrs['v-if-expression'] ? `v-if="${vnode.attrs['v-if-expression']}"` : ''}
            ${vnode.attrs['label-expression'] ? `:label="${vnode.attrs['label-expression']}"` : `label="${vnode.label}"`}
            ${vnode.alone ? ':alone="true"' : ''}
            ${vnode.fullline ? ':full="true"' : ''}>`,
            this.Types[vnode.type].parseVnode(vnode, parentVnode, context),
            '</sapi-form-item>']
    }
}

export default Layout
