<template>
    <ueditor-panel :class="'sapi-' + layout + '-ueditor'" @preview-click="previewClick">
        <template slot="leftSide">
            <types-panel :layout="layout" :env="env"></types-panel>
        </template>

        <template slot="btns">
            <el-button size="mini"  
                @click="clear" :disabled="btnsDisabled || clearDisabled">重置</el-button>
            <el-button size="mini"
                @click="recover" :disabled="btnsDisabled || recoverDisabled">恢复({{canRecoverCount}})</el-button>
            <el-button size="mini"
                @click="undo" :disabled="btnsDisabled || undoDisabled">撤销({{canUndoCount}})</el-button>
            <el-button size="mini" type="primary"
                @click="save" :disabled="btnsDisabled">保存</el-button>
            <el-button size="mini" type="primary"
                @click="publish" :disabled="btnsDisabled">发布</el-button>
        </template>

        <template slot="preview">
            <div class="engine-html-main" ref="preview">
            </div>
        </template>

        <template slot="rightSide">
            <el-tabs type="card" 
                v-model="rightSideTabName">
                <el-tab-pane name="pageSetting" label="页面属性">
                    <layout-attrs-panel 
                        ref="layoutAttrs"
                        :layout="layout"
                        :layout-attrs="layoutAttrs"
                        :env="env"
                        ></layout-attrs-panel>
                </el-tab-pane>
                <el-tab-pane name="formSetting" label="表单属性">
                    <types-attrs-panel
                        :data-model="dataModel" 
                        :vnode="activateVnode"
                        :parent-vnode="activateParentVnode"
                        :layout-attrs="layoutAttrs"
                        :env="env"
                        :layout="layout"></types-attrs-panel>
                </el-tab-pane>
            </el-tabs>
        </template>

        <template slot="other">
            <div v-transfer-dom>
                <component :is="bindEventView"
                    v-model="bindEventVisible" 
                    :reference="bindEventArrowEl" 
                    :option="bindEventOption" :methods-option="bindingMethodsOption"></component>
                
                <component :is="conditionView"
                    v-model="conditionVisible" 
                    :option="conditionOption" 
                    :reference="conditionArrowEl"
                    :data-model="dataModel"></component>
            </div>

            <component :is="bindingPropView"
                v-model="bindingPropVisible" 
                :reference="bindingPropArrowEl" 
                :vnode="activateVnode"
                :condition-prop="bindingConditionProp"
                :binding-prop-tag-name="bindingPropTagName"></component>
        </template>
    </ueditor-panel>
</template>

<script>
import UeditorPanel from './components/ueditor-panel.vue'
import TypesPanel from './layout/types-panel.vue'
import LayoutAttrsPanel from './layout/layout-attrs-panel.vue'
import TypesAttrsPanel from './layout/types-attrs-panel.vue'
import LayoutProxy from './layout/index.js'
import ParseBindingMixin from './parse-binding-mixin'
import './ueditor.less'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

export default {
    components: {
        UeditorPanel,
        TypesPanel,
        LayoutAttrsPanel,
        TypesAttrsPanel,
        'set-bindevent': () => import('./components/set-bindevent'),
        'set-condition': () => import('./components/set-condition'),
        'set-binding-prop': () => import('./components/set-binding-prop')
    },
    mixins: [ParseBindingMixin],
    provide () {
        return {
            ueditor: this
        }
    },
    data () {
        return {
            activateVnode: null,
            activateParentVnode: null,
            layout: '',
            env: '',
            layoutAttrs: null,
            rightSideTabName: 'pageSetting',
            dataModel: [],
            dataModelName: null,
            modelNo: '',
            pageId: '',
            moduleId: '',
            btnsDisabled: true,
            records: [],
            recordIndex: 0,
            bindEventView: '',
            bindEventVisible: false,
            bindEventOption: {},
            bindEventArrowEl: null,
            conditionView: '',
            conditionVisible: false,
            conditionOption: {},
            conditionArrowEl: null,
            bindingPropView: '',
            bindingPropVisible: false,
            bindingPropArrowEl: null,
            bindingConditionProp: null,
            bindingPropVnode: null,
            bindingPropTagName: ''
        }
    },
    computed: {
        recoverDisabled () {
            return this.recordIndex >= this.records.length - 1
        },
        canRecoverCount () {
            return this.records.length === 0 ? 0 : (this.records.length - 1 - this.recordIndex)
        },
        undoDisabled () {
            return this.recordIndex <= 0
        },
        canUndoCount () {
            return this.recordIndex
        },
        clearDisabled () {
            return this.layoutAttrs && JSON.stringify(this.layoutAttrs.slots) === JSON.stringify(this.preview.getBlankSlots())
        }
    },
    watch: {
        activateVnode (vnode) {
            this.rightSideTabName = vnode ? 'formSetting' : 'pageSetting'
        }
    },
    methods: {
        clear() {
            if (this.preview) {
                this.preview.clear()
                this.addRecord()
            }
        },
        recover () {
            if (this.recordIndex === this.records.length - 1) {
                return
            }
            this.recordIndex += 1

            this.setCurrRecord()
        },
        undo () {
            if (this.recordIndex === 0) {
                return
            }
            this.recordIndex -= 1

            this.setCurrRecord()
        },
        publish () {
            const _this = this
            if (this.preview) {
                this.preview.save(true, function () {
                    _this.resetRecords()
                })
            }
        },
        save () {
            const _this = this
            if (this.preview) {
                this.preview.save(false, function () {
                    _this.resetRecords()
                })
            }
        },
        setCurrRecord () {
            const r = JSON.parse(this.records[this.recordIndex])
            this.preview.vm.attrs = r.attrs
            this.layoutAttrs = r.attrs
            this.activateVnodeGuid = r.activateVnodeGuid
            if (this.activateVnodeGuid) {
                // 激活当前选中的节点
                this.$nextTick(function () {
                    this.$emit('update-activate-vnode', this.activateVnodeGuid)
                })
            } else {
                this.activateVnode = null
            }
        },
        resetRecords () {
            this.records = []
            this.recordIndex = 0
            this.addRecord()
        },
        addRecord () {
            const len = this.records.length
            if (len !== 0 && this.recordIndex !== len - 1) {
                this.records.splice(this.recordIndex + 1, len - 1 - this.recordIndex)
            }
            this.records.push(JSON.stringify({
                attrs: this.layoutAttrs,    
                activateVnodeGuid: this.activateVnode && this.activateVnode.guid || ''
            }))

            this.recordIndex = this.records.length - 1
            this.preview.updateCodeAndTmp()
        },
        getDataModel () {
            if (!this.modelId) {
                return
            }

            // GET /{version}/businesss/{id}
            this.$get(`${this.$formServerUrl}/businesss/${this.modelId}`, function (res) {
                const rst = []
                const flatRst = []
                this.transformModel(res.masterTable && res.masterTable.masterTableFields || [], rst, flatRst, true, this.vmDataModel)
                this.dataModel = flatRst
                this.dataModelName = res.modelName
                this.modelNo = res.modelNo
                this.masterTableCode = res.masterTable && res.masterTable.tableCode || ''

                if (this.preview) {
                    this.preview.modelNo = this.modelNo
                }

                this.dataModelSuccessQueue.forEach((fn) => {
                    this.$utils.isFunction(fn) && fn()
                })
                this.isDataModelSuccess = true
            })
        },
        onDataModelReady (fn) {
            if (this.isDataModelSuccess) {
                this.$utils.isFunction(fn) && fn()
            } else {
                this.dataModelSuccessQueue.push(fn)
            }
        },
        transformModel (fields, rst, flatRst, isMaster, vmDataModel, parentField) {
            if (!fields || fields.length === 0) {
                return rst
            }
            
            // String=1,Int=2, Float=3,DateTime=4, LongString = 5,SubTable=99, Attachment=100
            const fieldTypeDD = {
                1: 'text',
                2: 'int',
                3: 'float',
                4: 'date',
                5: 'textarea',
                99: 'detail',
                100: 'upload'
            }

            // 系统后端会自动更新的字段，选择字段时非必须
            const autoUpdateFields = {
                'is_deleted': true,
                'creator_id': true,
                'updator_id': true,
                'creator_name': true,
                'updator_name': true,
                'create_time': true,
                'update_time': true
            }

            fields.forEach((field) => {
                const children = []
                if (vmDataModel) {
                    // 1对1关系可绑定子属性
                    if (field.subRelationship === 1) {
                        vmDataModel[field.fieldCode] = {}
                    } else {
                        vmDataModel[field.fieldCode] = null
                    }
                }
                const IsNullable = (field.isPrimaryKey || autoUpdateFields[field.fieldCode]) ? true : (!!field.isNullable)

                // 添加FieldCode父级链
                if (!field.parentFieldIdChain)  {
                    field.parentFieldIdChain = []
                    if (parentField) {
                        field.parentFieldIdChain = parentField.parentFieldIdChain.slice(0)
                        field.parentFieldIdChain.push(parentField.fieldCode)
                    }
                }

                const fieldObj = {
                    FieldId: field.fieldCode,
                    FieldName: field.fieldName,
                    FieldType: fieldTypeDD[field.fieldType],
                    Length: field.length,
                    DefaultValue: field.defaultValue,
                    IsPrimaryKey: !!field.isPrimaryKey,
                    // 主键、系统更新字段非必须绑定到视图中
                    IsNullable: IsNullable,
                    Relationship: field.subRelationship,
                    MarkCount: 0,
                    Children: children
                }

                const flatFieldObj = {
                    FieldCode: field.fieldCode,
                    // 多表情况下fieldCode可能会重复，加上父级链防止重复
                    FieldId: field.parentFieldIdChain.length === 0 ? field.fieldCode : `${field.parentFieldIdChain.join('.')}.${field.fieldCode}`,
                    ParentFieldIdChain: field.parentFieldIdChain,
                    ParentFieldId: parentField && parentField.fieldCode || '',
                    FieldName: new Array(field.parentFieldIdChain.length + 1).join('--') + field.fieldName,
                    ParentFieldName: parentField && parentField.fieldName || '',
                    FieldType: fieldTypeDD[field.fieldType],
                    ParentFieldType: parentField && fieldTypeDD[parentField.fieldType] || '',
                    Length: field.length,
                    DefaultValue: field.defaultValue,
                    IsPrimaryKey: !!field.isPrimaryKey,
                    // 主键、系统更新字段非必须绑定到视图中
                    IsNullable: IsNullable,
                    Relationship: field.subRelationship,
                    MarkCount: 0,
                    Children: children
                }

                rst.push(fieldObj)
                flatRst && flatRst.push(flatFieldObj)

                this.transformModel(field.subTableFields, children, (field.subRelationship === 1 ? flatRst : null), false, vmDataModel && vmDataModel[field.fieldCode] || null, field)

                // 收集主键
                if (isMaster && field.isPrimaryKey) {
                    this.primaryKeys.push(field.fieldCode)
                }
            })

            return rst
        },
        previewClick (event) {
            this.activateVnode = null
        },
        setActiveVnode (vnode, parentVnode) {
            this.activateVnode = vnode
            this.activateParentVnode = parentVnode
        },
        getActiveVnode () {
            return this.activateVnode
        },
        openBindeventView (arrowEl, vnode, eventTypes) {
            this.bindEventView = 'set-bindevent'
            this.bindEventArrowEl = arrowEl
            this.bindEventOption = {
                vnode,
                eventTypes
            }
            this.bindEventVisible = true
        },
        /**
         * @param {object} vnode 设置节点
         * @param {string} conditionProp 设置的条件，类似v-if、v-show，指令以v-开头，否则视为属性绑定
         */
        openConditionView (ArrowEl, vnode, conditionProp) {
            this.conditionView = 'set-condition'
            this.conditionOption = {
                vnode,
                conditionProp
            }
            this.conditionArrowEl = ArrowEl
            this.conditionVisible = true
        },
        /**
         * 弹出条件表达式编辑窗口
         * @param {ele} arrowEl 弹窗arrow指向的元素
         * @param {string} tagName 元素节点名称
         * @param {string} conditionProp 设置的条件，类似v-if、v-show，指令以v-开头，否则视为属性绑定
         */
        openCondExprView (arrowEl, tagName, conditionProp) {
            this.bindingPropView = 'set-binding-prop'
            this.bindingPropVisible = true
            this.bindingPropArrowEl = arrowEl
            this.bindingPropTagName = tagName
            this.bindingConditionProp = conditionProp
        }
    },
    created () {
        const envDD = {
            '1': 'web',
            '2': 'app'
        }

        this.env = envDD[this.$route.query.applyType || '1']
        this.modelId = this.$route.query.moduleId
        this.pageId = this.$route.query.pageId
        // 收集主键id，可能存在有多个的情况，在线表单通过获取url的对应的主键名称值
        this.primaryKeys = []
        // 业务主表名称，后端返回的业务数据包裹了这层
        this.masterTableCode = ''
        // 根据this.dataModel解析来的对象，在online-form作为model使用
        this.vmDataModel = {}
        this.formName = this.$route.query.formName

        const LayoutTextDD = {
            'online-form': '在线表单设计',
            'flow-form': '在线流程表单设计',
            'online-list': '在线列表设计'
        }
        const layout = this.$route.query.layout
        let title = LayoutTextDD[layout]
        if (this.formName) {
            title += '-' + this.formName
        }
        this.$setTitle(title)

        if (this.$route.query.readonly === 'true') {
            this.btnsDisabled = true
        } else {
            this.btnsDisabled = false
        }

        // 获取数据模型数据成功后的执行队列
        this.dataModelSuccessQueue = []
        this.isDataModelSuccess = false
        this.getDataModel()

        this.defaultMixinCode = [
            '{',
            '   // 定义data变量',
            '   data: function () {',
            '       return {}',
            '   },',
            '   // 定义计算属性',
            '   computed: {',
            '   },',
            '   // 自定义方法，用于绑定组件事件',
            '   methods: {',
            '   },',
            '   // 初始化方法',
            '   created: function () {',
            '   },',
            '   mounted: function () {',
            '   }',
            '}'].join('\n')
    },
    mounted () {
        const layout = this.$route.query.layout
        if (!this.$route.query.layout) {
            console.log('缺少参数layout')
        }

        // layout this.env
        LayoutProxy(layout, this.env, (Layout) => {
            this.preview = new Layout({
                previewEl: this.$refs.preview,
                pageId: this.$route.query.pageId,
                moduleId: this.modelId,
                appCode: this.$route.query.appCode,
                title: decodeURIComponent(this.$route.query.formName || '')
            }, this, (attrs) => {
                this.layoutAttrs = attrs
                this.layout = layout

                // 添加快照
                this.records.push(JSON.stringify({
                    attrs,
                    activateVnodeGuid: ''
                }))
            })
            this.modelNo && (this.preview.modelNo = this.modelNo)
        })
    }
}
</script>

<style>
.collapses-draggable-wrap{
    min-height:40px;
}
.engine-option-item{
    display:flex;
}
</style>