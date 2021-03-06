import './base.less'
import Types from './types.js'
import Config from '../../config.js'
import Preview from './preview.vue'
const PreviewExtend = Vue.extend(Preview)
import HtmlFormat from '../../components/htmlFormat.js'
import StruTree from '../../types/stru-tree/tree-list.js'

function TreeListLayout (opts = {}, vm, complete) {
    this.opts = opts
    this.Types = Types
    this.layout = 'tree-list'
    this.moduleId = opts.moduleId || ''
    this.modelNo = ''
    this.ueditor = vm
    this.complete = complete
    this.previewEl = opts.previewEl

    this.attrs = opts.attrs || {
        title: '页面标题',
        pageDesc: '',
        layout: 'tree-list',
        slots: this.getBlankSlots()
    }
    this.init()
}

TreeListLayout.prototype = {
    init () {
        this.mount(this.previewEl)
        this.getAttrsData()
    },
    mount (el) {
        const _this = this
        this.vm = new PreviewExtend({
            propsData: {
                attrs: this.attrs,
                ueditor: this.ueditor,
                postData: function () {
                    _this.postData()
                }
            }
        })
        this.vm.$mount(el)
        typeof this.complete === 'function' && this.complete(this.attrs)
    },
    getBlankSlots () {
        return {
            filters: {
                visible: true,
                vnodes: [{
                    guid: Vue.$utils.guid(),
                    type: 'keyword',
                    model: 'params',
                    // 绑定字段
                    fieldId: 'keyword',
                    // 文本
                    label: '关键字',
                    attrs: {
                        value: '',
                        placeholder: '请输入关键字查询',
                        maxlength: '100'
                    }
                }]
            },
            btns: {
                visible: true,
                vnodes: [
                    { type: 'add', text: '新增' },
                    { type: 'edit', text: '修改' },
                    { type: 'delete', text: '删除' }
                ]
            },
            table: {
                visible: true,
                vnode: {
                    guid: Vue.$utils.guid(),
                    type: 'listTable',
                    fieldId: 'dataTable',
                    model: '',
                    pagination: true,
                    resizeable: true,
                    checkAll: true,
                    columns: []
                }
            },
            leftSide: {
                visible: true,
                vnode: {
                    guid: Vue.$utils.guid(),
                    type: StruTree.type,
                    fieldId: 'activeItem',
                    model: 'params',
                    attrs: {
                        expandOnClickNode: false, // 是否在点击节点的时候展开或者收缩节点，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点， 默认值为 false。
                        uniqueOpened: false // 是否只保持一个顶层节点展开
                    },
                    dataSourceType: 'api',
                    api: ''
                }
            }
        }
    },
    save (publish, callback) {
        this.publish = publish
        this.callback = callback
        this.validate()
    },
    postData () {
        const _this = this
        const data = this.getPostData()
        this.ueditor.$put(_this.publish ? '/api/idp/pages/pageContent/formal' : '/api/idp/pages/pageContent/draft', data, function (data) {
            _this.ueditor.$broadcastAsyncTab('refresh-page-table', 'pageManagement');
            Vue.successMsg(_this.publish ? '发布成功' : '保存成功')
            typeof _this.callback === 'function' && _this.callback()
        }, function () {
            _this.vm.listTableValid = false
            _this.vm.listTableValidSuccess = false
            _this.vm.filtersValid = false
            _this.vm.treeValidSuccess = false
            typeof _this.callback === 'function' && _this.callback('error')
        })
    },
    getPostData () {
        return {
            PageFiles: [this.getPostListPage()],
            PageId: this.opts.pageId,
            HistoryId: this.historyId,
            PageHtml: JSON.stringify(this.attrs)
        }
    },
    getPostListPage () {
        const context = this.getFileContext()
        const file = {
            FileClass: 'List',
            FileContent: this.parseFileContent(context)
        }
        return file
    },
    getFileContext () {
        return {
            moduleId: this.moduleId,
            preview: this,
            // 所有资源类的依赖都是对象key-object配置的形式，如components/methods/mixins
            components: {},
            mixins: {},
            template: '',
            data: {
                dateFields: [],
                visible: false,
                view: '',
                option: null,
                leftSideTitle: this.attrs.title
            },
            methods: {},
            importHtml: '',
            exportHtml: ''
        }
    },
    parseFileContent (context) {
        const tmp = HtmlFormat(this.parseFileTemplate(context), 4)
        const content = {
            imports: [
                `import formMixin from '${Config.mixins.formMixin.path}'`,
                `import baseConfig from './base.js'`,
                `import { lang, table } from '@/static/js/baseInit.js'`,
                `import tree from '@/components/tree'`
            ],
            components: {
                'StruTree': 'tree'
            },
            mixins: 'lang, table, formMixin',
            // 解析模板的时候将相应的依赖（引入组件、方法、属性等等）保存到context中
            template: tmp,
            data: {},
            watch: [{ name: 'value', content: 'this.visible = this.value' }],
            methods: [],
            created: `this.pageTableId = '${this.modelNo}'
            this.pageFunc = this.loadData
            this.initApi(baseConfig)
            this.loadData()
            this.$init()`
        }

        this.parseContentMethods(content, context)
        this.parseContentResource(content, context)
        this.parseContentData(content, context)

        return JSON.stringify(content)
    },
    parseContentMethods (content, context) {
        context.data.tableData = null
        context.methods.callback = {
            name: 'callback',
            content: `this.loadData()`
        }
        context.methods.loadData = {
            name: 'loadData',
            content: `let api = this.getApi('List')
            this.$get(api.Path, this.params, res => {
                this.tableData = res.Rows
                this.pageTotal = res.Total
            });`
        }

        context.methods.getParams = {
            name: 'getParams',
            args: 'api',
            content: `let params = {}
                if (api.Params) {
                    let option = this.option || {}
                    api.Params.forEach(par => {
                        let key = par.ParamValueSource
                        if (!key) {
                            key = par.ParamName.replace(/^\\w/, function(word) {
                                return word.slice(0, 1).toUpperCase() + word.slice(1)
                            })
                        }

                        params[par.ParamName] = option[key]
                    })
                }
                return params`
        }

        for (let method in context.methods) {
            content.methods.push(context.methods[method])
        }
    },
    parseContentData (content, context) {
        delete context.data.dateFields
        content.data = context.data
    },
    parseContentResource (content, context) {
        for (let key in context.mixins) {
            const conf = context.mixins[key]
            const keyName = Vue.$utils.camelCase(key)
            content.imports.push(`import ${keyName} from '${conf.path}'`)
            content.mixins += ', ' + keyName
        }

        // 依赖到的组件
        for (let key in context.components) {
            const conf = context.components[key]
            const keyName = Vue.$utils.pascalCase(key)

            if (conf.immediately !== false) {
                content.imports.push(`import ${keyName} from '${conf.path}'`)
                content.components[keyName] = keyName
                continue
            }

            content.components[keyName] = `() => import('${conf.path}')`
        }
    },
    parseFileTemplate (context) {
        const filters = this.parseFilters(context)
        const btns = this.parseOperationBtns(context)
        const listTable = this.parseListTable(context)
        const leftSide = this.parseLeftSide(context)

        return `<sapi-list-layout 
                :left-side-title="leftSideTitle"
                layout="sapi-tree-layout"
                content-visible
                v-cloak
        >
            <template slot="filters">
                ${filters}
            </template>

            
            <template slot="left-side">
                ${leftSide}
            </template>

            <sapi-right-list slot="right-side">

                <template slot="btns">
                    ${btns}
                </template>

                <template slot="table">
                    ${listTable}
                </template>

                <template slot="pagination">
                    <el-pagination
                        @size-change="pageSizeChange" 
                        @current-change="pageCurrentChange"
                        :current-page="params.pageIndex" 
                        :page-sizes="pageArr"
                        :page-size="params.pageSize" 
                        :layout="layout"
                        :total="pageTotal"
                    >
                    </el-pagination>
                </template>
    
            </sapi-right-list>

        </sapi-list-layout>`
    },
    parseFilters (context) {
        if (!this.attrs.slots.filters.visible) {
            return ''
        }
        const filters = this.attrs.slots.filters.vnodes
        const htmls = []

        context.methods['filterChange'] = {
            name: 'filterChange',
            content: `this.params.pageIndex = 1
            if (typeof this.pageFunc === 'function') {
                this.pageFunc()
            }`
        }

        filters.forEach((vnode) => {
            if (!context.data[vnode.model]) {
                context.data[vnode.model] = {}
            }
            context.data[vnode.model][vnode.fieldId] = null

            if (this.Types[vnode.type] &&
                typeof this.Types[vnode.type].parseVnode === 'function') {
                htmls.push(`<el-col :span="2">${vnode.label}</el-col>
                    <el-col :span="6">
                    ${this.Types[vnode.type].parseVnode(vnode, null, context)}
                    </el-col>`)
            } else {
                throw new Error(`未找到${vnode.type}类型组件的解析方法`)
            }
        })

        let i = 0
        let len = htmls.length
        let count = 0
        while (i < len) {
            if (i % 3 === 0) {
                htmls.splice(i + count, 0,
                    (i === 0 ? '<el-row :gutter="20">' : ((i === len - 1) ? '</el-row>' : '</el-row><el-row :gutter="20">')))
                count += 1
            }

            if (i === len - 1 && i % 3 !== 0 || len === 1) {
                htmls.push('</el-row>')
            }

            i++
        }

        return htmls.join('')
    },
    parseOperationBtns (context) {
        if (!this.attrs.slots.btns.visible) {
            return ''
        }
        const btns = this.attrs.slots.btns.vnodes
        const operates = []

        if (btns.length === 0 || !btns) {
            return
        }

        btns.forEach(vnode => {
            let permission = ''
            let clickFn = ''
            switch (vnode.type) {
                case 'add':
                    permission = `v-if="permissions.Add"`
                    clickFn = `@click="openAddDialog"`
                    context.methods.openAddDialog = {
                        name: 'openAddDialog',
                        content: `this.view = "cmpAdd"
                        this.visible = true
                        this.option = {}`
                    }
                    context.components['cmpAdd'] = {
                        name: 'cmpAdd',
                        immediately: false,
                        path: './add.vue'
                    }
                    break
                case 'edit':
                    permission = `v-if="permissions.Edit"`
                    clickFn = `@click="openEditDialog"`
                    context.methods.openEditDialog = {
                        name: 'openEditDialog',
                        content: `let currentSelectRows = this.deleteDatas;
                        if (currentSelectRows.length === 0) {
                            Vue.errorMsg('请选择一项')
                        } else if (currentSelectRows.length === 1) {
                            this.option = this.deleteDatas[0];
                            this.view = 'cmpEdit';
                            this.visible = true;
                        } else {
                            Vue.errorMsg('只能选择一项进行修改');
                        }`
                    }
                    context.components['cmpEdit'] = {
                        name: 'cmpEdit',
                        immediately: false,
                        path: './edit.vue'
                    }
                    break
                case 'delete':
                    permission = `v-if="permissions.Delete"`
                    clickFn = `@click="deleteItems()"`
                    context.data.deleteDatas = []
                    let methodStr = `let keyId = this._tableKeyId
                        if (!keyId) {
                            let api = this.getApi('BatchDelete')
                            let param = api.Params[0]
                            if (!param || !param.ParamValueSource) {
                                return
                            }
                            keyId = this._tableKeyId = param.ParamValueSource
                            this.tableDeletePath = api.Path
                        }
                        let datas = []
                        if (row) {
                            datas.push(row[keyId])
                        } else {
                            if (this.deleteDatas.length === 0) {
                                Vue.msg('请最少选择一项，才能进行删除')
                                return
                            }
                            datas = this.deleteDatas.map(data => data[keyId])
                        }
                        this.$deleteTips(() => {
                            this.$delete(this.tableDeletePath, JSON.stringify(datas), res => {
                                this.loadData()
                                Vue.successMsg('删除成功')
                            });
                        })`
                    context.methods.deleteItems = { name: 'deleteItems', content: methodStr, args: 'row' }
                    break
                case 'export':
                    permission = `v-if="permissions.Export"`
                    clickFn = `@click="exportDialog"`
                    context.data['exportVisible'] = false
                    context.data['exportView'] = null
                    context.methods.exportDialog = {
                        name: 'exportDialog',
                        content: `this.exportVisible = true
                        this.exportView = 'sapi-export'`
                    }
                    context.components['sapi-export'] = Config.components['sapi-export']
                    context.exportHtml = `<component :is="exportView" v-model="exportVisible" title="导出${this.attrs.title}" :params="params" export-url="${vnode.api || ''}">
                        </component>`
                    break
                case 'import':
                    permission = `v-if="permissions.Import"`
                    clickFn = `@click="importDialog"`
                    context.data['importVisible'] = false
                    context.data['importView'] = null
                    context.methods.importDialog = {
                        name: 'importDialog',
                        content: `this.importVisible = true
                        this.importView = 'sapi-import'`
                    }
                    context.components['sapi-import'] = Config.components['sapi-import']
                    let templatePath = vnode.templatePath || '/Templates/Excel/Import/系统用户导入模板.xlsx'
                    context.importHtml = `<component :is="importView" v-model="importVisible" template-url="${templatePath}" title="${this.attrs.title}" confirm-api="${vnode.api}" @callback="loadData">
                    </component>`
                    break
                default:
                    break
            }

            operates.push(`<el-button size="small" ${permission} ${operates.length === 0 ? 'type="primary"' : ''} ${clickFn}>${vnode.text}</el-button>`)
        })

        return operates.join('')
    },
    parseListTable (context) {
        const vnode = this.attrs.slots.table.vnode
        return this.Types[vnode.type].parseVnode(vnode, null, context)
    },
    parseLeftSide (context) {
        const vnode = this.attrs.slots.leftSide.vnode

        if (!context.data[vnode.model]) {
            context.data[vnode.model] = {}
        }
        context.data[vnode.model][vnode.fieldId] = null
        context.methods['treeNodeClick'] = {
            name: 'treeNodeClick',
            args: 'nodeData',
            content: `
            this.params.pageIndex = 1
            this.${vnode.model}.${vnode.fieldId} = nodeData
            if (typeof this.pageFunc === 'function') {
                this.pageFunc()
            }`
        }

        return this.Types[vnode.type].parseVnode(vnode, null, context)
    },
    clear () {
        this.vm.$set(this.vm.attrs, 'slots', this.getBlankSlots())
        this.ueditor.setActiveVnode(null)
    },
    getAttrsData () {
        if (!this.opts.pageId) {
            return
        }
        const _this = this

        this.ueditor.$get(`/api/idp/pages/pageHistory/${this.opts.pageId}/newest`, { pageId: this.opts.pageId },
            function (data) {
                this.historyId = data.HistoryId
                if (data.PageHtml) {
                    let attrs
                    try {
                        attrs = JSON.parse(data.PageHtml)
                    } catch (err) {
                        attrs = null
                    }

                    if (attrs && attrs.hasOwnProperty('slots')) {
                        _this.attrs = attrs
                        _this.vm.attrs = attrs
                        _this.ueditor.layoutAttrs = attrs
                        _this.ueditor.addRecord()
                        _this.setValidateRules()
                    }
                }

                typeof _this.complete === 'function' && _this.complete(_this.attrs)
            }
        )
    },
    setValidateRules () {
        const vnodes = this.vm.attrs.slots.filters.vnodes
        vnodes.forEach((vnode) => {
            this.vm.setRule(vnode)
        })
    },
    validate () {
        let valid = true
        if (!this.attrs.title) {
            this.ueditor.rightSideTabName = 'pageSetting'
            this.ueditor.$nextTick(function () {
                this.$errorTips('请设置标题', this.$root.layoutAttrsPanel.$refs.pageTitle)
            })

            valid && (valid = false)
        }

        if (!this.validateBtns()) {
            valid && (valid = false)
        }

        const _this = this
        this.vm.pageValid = valid
        this.vm.$nextTick(function () {
            _this.vm.$refs.listTableForm.validate((valid) => {
                _this.vm.listTableValid = valid
                _this.vm.listTableValidSuccess = valid
            })

            _this.vm.$refs.filtersForm.validate((valid) => {
                _this.vm.filtersValid = valid
            })
            _this.vm.$refs.treeFrom.validate((valid) => {
                _this.vm.treeValidSuccess = valid
            })
        })
    },
    validateBtns () {
        if (!this.attrs.slots.btns.visible) {
            return true
        }

        const btns = this.attrs.slots.btns.vnodes

        for (let i = 0, len = btns.length; i < len; i++) {
            if (btns[i].type === 'import') {
                if (!btns[i].template) {
                    this.ueditor.rightSideTabName = 'pageSetting'
                    this.ueditor.$nextTick(function () {
                        this.$errorTips('请配置导入模板', this.$root.layoutAttrsPanel.$refs.importTemplate)
                    })

                    return false
                }

                if (!btns[i].api) {
                    this.ueditor.rightSideTabName = 'pageSetting'
                    this.ueditor.$nextTick(function () {
                        this.$errorTips('请配置导入api', this.$root.layoutAttrsPanel.$refs.importApi)
                    })

                    return false
                }
            }

            if (btns[i].type === 'export' && !btns[i].api) {
                this.ueditor.rightSideTabName = 'pageSetting'
                this.ueditor.$nextTick(function () {
                    this.$errorTips('请配置导出api', this.$root.layoutAttrsPanel.$refs.exportApi)
                })

                return false
            }
        }

        return true
    }
}

export default TreeListLayout
