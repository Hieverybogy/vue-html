<template>
    <draggable-wrap :vnode="vnode" :index="index">
        <sapi-form-item 
            :label="vnode.label" 
            :prop="vnode.guid"
            :label-width="vnode.type === 'detail' ? 'auto': '120px'">
            <component :is="vnode.type ? vnode.type + '-place': ''" :vnode="vnode"></component>
        </sapi-form-item>
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
    },
    watch: {
        'vnode.required': {
            handler (required) {
                const rule = this.preview.rules[this.vnode.guid]
                if (rule) {
                    rule.required = typeof required === 'boolean' ? required : false
                }
            },
            immediate: true
        }
    }
}
</script>
