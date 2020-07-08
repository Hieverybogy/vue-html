<template>
    <draggable-wrap :vnode="vnode" 
        :use-copy-btn="vnode.type === 'keyword' ? false : true"
        :index="index">
        <!-- <el-form-item 
            :prop="vnode.guid"> -->
            <sapi-filter-item :label="vnode.label">
                <component :is="vnode.type ? vnode.type + '-place': ''" :vnode="vnode"></component>
            </sapi-filter-item>
        <!-- </el-form-item> -->
    </draggable-wrap>
</template>

<script>
import DraggableWrap from '../../components/draggable-wrap.vue'
import { TypesPlaces } from '../../types/index.js'

export default {
    components: {
        DraggableWrap,
        ...TypesPlaces
    },
    inject: ['preview'],
    props: {
        vnode: {
            type: Object,
            default () {
                return {}
            }
        },
        index: Number
    }
}
</script>
