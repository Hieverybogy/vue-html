import Types from './types.js'
import typeBase from '../../types/base'
import Preview from './preview.vue'
import { stringifyJs } from '../../components/stringify-js'
const PreviewExtend = Vue.extend(Preview)

function ListLayout(opts, vm, complete) {
    opts = opts || {}
    this.opts = opts
    this.Types = Types
    this.layout = 'online-list'
    this.moduleId = opts.moduleId || ''
    this.modelNo = ''
    this.ueditor = vm
    this.complete = complete
    this.previewEl = opts.previewEl
    // 默认提交之后不发起流程
    this.isFlowEnabled = false
    this.attrs = opts.attrs || this.getInitAttrs()

    this.init()
}

ListLayout.prototype = {
    init() {
        this.mount(this.previewEl)
        this.getAttrsData()
    },
    getInitAttrs () {
        return {
            title: '',
            pageDesc: '',
            layout: 'online-list',
            // 是否第一次初始化，第一次初始化时可根据后端配置重置
            isInit: true,
            // 表单提交之后是否发起流程
            isFlowEnabled: this.isFlowEnabled,
            relativeFormId: '',
            slots: this.getBlankSlots(),
            // 可定义的mixin对象
            mixinCode: this.ueditor.defaultMixinCode,
            // 解析后的vue对象
            code: '',
            // 解析后的模板
            template: ''
        }
    },
    mount(el) {
        const _this = this
        this.vm = new PreviewExtend({
            propsData: {
                attrs: this.attrs,
                ueditor: this.ueditor,
                postData: function() {
                    _this.postData()
                }
            }
        })
        this.vm.$mount(el)
    },
    clear() {
        this.vm.$set(this.vm.attrs, 'slots', this.getBlankSlots())
        this.ueditor.setActiveVnode(null)
    },
    getBlankSlots() {
        return {
            filters: {
                visible: true,
                vnodes: [{
                    guid: Vue.$utils.guid(),
                    type: 'keyword',
                    model: 'params',
                    // 绑定字段
                    fieldId: 'searchValue',
                    // 文本
                    label: '关键字',
                    attrs: {
                        value: '',
                        placeholder: '请输入关键字查询',
                        maxlength: '100'
                    }
                }]
            },
            moreFilters: {
                visible: false,
                vnodes: []
            },
            btns: {
                visible: true,
                vnodes: [
                    Types['btn'].create({
                        text: '新增',
                        clickEvent: 'close',
                        btnType: 'primary',
                        'v-if-expression': 'permissions.ADD',
                        usage: 'openPage',
                        openUrl: '/online.html#/form/{formId}?embed=true&nav=true&mode=Add',
                        openWay: '_blank',
                        openUrlParams: [
                            { paramId: 'formId', paramType: 'path', paramValueSource: 'dataProp', paramValue: 'relativeFormId' },
                            { paramId: 'appCode', paramType: 'query', paramValueSource: 'urlParam', paramValue: 'appCode' }
                        ]
                    }),
                    {
                        type: 'import',
                        text: '导入',
                        useable: false,
                        templateSource: 'custom',
                        customTemplateServer: '',
                        customTemplateUrl: '',
                        customTemplateParams: [],
                        templateApiServer: 'sysServer',
                        templateApi: '/docs/file',
                        templateApiParams: [
                            { paramId: 'indexid', paramType: 'query', paramValueSource: 'const', paramValue: '' },
                            { paramId: 'code', paramType: 'query', paramValueSource: 'const', paramValue: '' }
                        ],
                        uploadId: '',
                        'v-if-expression': 'permissions.IMPORT',
                        title: '',
                        importServer: '',
                        importApi: '',
                        importApiContentType: 'json',
                        importApiParams: [],
                        importSuccess: 'loadData'
                    },
                    {
                        type: 'export',
                        text: '导出',
                        useable: false,
                        exportWay: 'dialog',
                        'v-if-expression': 'permissions.EXPORT',
                        title: '',
                        server: '',
                        api: '',
                        apiParams: []
                    }
                ],
                // 自定义操作按钮
                customVnodes: []
            },
            table: {
                visible: true,
                vnode: this.Types['listTable']['online-list'].create(null, null, null, this.ueditor, this)
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
        this.ueditor.$get(`${this.ueditor.$formServerUrl}/${this.opts.appCode}/forms/history/${this.historyId}/template/2`, function(data) {
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
                    _this.setValidateRules()
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
    setValidateRules() {
        this.vm.setTableRule()
        const vnodes = this.vm.attrs.slots.filters.vnodes
        vnodes.forEach((vnode) => {
            this.vm.setRule(vnode)
        })
    },
    save(publish, callback) {
        this.publish = publish
        this.callback = callback
        this.validate()
    },
    postData () {
        const _this = this
        // POST /{version}/{appcode}/forms/history/template/{type}
        // PUT /{version}/{appcode}/forms/history/effect/{id}
        this.saveForm(function () {
            if (_this.publish) {
                _this.publishForm(function () {
                    Vue.successMsg('发布成功')
                    typeof _this.callback === 'function' && _this.callback()
                }, function () {
                    _this.vm.listTableValid = false
                    _this.vm.listTableValidSuccess = false
                    _this.vm.filtersValid = false
                    typeof _this.callback === 'function' && _this.callback('error')
                })
            } else {
                Vue.successMsg('保存成功')
                typeof _this.callback === 'function' && _this.callback()
            }
        }, function () {
            _this.vm.listTableValid = false
            _this.vm.listTableValidSuccess = false
            _this.vm.filtersValid = false
            typeof _this.callback === 'function' && _this.callback('error')
        })
    },
    saveForm (success, fail) {
        const data = this.getPostData()
        this.ueditor.$post(`${this.ueditor.$formServerUrl}/${this.opts.appCode}/forms/history/template/2`, data, function (data) {
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
    getPostData() {
        return {
            content: JSON.stringify(this.attrs),
            deviceType: 2,
            formHistoryId: this.historyId,
            formId: this.opts.pageId,
            version: this.resFormData.version,
            formName: this.resFormData.formName
        }
    },
    updateCodeAndTmp() {
        const context = this.getFileContext()
        this.attrs.template = this.parseFileTemplate(context)
        this.attrs.code = this.parseScriptCode(context)
    },
    parseScriptCode (context) {
        const methods = this.parseContentMethods(context)
        const data = this.parseContentData(context)
        const created = this.parseContentCreated(context)
        const watch = this.parseContentWatch(context)
        const computed = this.parseContentComputed(context)

        return `{
            data: function () {
                return ${data}
            },
            ${computed ? `
            computed: {
                ${computed}
            },
            ` : ''}
            watch: {
                ${watch}
            },
            methods: {
                ${methods}
            },
            created: function () {
                ${created}
            }
        }
        `
    },
    validate() {
        let valid = true
        if (!this.attrs.title) {
            this.ueditor.rightSideTabName = 'pageSetting'
            this.ueditor.$nextTick(function() {
                this.$errorTips('请设置标题', this.$root.layoutAttrsPanel.$refs.pageTitle)
            })

            valid && (valid = false)
        }

        if (!this.validateBtns()) {
            valid && (valid = false)
        }

        const _this = this
        this.vm.pageValid = valid
        this.vm.$nextTick(function() {
            _this.vm.$refs.listTableForm.validate((valid) => {
                _this.vm.listTableValid = valid
                _this.vm.listTableValidSuccess = valid
            })

            _this.vm.$refs.filtersForm.validate((valid) => {
                _this.vm.filtersValid = valid
            })
        })
    },
    validateBtns() {
        if (!this.attrs.slots.btns.visible) {
            return true
        }

        const btns = this.attrs.slots.btns.vnodes

        for (let i = 0, len = btns.length; i < len; i++) {
            // if (btns[i].type === 'import') {
            //     if (!btns[i].template) {
            //         this.ueditor.rightSideTabName = 'pageSetting'
            //         this.ueditor.$nextTick(function() {
            //             this.$errorTips('请配置导入模板', this.$root.layoutAttrsPanel.$refs.importTemplate)
            //         })

            //         return false
            //     }

            //     if (!btns[i].api) {
            //         this.ueditor.rightSideTabName = 'pageSetting'
            //         this.ueditor.$nextTick(function() {
            //             this.$errorTips('请配置导入api', this.$root.layoutAttrsPanel.$refs.importApi)
            //         })

            //         return false
            //     }
            // }

            // if (btns[i].type === 'export' && !btns[i].api) {
            //     this.ueditor.rightSideTabName = 'pageSetting'
            //     this.ueditor.$nextTick(function() {
            //         this.$errorTips('请配置导出api', this.$root.layoutAttrsPanel.$refs.exportApi)
            //     })

            //     return false
            // }
        }

        return true
    },
    getFileContext() {
        return {
            preview: this,
            mixins: {},
            template: '',
            data: {
                dateFields: []
            },
            methods: {},
            computed: {},
            otherTemplate: '',
            created: ''
        }
    },
    parseFileTemplate(context) {
        const filters = this.parseFilters(context)
        const moreFilters = this.parseMoreFilters(context)
        const btns = this.parseOperationBtns(context)
        const listTable = this.parseListTable(context)

        return `<sapi-list-layout>
            ${filters ? `
            <template slot="filters">
                ${filters}
            </template>
            ` : ''}
            
            ${moreFilters ? `
            <template slot="filters-more">
                ${moreFilters}
            </template>
            ` : ''}

            ${btns ? `
            <template slot="btns">
                ${btns}
            </template>
            ` : ''}

            <template slot="table">
                ${listTable}
            </template>

            <template slot="pagination">
                <el-pagination @size-change="pageSizeChange" 
                    @current-change="pageCurrentChange" :current-page="params.pageIndex" 
                    :page-sizes="pageArr" :page-size="params.pageSize" 
                    :layout="layout" :total="pageTotal">
                </el-pagination>
            </template>

            ${context.otherTemplate ? `
                <template slot="other">
                    ${context.otherTemplate}
                </template>
                ` : ''}
        </sapi-list-layout>`
    },
    parseFilters(context) {
        if (!this.attrs.slots.filters.visible) {
            return ''
        }
        const filters = this.attrs.slots.filters.vnodes
        const htmls = []

        this.parseFilterChangeMethod(context)

        filters.forEach((vnode) => {
            if (!context.data[vnode.model]) {
                context.data[vnode.model] = {}
            }

            if (!vnode.isNoNeedFieldId) {
                context.data[vnode.model][vnode.fieldId] = null
            }

            if (this.Types[vnode.type] &&
                typeof this.Types[vnode.type].parseVnode === 'function') {
                htmls.push(`<sapi-filter-item label="${vnode.label}">
                    ${this.Types[vnode.type].parseVnode(vnode, null, context)}
                    </sapi-filter-item>`)
            } else {
                throw new Error(`未找到${vnode.type}类型组件的解析方法`)
            }
        })

        return htmls.join('')
    },
    parseFilterChangeMethod (context) {
        if (context.methods['filterChange']) {
            return
        }
        context.methods['filterChange'] = {
            name: 'filterChange',
            content: `this.params.pageIndex = 1
            if (typeof this.pageFunc === 'function') {
                this.pageFunc()
            }`
        }
    },
    parseMoreFilters (context) {
        if (!this.attrs.slots.moreFilters.visible) {
            return ''
        }

        const moreFilters = this.attrs.slots.moreFilters.vnodes
        const htmls = []

        this.parseFilterChangeMethod(context)

        moreFilters.forEach((vnode) => {
            if (!context.data[vnode.model]) {
                context.data[vnode.model] = {}
            }

            if (!vnode.isNoNeedFieldId) {
                context.data[vnode.model][vnode.fieldId] = null
            }

            if (this.Types[vnode.type] &&
                typeof this.Types[vnode.type].parseVnode === 'function') {
                htmls.push(this.Types[vnode.type].parseVnode(vnode, null, context))
            } else {
                throw new Error(`未找到${vnode.type}类型组件的解析方法`)
            }
        })

        return htmls.join('')
    },
    parseOperationBtns(context) {
        if (!this.attrs.slots.btns.visible) {
            return ''
        }
        const btns = this.attrs.slots.btns.vnodes
        const operates = []

        if (btns && btns.length > 0) {
            btns.forEach((vnode, i) => {
                if (vnode.useable) {
                    switch (vnode.type) {
                        case 'btn':
                        case 'add':
                        case 'custom':
                            operates.push(this.Types['btn'].parseVnode(vnode, null, context))
                            break
                        case 'export':
                            operates.push(this.parseExportBtn(context, vnode, i))
                            break
                        case 'import':
                            operates.push(this.parseImportBtn(context, vnode, i))
                            break
                    }
                }
            })
        }

        return operates.join('')
    },
    parseExportBtn (context, vnode, i) {
        const permission = vnode['v-if-expression'] ? `v-if="${vnode['v-if-expression']}"` : ''
        const { paramsStr, pathStr } = typeBase.parseParamValueSource(vnode.apiParams)
        context.computed.exportUrl = {
            name: 'exportUrl',
            args: '',
            content: `
                var url = this.$${vnode.server}Url + '${vnode.api.indexOf('/') === 0 ? vnode.api : ('/' + vnode.api)}'
                var pathParams = {
                    ${pathStr}
                }
                var params = {
                    ${paramsStr}
                }

                url = this.$utils.replacePathParams(url, pathParams)
                url = this.$utils.setQueryString(params, url)

                return url
            `
        }

        if (vnode.exportWay === 'dialog') {
            context.data['exportVisible'] = false
            context.data['exportView'] = ''
            let clickFn = `@click="exportDialog"`
            context.methods.exportDialog = {
                name: 'exportDialog',
                content: `this.exportVisible = true
                this.exportView = 'sapi-export'`
            }

            context.otherTemplate += `<component :is="exportView" v-model="exportVisible" title="${vnode.title}" :params="params" :export-url="exportUrl">
                </component>`
            return `<el-button size="small" ${permission} ${i === 0 ? 'type="primary"' : ''} ${clickFn}>${vnode.text}</el-button>`
        } else {
            return `<sapi-export-direct
                ${permission}
                :exportUrl="exportUrl"
            >${vnode.text}</sapi-export-direct>`
        }
    },
    parseImportBtn (context, vnode, i) {
        const permission = vnode['v-if-expression'] ? `v-if="${vnode['v-if-expression']}"` : ''
        context.data['importVisible'] = false
        context.data['importView'] = null
        if (vnode.templateSource === 'custom') {
            context.methods.importDialog = {
                name: 'importDialog',
                content: `
                    this.importVisible = true
                    this.importView = 'sapi-import'
                `
            }
            const { paramsStr, pathStr } = typeBase.parseParamValueSource(vnode.customTemplateParams)
            context.computed.importTemplateUrl = {
                name: 'importTemplateUrl',
                args: '',
                content: `
                    var url = this.$${vnode.customTemplateServer}Url + '${vnode.customTemplateUrl.indexOf('/') === 0 ? vnode.customTemplateUrl : ('/' + vnode.customTemplateUrl)}'
                    var pathParams = {
                        ${pathStr}
                    }
                    var params = {
                        ${paramsStr}
                    }
    
                    url = this.$utils.replacePathParams(url, pathParams)
                    url = this.$utils.setQueryString(params, url)
    
                    return url
                `
            }
        } else {
            context.data.importTemplateUrl = ''
            const { paramsStr, pathStr } = typeBase.parseParamValueSource(vnode.templateApiParams)
            context.methods.importDialog = {
                name: 'importDialog',
                content: `
                var url = this.$${vnode.templateApiServer}Url + '${vnode.templateApi.indexOf('/') === 0 ? vnode.templateApi : ('/' + vnode.templateApi)}'
                var pathParams = {
                    ${pathStr}
                }
                var params = {
                    ${paramsStr}
                }

                url = this.$utils.replacePathParams(url, pathParams)
                url = this.$utils.setQueryString(params, url)

                this.$get(url, function(res) {
                    if(res) {
                        this.importTemplateUrl = this.$fileServerUrl + '/file/export/download/' + res.fileList[0].id
                    }
                    this.importVisible = true;
                })
                `
            }
        }

        const { paramsStr, pathStr } = typeBase.parseParamValueSource(vnode.importApiParams)
        context.computed.importUrl = {
            name: 'importUrl',
            args: '',
            content: `
                var url = this.$${vnode.importServer}Url + '${vnode.importApi.indexOf('/') === 0 ? vnode.importApi : ('/' + vnode.importApi)}'
                var pathParams = {
                    ${pathStr}
                }
                var params = {
                    ${paramsStr}
                }

                url = this.$utils.replacePathParams(url, pathParams)
                url = this.$utils.setQueryString(params, url)

                return url
            `
        }

        context.otherTemplate += `
            <component :is="importView" 
                v-model="importVisible" 
                :template-url="importTemplateUrl" 
                title="${vnode.title}" 
                :confirm-api="importUrl"
                content-type="${vnode.importApiContentType}"
                ${vnode.uploadId ? `upload-id="${vnode.uploadId}"` : ''}
                @callback="${vnode.importSuccess}">
            </component>`

        return `<el-button size="small" ${permission} ${i === 0 ? 'type="primary"' : ''} @click="importDialog">${vnode.text}</el-button>`
    },
    parseListTable(context) {
        const vnode = this.attrs.slots.table.vnode
        return this.Types[vnode.type].parseVnode(vnode, null, context)
    },
    parseContentMethods(context) {
        let methodsStr = ''
        const methodsDD = {
            ...context.methods,
            callback: { name: 'callback', content: 'this.loadData()', args: '' }
        }

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
    parseContentData(context) {
        delete context.data.dateFields

        return stringifyJs(context.data)
    },
    parseContentCreated (context) {
        let str = `
            this.formId = '${this.opts.pageId}'
            this.relativeFormId = '${this.attrs.relativeFormId || ''}'
            this.appCode = '${this.opts.appCode}'
            this.pageTableId = '${this.modelNo}'
            this.pageFunc = this.loadData
            this.loadData()
            this.$init()
        `

        if (context.created) {
            str += context.created
        }

        return str
    },
    parseContentWatch (context) {
        const watchs = context.watch
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
    parseContentComputed (context) {
        const keys = Object.keys(context.computed)
        if (keys.length === 0) {
            return ''
        }
        let computedStr = ''

        for (let i = 0, len = keys.length; i < len; i++) {
            let fnConf = context.computed[keys[i]]
            if (!fnConf.hasOwnProperty('name') || !fnConf.hasOwnProperty('content')) {
                continue
            }

            computedStr += `${fnConf.name}: function (${Vue.$utils.isArray(fnConf.args) ? fnConf.args.join(', ') : (fnConf.args || '')}) {
                ${fnConf.content || ''}
            }${i === len - 1 ? '' : ','}`
        }

        return computedStr
    }
}

export default ListLayout
