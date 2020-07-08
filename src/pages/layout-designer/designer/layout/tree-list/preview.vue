<template>
    <sapi-list-layout
        :left-side-title="attrs.title"
        layout="sapi-tree-layout"
        class="tree-list-edit-preview"
        content-visible
        v-cloak
    >
        <template v-if="attrs.slots.filters.visible" slot="filters">
            <el-form
                ref="filtersForm"
                class="sapi-list-filters-preview-wrap"
                :model="model"
                :rules="rules"
                label-position="left"
                label-width="100px"
            >
                <draggable
                    @add="handleFiltersAdd(attrs.slots.filters.vnodes, $event)"
                    :list="attrs.slots.filters.vnodes"
                    class="sapi-list-filters-fields-warp"
                    @change="draglistChange"
                    :class="{
                        'filter-vnode-empty': attrs.slots.filters.vnodes.length === 0
                    }"
                    :options="{group:'widget', ghostClass: 'ghost', swapThreshold:0.5, animation: 100}"
                >
                    <template v-for="(vnode, i) in attrs.slots.filters.vnodes">
                        <filter-item-draggable :key="vnode.guid" :vnode="vnode" :index="i"></filter-item-draggable>
                    </template>
                </draggable>
            </el-form>
        </template>

        <template slot="left-side" v-if="attrs.slots.leftSide.visible">
            <el-form
                class="sapi-left-side-preview-wrap"
                :rules="treeRules"
                :model="model"
                ref="treeFrom"
            >
                <el-form-item :prop="attrs.slots.leftSide.vnode.guid">
                    <draggable-wrap
                        :use-btns="false"
                        class="collapses-outer-draggable-wrap"
                        :vnode="attrs.slots.leftSide.vnode"
                    >
                        <tree-place :vnode="attrs.slots.leftSide.vnode" />
                    </draggable-wrap>
                </el-form-item>
            </el-form>
        </template>

        <sapi-right-list slot="right-side" v-if="attrs.slots.table.visible">
            <template v-if="attrs.slots.btns.visible" slot="btns">
                <template v-for="(vnode, i) in attrs.slots.btns.vnodes">
                    <el-button
                        :key="vnode.type"
                        size="small"
                        :type="i === 0 ? 'primary': ''"
                    >{{vnode.text}}</el-button>
                </template>
            </template>

            <template slot="table">
                <el-form
                    class="sapi-list-table-preview-wrap"
                    ref="listTableForm"
                    :model="model"
                    :class=" {
                    'list-table-valid-success': listTableValidSuccess
                }"
                    :rules="tableRules"
                >
                    <el-form-item :prop="attrs.slots.table.vnode.guid">
                        <draggable-wrap
                            :use-btns="false"
                            class="collapses-outer-draggable-wrap"
                            :vnode="attrs.slots.table.vnode"
                        >
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
                    :total="pageTotal"
                ></el-pagination>
            </template>
        </sapi-right-list>
    </sapi-list-layout>
</template>
<script>
import { table } from '@/static/js/baseInit.js'
import Types from './types.js'
import draggable from '../../components/draggable.js'
import DraggableWrap from '../../components/draggable-wrap.vue'
import FilterItemDraggable from './filter-item-draggable.vue'
import ListTablePlace from '../../types/list-table/place.vue'
import TreePlace from '../../types/stru-tree/place.vue'

export default {
    components: {
        FilterItemDraggable,
        ListTablePlace,
        draggable,
        DraggableWrap,
        TreePlace
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
        attrs: {
            type: Object,
            required: true
        },
        // 最外层的web-ueditor组件
        ueditor: {
            type: Object,
            required: true
        },
        // 提交数据的接口
        postData: {
            type: Function,
            required: true
        }
    },
    data () {
        return {
            model: {},
            rules: {},
            tableRules: {},
            treeRules: {},
            treeModel: {},
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
            treeValid: false,
            listTableValidSuccess: true,
            treeValidSuccess: false
        }
    },
    computed: {
        valid () {
            return this.pageValid && this.filtersValid && this.listTableValid && this.treeValidSuccess
        }
    },
    watch: {
        value (val) {
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
        'attrs.slots.leftSide.vnode': function (vnode) {
            this.setTreeRule(vnode)
        },
        'attrs.slots.table.vnode': function (vnode) {
            this.setTableRule(vnode)
        }
    },
    methods: {
        handleFiltersAdd (list, event) {
            const typeObj = list[event.newIndex]
            const newVnode = Types[typeObj.type].create({ model: 'params' }, null, this.attrs)

            this.setRule(newVnode)
            this.$set(list, event.newIndex, newVnode)
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
        draglistChange () {
            this.$nextTick(this.ueditor.addRecord)
        },
        setTableRule (vnode) {
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
            const rule = {
                type: Object,
                required: false,
                validator: getValidator(vnode),
                trigger: ['change', 'blur']
            }
            this.tableRules = {}
            this.$set(this.tableRules, vnode.guid, rule)
        },
        setTreeRule (vnode) {
            this.treeRules = {}
            const rule = {
                type: Object,
                required: false,
                validator: Types[vnode.type].getValidator(vnode),
                trigger: ['change', 'blur']
            }

            this.$set(this.treeRules, vnode.guid, rule)
        }
    },
    mounted () {
        const that = this
        this.validatePreviewField = function (vnode) {
            if (vnode.type === 'listTable' || vnode.type === 'listTableColumn') {
                that.$refs.listTableForm.validate((valid) => {
                    that.listTableValidSuccess = valid
                })
            } else if (vnode.type === 'struTree') {
                that.$refs.treeFrom.validate((valid) => {
                    that.treeValidSuccess = valid
                })
            } else {
                that.$refs.filtersForm.validateField(vnode.guid)
            }
        }
        this.ueditor.$root.$on('validate-preview-field', this.validatePreviewField)
    },
    beforeDestroy () {
        this.ueditor.$root.$off('validate-preview-field', this.validatePreviewField)
    }
}
</script>
<style lang="less">
.tree-list-edit-preview {
    .left-side-tips {
        text-align: center;
        color: #909399;
    }

    .sapi-left-side-preview-wrap {
        margin-top: 22px;
        .el-form-item__error {
            top: -20px;
            z-index: 3;
        }
    }
}
</style>
