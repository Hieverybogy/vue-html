<template>
    <el-table border 
        class="common-table sapi-preview-list-table" 
        :default-sort="{prop: vnode.defaultSortName, order: vnode.defaultSortType}"
        :data="dataList" empty-text="选中后右侧选择添加列">
        <el-table-column 
            key="selection"
            type="selection"
            v-if="vnode.columns.length > 0"
            width="55">
        </el-table-column>
        <el-table-column v-for="(columnVnode, index) in vnode.columns" 
            :key="index" 
            :label="columnVnode.label"
            :width="columnVnode.width"
            :sortable="columnVnode.sortable"
            :prop="columnVnode.fieldId"
            :show-overflow-tooltip="columnVnode.useTips">
            <template slot-scope="scope">
                <draggable-wrap 
                    :key="scope.$index"
                    :vnode="vnode.columns[index]" 
                    :parent-vnode="vnode"
                    :use-copy-btn="false"
                    :use-delete-btn="false"
                    :columns-length="vnode.columns.length"
                    :index="index"
                    @move-up="moveColumnLeft"
                    @move-down="moveColumnRight">
                    <column-text-place :vnode="vnode.columns[index]"></column-text-place>
                </draggable-wrap>
            </template>
        </el-table-column>
        <el-table-column v-if="vnode.useOperationColumn && vnode.columns.length > 0"
            key="operationColumn"
            :label="vnode.operationColumnConfig.label"
            :width="vnode.operationColumnConfig.width"
            fixed="right">
            <template>
                <a v-for="btn in vnode.operationColumnConfig.btns"
                    v-show="btn.useable"
                    :key="btn.text"
                    class="table-btn"
                    href="javascript:void(0)">
                    {{btn.text}}
                </a>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import DraggableWrap from '../../components/draggable-wrap.vue'
import ColumnTextPlace from './column-text-place'
export default {
    inject: ['ueditor'],
    components: {
        DraggableWrap,
        ColumnTextPlace
    },
    props: {
        vnode: {
            type: Object,
            default () {
                return {
                    columns: []
                }
            }
        }
    },
    data () {
        return {
            refreshDataList: false
        }
    },
    computed: {
        dataList () {
            this.refreshDataList = false
            if (this.vnode.columns.length === 0) {
                return []
            }

            const row = {}
            this.vnode.columns.forEach((vnode) => {
                row[vnode.fieldId] = vnode.type
            })

            return [row]
        }
    },
    watch: {
        vnode: {
            handler () {
                this.refreshDataList = true
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        setActivateVnode (vnode) {
            this.ueditor.activateVnode = vnode
        },
        formatDate (cvnode) {
            return this.$utils.formatDate(new Date(), cvnode.format)
        },
        formatNumber (cvnode) {
            if (cvnode.dataType === 'int') {
                if (cvnode.format === 'normal') {
                    return 10000
                } else {
                    return this.$utils.toThousands(10000, 0)
                }
            } else {
                if (cvnode.format === 'normal') {
                    return parseFloat(10000).toFixed(cvnode.place)
                } else {
                    return this.$utils.toThousands(10000, cvnode.place)
                }
            }
        },
        getColumnVnodeText (cvnode) {
            if (cvnode.dataType === 'text' || cvnode.dataType === 'textarea') {
                return cvnode.label || '请设置表头名称'
            } else if (cvnode.dataType === 'int' || cvnode.dataType === 'float') {
                return this.formatNumber(cvnode)
            } else if (cvnode.dataType === 'date') {
                return this.formatDate(cvnode)
            }
        },
        moveColumnLeft (index) {
            const list = this.vnode.columns
            const currVnode = list[index]
            const prevVnode = list[index - 1]

            this.$set(list, index - 1, currVnode)
            this.$set(list, index, prevVnode)
        },
        moveColumnRight (index) {
            const list = this.vnode.columns
            const currVnode = list[index]
            const nextVnode = list[index + 1]

            this.$set(list, index, nextVnode)
            this.$set(list, index + 1, currVnode)
        }
    }
}
</script>
