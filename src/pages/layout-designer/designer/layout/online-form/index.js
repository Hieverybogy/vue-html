import Preview from './preview.vue'
import Types from './types.js'
import { stringifyJs } from '../../components/stringify-js'
const PreviewExtend = Vue.extend(Preview)

function Layout(opts, vm, complete) {
    opts = opts || {}
    this.opts = opts
    this.Types = Types
    this.layout = 'online-form'
    this.modelNo = ''
    this.moduleId = opts.moduleId || ''
    this.ueditor = vm
    this.complete = complete
    this.previewEl = opts.previewEl
    // 默认提交之后不发起流程
    this.isFlowEnabled = false

    this.attrs = this.opts.attrs || this.getInitAttrs()

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
        if (!this.attrs.title) {
            this.ueditor.rightSideTabName = 'pageSetting'
            this.ueditor.$nextTick(function() {
                this.$errorTips('请设置标题', this.$root.layoutAttrsPanel.$refs.pageTitle)
            })
            return
        }

        if (!this.attrs.relateOrderName) {
            this.ueditor.rightSideTabName = 'pageSetting'
            this.ueditor.$nextTick(function() {
                this.$errorTips('请选择关联orderName字段', this.$root.layoutAttrsPanel.$refs.relateOrderName)
            })
            return
        }

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
    getInitAttrs () {
        const attrs = {
            title: this.opts.title || '',
            layout: 'online-form',
            doubleColumns: false,
            dialogOption: {
                width: '1000px',
                top: '25%'
            },
            // 表单提交之后是否发起流程
            isFlowEnabled: this.isFlowEnabled,
            relateOrderName: '',
            // 是否第一次初始化，第一次初始化时可根据后端配置重置
            isInit: true,
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

        // 流程添加调整模式
        if (this.isFlowEnabled) {
            attrs.template.Adjust = ''
        }

        return attrs
    },
    getBlankSlots() {
        const slots = {
            default: {
                visible: true,
                existCollapses: false,
                vnodes: [],
                isClear: true
            },
            footer: {
                Add: [
                    Types['btn'].create({
                        text: '取消',
                        clickEvent: 'close'
                    }),
                    Types['btn'].create({
                        btnType: 'primary',
                        text: '保存',
                        clickEvent: 'postSave',
                        isSubmit: true
                    }),
                    Types['btn'].create({
                        btnType: 'primary',
                        text: '提交',
                        clickEvent: 'postData',
                        isSubmit: true
                    })
                ],
                Edit: [
                    Types['btn'].create({
                        text: '取消',
                        clickEvent: 'close'
                    }),
                    Types['btn'].create({
                        btnType: 'primary',
                        text: '保存',
                        clickEvent: 'putSave',
                        isSubmit: true
                    }),
                    Types['btn'].create({
                        btnType: 'primary',
                        text: '提交',
                        clickEvent: 'putData',
                        isSubmit: true
                    })
                ],
                View: [
                    Types['btn'].create({
                        text: '关闭',
                        clickEvent: 'close'
                    })
                ]
            }
        }

        if (this.isFlowEnabled) {
            slots.footer = {
                Add: [
                    Types['btn'].create({
                        text: '取消',
                        clickEvent: 'close'
                    }),
                    Types['btn'].create({
                        btnType: 'primary',
                        text: '保存',
                        clickEvent: 'saveDraft',
                        isSubmit: true
                    }),
                    Types['btn'].create({
                        btnType: 'primary',
                        text: '提交并审核',
                        clickEvent: 'saveCheck',
                        isSubmit: true
                    })
                ],
                Edit: [
                    Types['btn'].create({
                        text: '取消',
                        clickEvent: 'close'
                    }),
                    Types['btn'].create({
                        btnType: 'primary',
                        text: '保存',
                        clickEvent: 'saveDraft',
                        isSubmit: true
                    }),
                    Types['btn'].create({
                        btnType: 'primary',
                        text: '提交并审核',
                        clickEvent: 'saveCheck',
                        isSubmit: true
                    })
                ],
                Adjust: [
                    Types['btn'].create({
                        text: '取消',
                        clickEvent: 'close'
                    }),
                    Types['btn'].create({
                        btnType: 'primary',
                        text: '提交',
                        clickEvent: 'saveAdjust',
                        isSubmit: true
                    })
                ],
                View: [
                    Types['btn'].create({
                        text: '关闭',
                        clickEvent: 'close'
                    })
                ]
            }
        }

        return slots
    },
    getAttrsData() {
        if (!this.opts.pageId) {
            return
        }
        const _this = this
        this.getFormHistory(function (data) {
            _this.getFormTemplate(data)
        }, function () {
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
                    _this.attrs.isInit = false
                    _this.vm.attrs = attrs
                    _this.ueditor.layoutAttrs = attrs
                    _this.setValidateRules(_this.attrs.slots.default.vnodes || [])
                }
            }

            _this.isFlowEnabled = !!_this.resFormData.isFlowEnabled
            // 根据后端配置动态初始化一些配置：比如，isFlowEnabled=true时，添加“提交并审核”等相关按钮及方法
            if (_this.attrs.isInit) {
                _this.attrs = _this.getInitAttrs()
                _this.attrs.isInit = false
                _this.vm.attrs = _this.attrs
            }

            _this.updateCodeAndTmp()
            typeof _this.complete === 'function' && _this.complete(_this.attrs)
        }, function () {
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
            _this.saveForm(function (data) {
                if (_this.publish) {
                    _this.publishForm(function () {
                        Vue.successMsg('发布成功')
                        typeof callback === 'function' && callback()
                    }, function () {
                        typeof callback === 'function' && callback('error')
                    })
                } else {
                    Vue.successMsg('保存成功')
                    typeof callback === 'function' && callback()
                }
            }, function () {
                typeof callback === 'function' && callback('error')
            })
        })
    },
    saveForm (success, fail) {
        const data = this.getPostData()
        this.ueditor.$post(`${this.ueditor.$formServerUrl}/${this.opts.appCode}/forms/history/template/1`, data, function (data) {
            typeof success === 'function' && success(data)
        }, function() {
            typeof fail === 'function' && fail('error')
        })
    },
    publishForm (success, fail) {
        this.ueditor.$put(`${this.ueditor.$formServerUrl}/${this.opts.appCode}/forms/history/effect/${this.historyId}`, {
            id: this.opts.pageId
        }, function (data) {
            typeof success === 'function' && success(data)
        }, function() {
            typeof fail === 'function' && fail('error')
        })
    },
    clear() {
        this.attrs = this.getInitAttrs()
        this.vm.attrs = this.attrs
        this.ueditor.layoutAttrs = this.attrs
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

        if (!this.attrs) {
            return
        }
        const filesClass = ['Add', 'Edit', 'View']
        // 流程表单时添加调整模板
        if (this.isFlowEnabled) {
            filesClass.push('Adjust')
        }
        // 新增、修改、删除共用同一个context，只不过执行时mode值不同
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
                option: Object,
                value: Boolean,
                usePostNav: Boolean,
                append: Boolean
            },
            data: function () {
                var _this = this
                var getCustomValidator = function (method) {
                    // 接收三个参数：rule, value, callback
                    return function (rule, value, callback) { 
                        _this[method](rule, value, callback)
                    }
                }

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
        const _this = this
        let methodsStr = ''
        const isFlowEnabled = this.isFlowEnabled
        const redirectToFlowStr = isFlowEnabled ? `
            if (_this.isSendCheck) {
                _this.redirectToFlowStart(res.data, 'post')
                return
            }` : ''
        const flowMethods = isFlowEnabled ? {
            saveDraft () {
                return {
                    name: 'saveDraft',
                    args: [],
                    content: `
                        this.model.status = 1
                        this.mode === 'Add' ? this.postSave() : this.putSave()
                    `
                }
            },
            saveCheck () {
                return {
                    name: 'saveCheck',
                    args: [],
                    content: `
                        this.model.status = 1
                        this.isSendCheck = true
                        this.mode === 'Add' ? this.postData() : this.putData()
                    `
                }
            },
            saveAdjust (ctx) {
                return {
                    name: 'saveAdjust',
                    args: [],
                    content: `
                        var _this = this
                        this.$refs.form.validate(function (valid) {
                            if (valid) {
                                if (_this.disabled) {
                                    return   
                                }
                                _this.disabled = true
                                var postData = {}
                                postData = JSON.parse(JSON.stringify(_this.model))

                                _this.$put(_this.$formServerUrl + '/' + _this.appCode + '/' + _this.formId + '/values/adjust', postData, function (res) {
                                    _this.disabled = false
                                    Vue.successMsg('调整成功!', {
                                        callback: function () {
                                            if (_this.$utils.isFunction(_this.saveCallback)) {
                                                _this.saveCallback(res, 'adjust')
                                            } else {
                                                _this.close()
                                            }
                                        }
                                    })
            
                                    if (_this.append) {
                                        _this.$broadcastAsyncTab('refresh-page-table', '${ctx.modelNo}')
                                    }
                                }, function () {
                                    _this.disabled = false
                                })
                            }
                        })
                    `
                }
            },
            publish () {
                return {
                    name: 'publish',
                    args: [],
                    content: `
                        this.model.status = 4
                        this.mode === 'Add' ? this.postData() : this.putData()
                    `
                }
            },
            redirectToFlowStart () {
                return {
                    name: 'redirectToFlowStart',
                    args: ['res', 'type'],
                    content: `
                        var toUrl = '/flow/panel.html#/formSet/flowStart?embed=true&nav=true&formId=' + res.flowFormId + '&moduleId=' + res.flowModuleCode + '&orderId=' +
                            res.orderId + '&orderName=${_this.attrs.relateOrderName ? `' + this.model.${_this.attrs.relateOrderName} + '` : ''}&orderNo='

                        var url = this.$webConfig.flowUrl + '/sso.html?SysCode=' + this.$webConfig.client + '&AccessToken=' + this.$getToken() + '&ToUrl=' + encodeURIComponent(toUrl)

                        this.$utils.innerReplace(url)
                    `
                }
            }
        } : {}

        const methodsDD = {
            ...context.methods,
            open(ctx) {
                return {
                    name: 'open',
                    args: [],
                    content: `
                        if (this.mode === 'Edit' || this.mode === 'View' || this.mode === 'Adjust') {
                            this.getData()
                        }`
                }
            },
            close () {
                return {
                    name: 'close',
                    args: [],
                    content: `
                        if (this.append) {
                            this.$closeWindow()
                        } else {
                            this.$emit('input', false)
                        }
                    `
                }
            },
            getData (ctx) {
                // GET /{version}/{appcode}/{formId}/Values/primaryKey
                let str = `
                    var _this = this
                    var pksJson = {}
                    pksJson = {}
                    this.primaryKeys.forEach(function (k) {
                        pksJson[k] = _this.$route.query[k] || ''
                    })
                    this.$get(this.$formServerUrl + '/' + this.appCode + '/' + this.formId + '/values', { jsonBizId: JSON.stringify(pksJson) }, function (res) {
                        _this.resData = res
                        let model = _this.model
                        for (let key in model) {
                            model[key] = _this.resData[key]
                        }

                        _this.getDataSuccessQueue.forEach(function (fn) {
                            if (_this.$utils.isFunction(fn)) {
                                fn.apply(_this)
                            }
                        })
                        `

                if (ctx.data.dealData) {
                    str += ctx.data.dealData
                }

                str += `
                    })`

                return {
                    name: 'getData',
                    args: [],
                    content: str
                }
            },
            postData (ctx) {
                // POST /{version}/{appcode}/{formId}/Values
                let str = `
                    var _this = this
                    this.$refs.form.validate(function (valid) {
                        if (valid) {
                            _this.postSave()
                        }
                    })`

                return {
                    name: 'postData',
                    args: [],
                    content: str
                }
            },
            postSave (ctx) {
                const str = `
                    var _this = this
                    if (this.disabled) {
                        return       
                    }
                    this.disabled = true
                    var postData = {}
                    postData = JSON.parse(JSON.stringify(this.model))
                    this.primaryKeys.forEach(function (key) {
                        delete postData[key]
                    })
                    
                    this.$post(_this.$formServerUrl + '/' + this.appCode + '/' + this.formId + '/values', postData, function (res) {
                        _this.disabled = false
                        Vue.successMsg('新增成功!', {
                            callback: function () {
                                if (_this.$utils.isFunction(_this.saveCallback)) {
                                    _this.saveCallback(res, 'post')
                                } else {
                                    ${redirectToFlowStr}
                                    _this.close()
                                }
                            }
                        })

                        if (_this.append) {
                            _this.$broadcastAsyncTab('refresh-page-table', '${ctx.modelNo}')
                        }
                    }, function () {
                        _this.disabled = false
                        ${_this.isFlowEnabled ? '_this.isSendCheck = false' : ''}
                    })
                `
                return {
                    name: 'postSave',
                    args: [],
                    content: str
                }
            },
            putData (ctx) {
                // PUT /{version}/{appcode}/{formId}/Values
                let str = `
                    var _this = this
                    this.$refs.form.validate(function (valid) {
                        if (valid) {
                            _this.putSave()
                        }
                    })`

                return {
                    name: 'putData',
                    args: [],
                    content: str
                }
            },
            putSave (ctx) {
                const str = `
                    var _this = this
                    if (this.disabled) {
                        return       
                    }
                    this.disabled = true
                    var postData = {}
                    postData = JSON.parse(JSON.stringify(this.model))
                    this.$put(_this.$formServerUrl + '/' + this.appCode + '/' + this.formId + '/values', postData, function (res) {
                        _this.disabled = false
                        Vue.successMsg('修改成功!', {
                            callback: function () {
                                if (_this.$utils.isFunction(_this.saveCallback)) {
                                    _this.saveCallback(res, 'put')
                                } else {
                                    ${redirectToFlowStr}
                                    _this.close()
                                }
                            }
                        })

                        if (_this.append) {
                            _this.$broadcastAsyncTab('refresh-page-table', '${ctx.modelNo}')
                        }
                    }, function () {
                        _this.disabled = false
                        ${_this.isFlowEnabled ? '_this.isSendCheck = false' : ''}
                    })
                `
                return {
                    name: 'putSave',
                    args: [],
                    content: str
                }
            },
            ...flowMethods
        }

        this.parseDefaultValue(context, methodsDD)

        for (let method in methodsDD) {
            let fnConf = methodsDD[method]
            if (Vue.$utils.isFunction(fnConf)) {
                fnConf = fnConf(context)
            }

            if (!fnConf.hasOwnProperty('name') || !fnConf.hasOwnProperty('content')) {
                continue
            }

            methodsStr += `${fnConf.name}: function (${Vue.$utils.isArray(fnConf.args) ? fnConf.args.join(', ') : (fnConf.args || '')}) {
                ${fnConf.content || ''}
            },`
        }

        return methodsStr
    },
    parseDefaultValue (context, methodsDD) {
        let str = ''
        const collection = context.data.defaultValueCollection
        if (!collection) {
            return
        }

        if (collection.hasOwnProperty('loginInfo')) {
            str += `
                var loginInfo = this.$utils.localStorage.get('basicInfo')
                try {
                    loginInfo = JSON.parse(loginInfo)
                }
                catch (err) {
                    loginInfo = null
                }
                if (loginInfo) {
                    ${collection.loginInfo.join('\n')}
                }
            `
        }

        if (collection.hasOwnProperty('now')) {
            str += `
                ${collection.now.join('\n')}
            `
        }

        if (collection.hasOwnProperty('const')) {
            str += `
                ${collection.const.join('\n')}
            `
        }

        methodsDD['initDefaultValue'] = {
            name: 'initDefaultValue',
            args: [],
            content: `
                if (this.mode === 'Add') {
                    ${str}
                }`
        }
        context.created += `
            this.initDefaultValue()
        `

        delete context.data.defaultValueCollection
    },
    parseContentData (context) {
        delete context.data.dateFields

        return stringifyJs(context.data, function (key, value, quateConf, pathChain) {
            // rules下validator重写
            if (key === 'validator' && pathChain.indexOf('rules.') > -1 &&
                value.hasOwnProperty('name') && value.hasOwnProperty('content')) {
                quateConf.useQuate = false
                // 立即执行
                if (value.execution) {
                    return `${value.executionContext ? `${value.executionContext}.` : ''}${value.name}('${Vue.$utils.isArray(value.args) ? value.args.join(', ') : (value.args || '')}')`
                } else {
                    return `function ${value.name} ('${Vue.$utils.isArray(value.args) ? value.args.join(', ') : (value.args || '')}') {
                        ${value.content}
                    }`
                }
            }

            return value;
        })
    },
    parseContentCreated (context) {
        let str = `
            var title = '${this.attrs.title}'
            var titleDD = {
                'Add': '新增',
                'Edit': '修改',
                ${this.attrs.isFlowEnabled ? `'Adjust': '调整',` : ''}
                'View': '查看'
            }
            this.mode = this.$utils.capitalize(this.$route.query.mode || 'Add')
            this.title = titleDD[this.mode] + title
            this.$setTitle(this.title)
            this.appCode = this.$route.query.appCode
            this.formId = this.$route.params.formId
            ${this.attrs.isFlowEnabled ? 'this.isSendCheck = false' : ''}
            this.primaryKeys = ['${this.ueditor.primaryKeys.join('\', \'')}']
            this.masterTableCode = '${this.ueditor.masterTableCode}'
            this.visible = this.value
            this.getDataSuccessQueue = []
        `

        if (context.created) {
            str += context.created
        }

        return str
    },
    parseContentWatch (context) {
        const watchs = [
            ...context.watch,
            { name: 'value', content: 'this.visible = this.value' }
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

            watchStr += `${fn.name}: function (${fn.args && fn.args.join(', ') || ''}) {
                ${fn.content}
            },`
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
            props: {
                option: 'Object',
                value: 'Boolean',
                usePostNav: 'Boolean',
                append: 'Boolean'
            },
            data: {
                // 挂载绑定的属性
                model: this.ueditor.vmDataModel,
                dateFields: [],
                // 需校验的规则
                rules: {},
                visible: false,
                disabled: false,
                mode: null,
                formId: null
            },
            // 观察方法
            watch: {},
            // 方法: name: {content, args, name}
            methods: {},
            created: '',
            otherTemplate: ''
        }
    },
    // mode: Add、Edit、View、Adjust
    parseFileTemplate (context) {
        const defaultSlotTmp = this.parseDefaultSlot(context)
        const isEdit = context.mode === 'Add' || context.mode === 'Edit' || context.mode === 'Adjust'

        return `
        <sapi-form-panel
            :dialog-options="{
                width: '${this.attrs.dialogOption.width}',
                top: '${this.attrs.dialogOption.top}'
            }"
            :panel-options="{
                usePostNav: usePostNav
            }"
            :dialog="!append"
            v-model="visible" @on-open="open" @on-close="close">
            <template slot="title">
                <span>{{title}}</span>
            </template>

            <sapi-form
                ref="form"
                ${this.attrs.doubleColumns ? ':doubleColumns="true"' : ''}
                ${isEdit ? `:rules="rules" :model="model"` : ''}
                :in-dialog="!append">
                ${defaultSlotTmp}
            </sapi-form>

            <template slot="footer">
                ${this.parseFooterBtns(context)}
            </template>

            ${context.otherTemplate ? `
                <template slot="other">
                    ${context.otherTemplate}
                </template>
                ` : ''}
        </sapi-form-panel>`
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
    parseFooterBtns (context) {
        const mode = context.mode
        const isEdit = mode === 'Add' || mode === 'Edit' || mode === 'Adjust'

        const footerBtns = this.attrs.slots.footer
        if (!footerBtns || !footerBtns[mode]) {
            return `
                <el-button size="small" @click="close">关闭</el-button>
                ${isEdit ? `<el-button type="primary" size="small" :disabled="disabled" @click="${mode === 'Add' ? 'postData' : 'putData'}">提交</el-button>` : ''}
            `
        }

        const btns = footerBtns[mode]
        const html = []
        btns.forEach((btn) => {
            html.push(this.Types['btn'].parseVnode(btn, null, context))
        })

        return html.join('')
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
        const isEditMode = mode === 'Add' || mode === 'Edit' || mode === 'Adjust'

        if (mode === 'Add' && vnode.attrs && vnode.attrs.value) {
            if (vnode.subFieldId) {
                context.data.model[vnode.fieldId][vnode.subFieldId] = vnode.attrs.value
            } else {
                context.data.model[vnode.fieldId] = vnode.attrs.value
            }
        }

        return [`<sapi-form-item 
            ${vnode.attrs['v-if-expression'] ? `v-if="${vnode.attrs['v-if-expression']}"` : ''}
            ${vnode.attrs['label-expression'] ? `:label="${vnode.attrs['label-expression']}"` : `label="${vnode.label}"`}
            ${isEditMode && vnode.required ? `prop="${vnode.fieldId}${vnode.subFieldId ? '.' + vnode.subFieldId : ''}"` : ''}
            ${vnode.alone ? 'alone' : ''}
            ${vnode.labelWidthAuto ? 'label-width="auto"' : ''}
            ${vnode.fullline ? 'full' : ''}>`,
            this.Types[vnode.type].parseVnode(vnode, parentVnode, context),
            '</sapi-form-item>']
    }
}

export default Layout
