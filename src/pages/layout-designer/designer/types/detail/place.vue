<template>
    <div>
        <el-table class="common-table " :data="dataList" empty-text="请右侧选择添加列设置子表">
            <el-table-column 
                key="selection"
                v-if="!vnode.useOperateColumn && (vnode.canEdit || vnode.canDelete)"
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column v-for="(columnVnode, index) in vnode.columns" 
                :key="index" 
                :label="columnVnode.label"
                :prop="columnVnode.fieldId"
                :width="columnVnode.width"
                :fixed="columnVnode.fixed"
                :align="columnVnode.align"
                :header-align="columnVnode.headerAlign"
                :show-overflow-tooltip="columnVnode.showOverflowTooltip">
                <template slot-scope="scope">
                    <draggable-wrap class="sapi-detial-draggable-wrap" 
                        :key="index"
                        :vnode="columnVnode" 
                        :use-copy-btn="false"
                        :use-delete-btn="false"
                        :columns-length="vnode.columns.length"
                        :index="index"
                        @move-up="moveColumnLeft"
                        @move-down="moveColumnRight">
                        <component :is="vnode.columns[index].vnode.type ? vnode.columns[index].vnode.type + '-place': ''" 
                            :vnode="vnode.columns[index].vnode" :parent-vnode="vnode"></component>
                    </draggable-wrap>
                </template>
            </el-table-column>
            <el-table-column key="operation" v-if="dataList.length > 0 && vnode.useOperateColumn" 
                fixed="right" label="操作" width="60">
                <template>
                    <a v-if="vnode.canDelete" href="javascript:void(0)">删除</a>
                </template>
            </el-table-column>
        </el-table>
        <div class="common-table__bottom-btn" v-if="vnode.canAdd">
            <span>
                <i class="el-icon-circle-plus"></i>
                {{vnode.addBtnName}}
            </span>
        </div>
    </div>
</template>

<script>
import { TypesPlaces } from '../../types/index.js'
import DraggableWrap from '../../components/draggable-wrap.vue'
import PlaceMixin from '../place-mixin'
export default {
    mixins: [PlaceMixin],
    inject: ['ueditor'],
    components: {
        DraggableWrap,
        ...TypesPlaces
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
                row[vnode.fieldId] = vnode.guid
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
