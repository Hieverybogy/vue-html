import Preview from './preview.vue'
import Types from './types.js'
import Config from '../../config.js'
import HtmlFormat from '../../components/htmlFormat.js'
const PreviewExtend = Vue.extend(Preview)
import './base.less'

function FormLayout(opts, vm, complete) {
    opts = opts || {}
    this.opts = opts
    this.Types = Types
    this.layout = 'form'
    this.modelNo = ''
    this.moduleId = opts.moduleId || ''
    this.ueditor = vm
    this.complete = complete
    this.previewEl = opts.previewEl

    this.attrs = this.opts.attrs || {
        title: '',
        layout: 'form',
        backLang: this.ueditor.currBackLang,
        doubleColumns: false,
        dialogOption: {
            width: '1000px',
            top: '25%'
        },
        slots: this.getBlankSlots()
    }

    // 组件配置信息
    this.init()
}

FormLayout.prototype = {
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
        this.ueditor.$get(`/api/idp/pages/pageHistory/${this.opts.pageId}/newest`, { pageId: this.opts.pageId },
            function(data) {
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
                        _this.setValidateRules(_this.attrs.slots.default.vnodes || [])
                    }
                }

                typeof _this.complete === 'function' && _this.complete(_this.attrs)
            }
        )
    },
    save(publish, callback) {
        const _this = this
        this.publish = publish
        this.validate(function() {
            const data = _this.getPostData()

            _this.ueditor.$put(_this.publish ? '/api/idp/pages/pageContent/formal' : '/api/idp/pages/pageContent/draft', data, function(data) {
                _this.ueditor.$broadcastAsyncTab('refresh-page-table', 'pageManagement');
                Vue.successMsg(_this.publish ? '发布成功' : '保存成功')
                typeof callback === 'function' && callback()
            }, function() {
                typeof callback === 'function' && callback('error')
            })
        })
    },
    clear() {
        this.vm.$set(this.vm.attrs, 'slots', this.getBlankSlots())
        this.ueditor.setActiveVnode(null)
    },
    getPostData() {
        return {
            PageFiles: this.getPostPageFiles(),
            PageId: this.opts.pageId,
            HistoryId: this.historyId,
            PageHtml: JSON.stringify(this.attrs)
        }
    },
    getPostPageFiles() {
        const files = []
        const filesClass = ['Add', 'Edit', 'View']

        filesClass.forEach((c) => {
            let context = this.getFileContext(c)
            files.push({
                FileClass: c,
                FileContent: this.parseFileContent(context)
            })
        })
        return files
    },
    parseFileContent(context) {
        const content = {
            imports: [
                `import baseConfig from './base.js'`,
                `import formMixin from '${Config.mixins.formMixin.path}'`
            ],
            components: {},
            mixins: 'formMixin',
            // 解析模板的时候将相应的依赖（引入组件、方法、属性等等）保存到context中
            template: HtmlFormat(this.parseFileTemplate(context), 4),
            props: {
                option: 'Object',
                value: 'Boolean',
                usePostNav: 'Boolean',
                append: 'Boolean'
            },
            data: {},
            watch: [{ name: 'value', content: 'this.visible = this.value' }],
            methods: [],
            created: `this.visible = this.value
        this.initApi(baseConfig)`,
            mounted: ''
        }

        this.parseContentMethods(content, context)
        this.parseContentResource(content, context)
        this.parseContentData(content, context)
        this.parseContentCreated(content, context)
        this.parseContentWatch(content, context)

        return JSON.stringify(content)
    },
    parseContentMethods(content, context) {
        const methodsDD = {
            open(ctx) {
                    return `
                ${ctx.mode === 'Add' || ctx.mode === 'Edit' ? `this.$refs.form && this.$refs.form.resetFields()` : ''}
                let option = (this.append ? this.$route.query : this.option) || {}
                let model = this.model
                for (let key in model) {
                    if (option.hasOwnProperty(key)) {
                        model[key] = option[key]
                    }
                }

                ${ctx.mode === 'Edit' || ctx.mode === 'View' ? `this.getData()` : ''}
            `
            },
            close () {
                return `this.$emit("input", false)`
            },
            getData (ctx) {
                let str = `
                    let api = this.getApi('View')
                    let params = this.getParams(api)
                    let keyId = this.getKeyId()
                    this.$get(api.Path, params, res => {
                        this.resData = res
                        let model = this.model
                        for (let key in model) {
                            model[key] = res[key]
                        }
                        model[keyId] = this.resData[keyId]
                        `

                const childDD = {}
                ctx.data.dateFields.forEach((item) => {
                    if (item.parentFieldType === 'array') {
                        childDD[item.parentFieldId] = childDD[item.parentFieldId] || []
                        childDD[item.parentFieldId].push(item)
                    } else {
                        str += `
                            model.${item.fieldId} = this.$dateFormat('${item.format}', model.${item.fieldId})
                        `
                    }
                })

                for (let parentFieldId in childDD) {
                    str += `
                    if (model.${parentFieldId}) {
                        model.${parentFieldId}.forEach(data => {`

                    childDD[parentFieldId].forEach((item) => {
                        str += `
                            data.${item.fieldId} = this.$dateFormat('${item.format}', data.${item.fieldId})
                        `
                    })

                    str += `})
                    }`
                }

                if (ctx.data.dealData) {
                    str += ctx.data.dealData
                }

                str += `
                    })`
                return str
            },
            postData (ctx) {
                return `this.$refs.form.validate((valid) => {
                    if (valid) {
                        let api = this.getApi('Add')
                        this.disabled = true
                        this.$post(this.parseApiPath(api), this.model, res => {
                            this.disabled = false
                            Vue.successMsg('新增成功!', {
                                callback: () => {
                                    if (this.append) {
                                        this.$closeWindow()
                                    } else {
                                        this.close()
                                        this.$emit('callback')
                                    }
                                }
                            })
        
                            if (this.append) {
                                this.$broadcastAsyncTab('refresh-page-table', '${ctx.modelNo}')
                            }
                        }, () => {
                            this.disabled = false
                        })
                    }
                })`
            },
            putData (ctx) {
                return `this.$refs.form.validate((valid) => {
                    if (valid) {
                        let api = this.getApi('Edit')
                        this.disabled = true

                        this.$put(this.parseApiPath(api), this.model, res => {
                            this.disabled = false
                            Vue.successMsg('修改成功!', {
                                callback: () => {
                                    if (this.append) {
                                        this.$closeWindow()
                                    } else {
                                        this.close()
                                        this.$emit('callback')
                                    }
                                }
                            })
        
                            if (this.append) {
                                this.$broadcastAsyncTab('refresh-page-table', '${ctx.modelNo}')
                            }
                        }, () => {
                            this.disabled = false
                        })
                    }
                })`
            }
        }

        for (let method in methodsDD) {
            if (context.mode === 'View' && (method === 'postData' || method === 'putData') ||
                context.mode === 'Add' && (method === 'putData' || method === 'getData')) {
                continue
            }

            content.methods.push({
                name: method,
                content: methodsDD[method](context)
            })
        }

        for (let method in context.methods) {
            content.methods.push(context.methods[method])
        }
    },
    // 解析依赖的资源
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
    parseContentData (content, context) {
        delete context.data.dateFields
        delete context.data.dealData
        content.data = context.data
    },
    parseContentCreated (content, context) {
        if (context.created) {
            content.created += context.created
        }
    },
    parseContentWatch (content, context) {
        if (context.watch && context.watch.length > 0) {
            content.watch = content.watch.concat(context.watch)
        }
    },
    // 解析保存过程中的依赖
    getFileContext (mode) {
        return {
            mode: mode,
            modelNo: this.modelNo,
            preview: this,
            currBackLang: this.ueditor.currBackLang,
            components: {},
            mixins: {},
            template: '',
            props: {
                option: 'Object',
                value: 'Boolean',
                usePostNav: 'Boolean',
                append: 'Boolean'
            },
            data: {
                model: {},
                dateFields: [],
                rules: {},
                visible: false,
                disabled: false
            },
            watch: {},
            methods: {},
            // otherSlot字符串数组: 懒加载的一些组件，比如选择岗位、选择账号等弹出层
            // 为了避免解析复杂，每种类型的组件引入需要组件解析时传入懒加载的组件字符串模板
            // 类似：
            // <sapi-select v-model="functionHigherItems" :format="format" @select="chooseStation('fieldId', 'multiple')"></sapi-select>
            // `<component v-model="chooseStationVisible" @callback="chooseStationCallback" :is="chooseStationView" :multiple="true"></component>`
            otherSlot: []
        }
    },
    // mode: Add、Edit、View
    parseFileTemplate (context) {
        const titleDD = {
            'Add': '新增',
            'Edit': '修改',
            'View': '查看'
        }
        const defaultSlotTmp = this.parseDefaultSlot(context)
        const otherSlotTmp = this.parseOtherSlot(context)
        const isEdit = context.mode === 'Add' || context.mode === 'Edit'

        return `<sapi-form-panel
                    :dialog="!append"
                    :dialog-options="{
                        width: '${this.attrs.dialogOption.width}',
                        top: '${this.attrs.dialogOption.top}'
                    }"
                    :panel-options="{
                        usePostNav: usePostNav
                    }"
                    v-model="visible" @on-open="open" @on-close="close">
                    <template slot="title">
                        <span>${titleDD[context.mode] + this.attrs.title}</span>
                    </template>

                    <sapi-form
                        ref="form"
                        ${this.attrs.doubleColumns ? ':doubleColumns="true"' : ''}
                        ${isEdit ? `:rules="rules" :model="model"` : ''}
                        :in-dialog="!append">
                        ${defaultSlotTmp}
                    </sapi-form>

                    <template slot="footer">
                        <el-button v-if="!append" size="small" @click="close">${isEdit ? '取消' : '关闭'}</el-button>
                        <el-button v-if="append" size="small" @click="$closeWindow">关闭</el-button>
                        ${isEdit ? `<el-button type="primary" size="small" :disabled="disabled" @click="${context.mode === 'Add' ? 'postData' : 'putData'}">确定</el-button>` : ''}
                    </template>

                    <template slot="other">
                        ${otherSlotTmp}
                    </template>
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
    parseOtherSlot (context) {
        // 添加了非全局的组件
        let rst = ''
        const tmps = context.otherSlot
        if (tmps && tmps.length > 0) {
            tmps.forEach((tmp) => {
                rst += `${tmp}
                    `
            })
        }

        return rst
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
        const isEditMode = mode === 'Add' || mode === 'Edit'

        // 统一添加model的表单字段
        if (vnode.subFieldId) {
            context.data.model[vnode.fieldId] = context.data.model[vnode.fieldId] || {}
            context.data.model[vnode.fieldId][vnode.subFieldId] = null
        } else {
            if (!vnode.isNoNeedFieldId) {
                context.data.model[vnode.fieldId] = null
            }
        }

        if (mode === 'Add' && vnode.attrs && vnode.attrs.value) {
            context.data.model[vnode.fieldId] = vnode.attrs.value
        }

        return [`<sapi-form-item 
            label="${vnode.label}" 
            ${isEditMode && vnode.required ? `prop="${vnode.fieldId}${vnode.subFieldId ? '.' + vnode.subFieldId : ''}"` : ''}
            ${vnode.alone ? ':alone="true"' : ''}
            ${vnode.fullline ? ':full="true"' : ''}>`,
            this.Types[vnode.type].parseVnode(vnode, parentVnode, context),
            '</sapi-form-item>']
    }
}

export default FormLayout
