<template>
    <component 
        :is="vnode && vnode.type ? vnode.type + '-attrs' : ''" 
        :vnode="vnode"
        :data-model="dataModel" 
        :layout="layout"
        :layout-attrs="layoutAttrs"></component>
</template>

<script>
import { TypesAttrs } from '../../types/index.js'
export default {
    components: TypesAttrs,
    props: {
        vnode: {
            type: Object,
            default () {
                return {}
            }
        },
        dataModel: {
            type: Array,
            default () {
                return []
            }
        },
        layout: {
            type: String,
            default: 'form'
        },
        layoutAttrs: {
            type: Object,
            default () {
                return {}
            }
        }
    }
}
</script>
