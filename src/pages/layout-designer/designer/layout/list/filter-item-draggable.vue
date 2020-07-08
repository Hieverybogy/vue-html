<template>
    <draggable-wrap :vnode="vnode" 
        :use-copy-btn="vnode.type === 'keyword' ? false : true"
        :index="index">
        <el-form-item 
            :label="vnode.label" 
            :prop="vnode.guid">
            <component :is="vnode.type ? vnode.type + '-place': ''" :vnode="vnode"></component>
        </el-form-item>
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
