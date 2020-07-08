<template>
    <sapi-list-layout class="list-edit-preview">
        <template v-if="attrs.slots.filters.visible" slot="filters">
            <el-form 
                ref="filtersForm"
                class="sapi-list-filters-preview-wrap"
                :model="model"
                :rules="rules"
                label-position="left"
                label-width="auto">
                <draggable 
                    @add="handleFiltersAdd(attrs.slots.filters.vnodes, $event)"
                    :list="attrs.slots.filters.vnodes"
                    class="sapi-list-filters-fields-warp"
                    @change="draglistChange"
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

        <template v-if="attrs.slots.moreFilters.visible" slot="filters-more">
            <draggable 
                @add="handleFiltersAdd(attrs.slots.moreFilters.vnodes, $event)"
                :list="attrs.slots.moreFilters.vnodes"
                class="sapi-list-morefilters-fields-warp"
                :move="moveFilterMoreValidate"
                @change="draglistChange"
                :class="{
                    'filter-vnode-empty': attrs.slots.moreFilters.vnodes.length === 0
                }"
                :options="{group:'widget', ghostClass: 'ghost', swapThreshold:0.5, animation: 100}">
                <template v-for="(vnode, i) in attrs.slots.moreFilters.vnodes">
                    <filter-item-draggable
                        :key="vnode.guid" 
                        :vnode="vnode" :index="i"></filter-item-draggable>
                </template>
            </draggable>
        </template>

        <template v-if="attrs.slots.btns.visible" slot="btns">
            <template v-for="(vnode, i) in attrs.slots.btns.vnodes">
                <el-button :key="vnode.type" v-if="vnode.usage" size="small" 
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

        <template slot="pagination" v-if="attrs.slots.table.vnode.pagination">
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
import './base.less'
import FilterItemDraggable from './filter-item-draggable.vue'
import DraggableWrap from '../../components/draggable-wrap.vue'
import draggable from '../../components/draggable.js'
import ListTablePlace from '../../types/list-table/place.vue'
import { table } from '@/static/js/baseInit.js';
import Types from './types.js'

export default {
    components: {
        FilterItemDraggable,
        DraggableWrap,
        draggable,
        'listTable-place': ListTablePlace
    },
    mixins: [table],
    provide () {
        return {
            preview: this,
            ueditor: this.ueditor,
            draggable: {}
        }
    },
    props: {
        // 配置节点信息
        attrs: {
            type: Object,
            default () {
                return {
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
                }
            }
        },
        // 最外层的web-ueditor组件
        ueditor: Object,
        // 提交数据的接口
        postData: Function,
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            model: {},
            rules: {},
            tableRules: {},
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
        value(val) {
            this.visible = this.value;
        },
        valid (val) {
            if (val) {
                this.pageValid = false
                this.filtersValid = false
                this.listTableValid = false
                if (this.$utils.isFunction(this.postData)) {
                    this.postData()
                }
            }
        },
        'attrs.slots.moreFilters.visible' () {
            this.$nextTick(function () {
                this.$root.$emit('update-filters-more-visible')
            })
        }
    },
    methods: {
        pageSizeChange () {},
        pageCurrentChange () {},
        handleFiltersAdd (list, event) {
            const typeObj = list[event.newIndex]
            const newVnode = Types[typeObj.type].create({ model: 'params' }, null, this.attrs)

            this.setRule(newVnode)
            this.$set(list, event.newIndex, newVnode)
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
                    if (!vnode.fieldId && !vnode.isNoNeedFieldId) {   // 当不需要绑定字段时，加上isNoNeedFieldId字段
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
            let validator = Types[vnode.type].getValidator(vnode, null, this.attrs)

            if (!validator) {
                validator = getValidator(vnode)
            }
            
            if (Types[vnode.type].category === 'base' ||
                Types[vnode.type].category === 'enhance') {
                const rule = {
                    type: Object,
                    required: false,
                    validator: validator,
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

                            // if (columns[i].isLink && columns[i].linkType === 'custom') {
                            //     if (!columns[i].linkDirectory) {
                            //         errorMsg += `${columns[i].fieldName}文件目录不能为空;`
                            //     }
                            //     if (!columns[i].linkPath) {
                            //         errorMsg += `${columns[i].fieldName}路由全路径不能为空;`
                            //     }
                            // }

                            // if (columns[i].useMatch === 'method' && !columns[i].matchMethod) {
                            //     errorMsg += `${columns[i].fieldName}未选择匹配方法;`
                            // }

                            // if (columns[i].useMatch === 'dataSource' &&
                            //     (!columns[i].matchOptions || columns[i].matchOptions.length === 0)) {
                            //     errorMsg += `${columns[i].fieldName}未添加匹配数据源;`
                            // }
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
        draglistChange () {
            this.$nextTick(function () {
                this.ueditor.addRecord()
            })
        },
        moveFilterMoreValidate (evt) {
            if (evt.to && evt.to.className.indexOf('sapi-list-morefilters-fields-warp') > -1) {
                return true
            }

            return false
        }
    },
    created () {
        this.setTableRule()
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
        !this.readonly && this.ueditor.$root.$on('validate-preview-field', this.validatePreviewField)
    },
    beforeDestroy () {
        !this.readonly && this.ueditor.$root.$off('validate-preview-field', this.validatePreviewField)
    }
}
</script>
