<template>
    <sapi-list-layout class="list-edit-preview">
        <template v-if="attrs.slots.filters.visible" slot="filters">
            <el-form 
                ref="filtersForm"
                class="sapi-list-filters-preview-wrap"
                :model="model"
                :rules="rules"
                label-position="left"
                label-width="100px">
                <draggable 
                    @add="handleFiltersAdd(attrs.slots.filters.vnodes, $event)"
                    :list="attrs.slots.filters.vnodes"
                    class="sapi-list-filters-fields-warp"
                    :class="{
                        'filter-vnode-empty': attrs.slots.filters.vnodes.length === 0
                    }"
                    :options="{group:'widget', ghostClass: 'ghost', swapThreshold:0.5, animation: 100}">
                    <template v-for="(vnode, i) in attrs.slots.filters.vnodes">
                        <filter-item-draggable
                            :key="vnode.guid" 
                            :vnode="vnode" :index="i"></filter-item-draggable>
                    </template>
                </draggable>
            </el-form>
        </template>

        <template v-if="attrs.slots.btns.visible" slot="btns">
            <template v-for="(vnode, i) in attrs.slots.btns.vnodes">
                <el-button :key="vnode.type" size="small" 
                    :type="i === 0 ? 'primary': ''">{{vnode.text}}</el-button>
            </template>
        </template>

        <template slot="table">
            <el-form class="sapi-list-table-preview-wrap"
                ref="listTableForm"
                :model="model"
                :class=" {
                    'list-table-valid-success': listTableValidSuccess
                }"
                :rules="tableRules">
                <el-form-item :prop="attrs.slots.table.vnode.guid">
                    <draggable-wrap 
                        :use-btns="false"
                        class="collapses-outer-draggable-wrap"
                        :vnode="attrs.slots.table.vnode">
                        <listTable-place :vnode="attrs.slots.table.vnode"></listTable-place>
                    </draggable-wrap>
                </el-form-item>
            </el-form>
        </template>

        <template slot="pagination">
            <el-pagination 
                @size-change="pageSizeChange" 
                @current-change="pageCurrentChange" 
                :current-page="params.pageIndex" 
                :page-sizes="pageArr" 
                :page-size="params.pageSize" 
                :layout="layout" 
                :total="pageTotal">
            </el-pagination>
        </template>

        <template slot="other">
            <component v-bind:is="currentView" v-model="visible" :option="option"></component>
        </template>
    </sapi-list-layout>
</template>

<script>
import FilterItemDraggable from './filter-item-draggable.vue'
import DraggableWrap from '../../components/draggable-wrap.vue'
import draggable from '../../components/draggable.js'
import ListTablePlace from '../../types/list-table/place.vue'
import HtmlFormat from '../../components/htmlFormat.js'
import { table } from '@/static/js/baseInit.js';
import Types from './types.js'
import Config from '../../config.js'
import './base.less'

export default {
    components: {
        FilterItemDraggable,
        DraggableWrap,
        draggable,
        'listTable-place': ListTablePlace
    },
    mixins: [table],
    inject: ['ueditor'],
    provide () {
        return {
            preview: this
        }
    },
    props: {
        layout: String,
        pageId: String,
        moduleId: String
    },
    data () {
        return {
            attrs: {
                title: '',
                pageDesc: '',
                layout: 'list',
                slots: {
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
                            { type: 'delete', text: '删除' } // ,
                            // { type: 'import', text: '导入', template: '', api: '' },
                            // { type: 'export', text: '导出', api: '' }
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
                    }
                }
            },
            model: {},
            rules: {},
            tableRules: {},
            activateVnode: null,
            params: {
                pageIndex: 1,
                pageSize: 20
            },
            visible: false,
            currentView: '',
            option: null,
            pageValid: false,
            filtersValid: false,
            listTableValid: false,
            listTableValidSuccess: true
        }
    },
    computed: {
        valid () {
            return this.pageValid && this.filtersValid && this.listTableValid
        }
    },
    watch: {
        valid (val) {
            if (val) {
                this.pageValid = false
                this.filtersValid = false
                this.listTableValid = false
                this.postData()
            }
        }
    },
    methods: {
        pageSizeChange () {},
        pageCurrentChange () {},
        handleFiltersAdd (list, event) {
            const typeObj = list[event.newIndex]
            const newVnode = typeObj.create({ model: 'params' }, null, this.attrs)

            this.setRule(newVnode)
            this.$set(list, event.newIndex, newVnode)
            this.ueditor.setActiveVnode(newVnode)
        },
        addKeywordSearch () {
            if (this.keywordSearchIndexOf() > -1) {
                return
            }

            const newVnode = Types.$factory('keyword', {
                model: 'params',
                fieldId: 'keyword',
                attrs: {
                    value: '',
                    placeholder: '请输入关键字查询',
                    maxlength: '100'
                }
            }, null, this.attrs)
            const vnodes = this.attrs.slots.filters.vnodes
            this.setRule(newVnode)
            this.$set(vnodes, vnodes.length, newVnode)
            this.ueditor.setActiveVnode(newVnode)
        },
        removeKeywordSearch () {
            const i = this.keywordSearchIndexOf()
            if (i === -1) {
                return
            }

            const vnodes = this.attrs.slots.filters.vnodes
            const keyword = vnodes[i]
            this.attrs.slots.filters.vnodes.splice(i, 1)
            if (this.ueditor.getActiveVnode() === keyword) {
                this.ueditor.setActiveVnode(null)
            }
        },
        keywordSearchIndexOf () {
            const vnodes = this.attrs.slots.filters.vnodes
            let index = -1

            for (let i = 0, len = vnodes.length; i < len; i++) {
                if (vnodes[i].type === 'keyword') {
                    index = i
                    break
                }
            }

            return index
        },
        setRule (vnode) {
            var getValidator = function (vnode) {
                return function (rule, value, callback) {
                    let errorMsg = ''
                    if (!vnode.fieldId) {
                        errorMsg += '未设置绑定字段；'
                    }

                    if (!vnode.label) {
                        errorMsg += '显示标题不能为空；'
                    }

                    if (vnode.type === 'radio' ||
                        vnode.type === 'checkbox' ||
                        vnode.type === 'select') {
                        if ((!vnode.options || vnode.options.length === 0) && !vnode.api) {
                            errorMsg += '未设置数据源；'
                        }
                    }

                    if (vnode.type === 'custom' && !vnode.componentName) {
                        errorMsg += '未设置组件类型；'
                    }

                    if (errorMsg) {
                        callback(new Error(errorMsg))
                    } else {
                        callback()
                    }
                }
            }
            if (Types[vnode.type].category === 'base' ||
                Types[vnode.type].category === 'enhance') {
                const rule = {
                    type: Object,
                    required: false,
                    validator: getValidator(vnode),
                    trigger: ['change', 'blur']
                }

                this.$set(this.rules, vnode.guid, rule)
            }
        },
        setTableRule () {
            var getValidator = function (vnode) {
                return function (rule, value, callback) {
                    let errorMsg = ''
                    const columns = vnode.columns
                    if (!columns || columns.length === 0) {
                        errorMsg = '请设置表格列;'
                    } else {
                        for (let i = 0, len = columns.length; i < len; i++) {
                            if (!columns[i].label) {
                                errorMsg += `${columns[i].fieldName}标题不能为空;`
                            }

                            if (columns[i].isLink && columns[i].linkType === 'custom') {
                                if (!columns[i].linkDirectory) {
                                    errorMsg += `${columns[i].fieldName}文件目录不能为空;`
                                }
                                if (!columns[i].linkPath) {
                                    errorMsg += `${columns[i].fieldName}路由全路径不能为空;`
                                }
                            }

                            if (columns[i].useMatch === 'method' && !columns[i].matchMethod) {
                                errorMsg += `${columns[i].fieldName}未选择匹配方法;`
                            }

                            if (columns[i].useMatch === 'dataSource' &&
                                (!columns[i].matchOptions || columns[i].matchOptions.length === 0)) {
                                errorMsg += `${columns[i].fieldName}未添加匹配数据源;`
                            }
                        }
                    }

                    if (errorMsg) {
                        callback(new Error(errorMsg))
                    } else {
                        callback()
                    }
                }
            }
            const vnode = this.attrs.slots.table.vnode
            const rule = {
                type: Object,
                required: false,
                validator: getValidator(vnode),
                trigger: ['change', 'blur']
            }
            this.tableRules = {}
            this.$set(this.tableRules, vnode.guid, rule)
        },
        getAttrsData () {
            if (!this.pageId) {
                return
            }
            const _this = this
            this.$get(`/api/ims/pages/${this.pageId}`, { pageId: this.pageId },
                function (data) {
                    if (data.PageHtml) {
                        let attrs
                        try {
                            attrs = JSON.parse(data.PageHtml)
                        } catch (err) {
                            attrs = null
                        }

                        if (attrs && attrs.hasOwnProperty('slots')) {
                            _this.attrs = attrs
                            _this.ueditor.layoutAttrs = attrs
                            _this.setTableRule()
                        }
                    }
                }
            )
        },
        save (download) {
            this.download = download
            this.validate()
        },
        postData () {
            const _this = this
            if (this.postStatus === 'posting') {
                return
            }
            const data = this.getPostData()
            this.postStatus = 'posting'
            this.$put('/api/ims/pages/pageContent', data, function (data) {
                this.postStatus = ''
                if (_this.download) {
                    _this.downloadOperate()
                } else {
                    Vue.successMsg('保存成功')
                }
            }, function () {
                this.postStatus = ''
            })
        },
        getPostData () {
            return {
                PageFiles: [this.getPostListPage()],
                PageId: this.opts.pageId,
                PageHtml: JSON.stringify(this.attrs)
            }
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

            this.pageValid = valid
            this.$nextTick(function () {
                this.$refs.listTableForm.validate((valid) => {
                    this.listTableValid = valid
                })

                this.$refs.filtersForm.validate((valid) => {
                    this.filtersValid = valid
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
        },
        parseTemplate (opts) {
            const s = this.slots
            return `<sapi-list-layout>
                <template v-if="${s.filters.filtersVisible}" slot="filters">
                    ${this.parseFilters()}
                </template>

                <template v-if="${s.bnts.btnsVisible}" slot="btns">
                    ${this.parseBtns()}
                </template>

                <template slot="table">
                    ${this.parseTable()}
                </template>

                <template v-if="${this.getPagintaionVisible()}" slot="pagination">
                    ${this.parsePagination()}
                </template>

                <template v-if="${this.getOtherVisible()}" slot="other">
                    ${this.parseOther()}}
                </template>
            </sapi-list-layout>`
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
                    option: null
                },
                methods: {},
                importHtml: '',
                exportHtml: ''
            }
        },
        parseFileContent (context) {
            const content = {
                imports: [
                    `import baseConfig from './base.js'`,
                    `import { lang, table } from '@/static/js/baseInit.js'`
                ],
                components: {},
                mixins: 'lang, table',
                // 解析模板的时候将相应的依赖（引入组件、方法、属性等等）保存到context中
                template: HtmlFormat(this.parseFileTemplate(context), 4),
                data: {},
                watch: [{ name: 'value', content: 'this.visible = this.value' }],
                methods: [],
                created: `this.pageTableId = '${this.moduleId}'
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
        parseFileTemplate (context) {
            const filters = this.parseFilters(context)
            const btns = this.parseOperationBtns(context)
            const listTable = this.parseListTable(context)

            return `<sapi-list-layout>
                <template slot="filters">
                    ${filters}
                </template>

                <template slot="btns">
                    ${btns}
                </template>

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

                <template slot="other">
                    ${context.exportHtml}
                    ${context.importHtml}
                    <component :is="view" v-model="visible" :option="option"></component>
                </template>
            </sapi-list-layout>`
        },
        parseFilters(context) {
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

                if (Types[vnode.type] &&
                    typeof Types[vnode.type].parseVnode === 'function') {
                    htmls.push(`<el-col :span="2">${vnode.label}</el-col>
                        <el-col :span="6">
                        ${Types[vnode.type].parseVnode(vnode, null, context)}
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

                if (i === len - 1 && i % 3 !== 0) {
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
                            args: 'row',
                            content: `this.view = "cmpEdit"
                            this.visible = true
                            this.option = row`
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
                            }
                            else {
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
                        context.methods.deleteItems = {name: 'deleteItems', content: methodStr, args: 'row'}
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
            return Types[vnode.type].parseVnode(vnode, null, context)
        },
        parseContentMethods (content, context) {
            context.data.tableData = null
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
        parseContentResource (content, context) {
            for (let key in context.mixins) {
                const conf = context.mixins[key]
                const keyName = Vue.$utils.camelCase(key)
                content.imports.push(`import ${keyName} from '${conf.path}'`)
                content.mixins += ', ' + keyName
            }

            // 依赖到的组件
            for (let key in context.components) {
                if (!Config.components[key]) {
                    continue
                }

                const conf = Config.components[key]
                const keyName = Vue.$utils.pascalCase(key)

                if (conf.immediately !== false) {
                    content.imports.push(`import ${keyName} from '${conf.path}'`)
                    content.components[key] = keyName
                    continue
                }

                content.components[key] = `() => import('${conf.path}')`
            }
        },
        parseContentData (content, context) {
            delete context.data.dateFields
            content.data = context.data
        },
        downloadOperate () {
            if (!this.opts.pageId) {
                return
            }
            let token = this.token
            if (!token) {
                let authorization = this.$getLoginInfo()
                if (this.$utils.isPlainObject(authorization)) {
                    if (authorization['access_token']) {
                        this.token = authorization['access_token']

                        token = this.token
                    }
                }
            }
            let param = `?pageId=${this.pageId}&access_token=${token}`
            window.open(this.ueditor.$webConfig.fileServer + `/api/ims/pages/${this.pageId}/download` + param)
        },
        clear () {
            this.attrs = {
                title: '',
                pageDesc: '',
                layout: 'list',
                slots: {
                    filters: {
                        visible: true,
                        vnodes: []
                    },
                    btns: {
                        visible: true,
                        vnodes: [
                            { type: 'add', text: '新增' },
                            { type: 'edit', text: '修改' },
                            { type: 'delete', text: '删除' } // ,
                            // { type: 'import', text: '导入', template: '', api: '' },
                            // { type: 'export', text: '导出', api: '' }
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
                    }
                }
            }
        }
    },
    created () {
        const _this = this
        this.ueditor.layoutAttrs = this.attrs
        this.getAttrsData()
        this.setTableRule()
        // 清空模板
        this.$root.$on('template-clear', function () {
            _this.clear()
        })
        // 下载模板
        this.$root.$on('template-download', function () {
            _this.save(true)
        })
        // 保存模板
        this.$root.$on('template-save', function () {
            _this.save()
        })
    },
    mounted() {
        const that = this
        this.validatePreviewField = function (vnode) {
            if (vnode.type === 'listTable' || vnode.type === 'listTableColumn') {
                that.$refs.listTableForm.validate((valid) => {
                    that.listTableValidSuccess = valid
                })
            } else {
                that.$refs.filtersForm.validateField(vnode.guid)
            }
        }
        this.$root.$on('validate-preview-field', this.validatePreviewField)
    },
    beforeDestroy () {
        this.$root.$off('validate-preview-field', this.validatePreviewField)
        // 清空模板
        this.$root.$off('template-clear')
        // 下载模板
        this.$root.$off('template-download')
        // 保存模板
        this.$root.$off('template-save')
    }
}
</script>
