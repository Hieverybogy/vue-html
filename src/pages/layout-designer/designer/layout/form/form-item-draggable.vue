<template>
    <draggable-wrap :vnode="vnode" :index="index">
        <component v-if="vnode.noUseFormItem" :is="vnode.type ? vnode.type + '-place': ''" :vnode="vnode"></component>

        <sapi-form-item 
            v-if="!vnode.noUseFormItem"
            :label="vnode.label" 
            :prop="vnode.guid">
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
