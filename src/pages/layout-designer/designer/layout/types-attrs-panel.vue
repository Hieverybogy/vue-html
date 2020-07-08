<template>
    <component 
        :is="layout ? layout + '-types-attrs-panel' : ''"
        v-bind="$props"></component>
</template>

<script>
// import { TypesAttrs } from '../types/index.js'
export default {
    components: {
        'form-types-attrs-panel': () => import('./form/types-attrs-panel'),
        'list-types-attrs-panel': () => import('./list/types-attrs-panel'),
        'tree-list-types-attrs-panel': () => import('./tree-list/types-attrs-panel'),
        'online-form-types-attrs-panel': () => import('./online-form/types-attrs-panel'),
        'flow-form-types-attrs-panel': () => import('./flow-form/types-attrs-panel'),
        'online-list-types-attrs-panel': () => import('./online-list/types-attrs-panel'),
    },
    props: {
        vnode: {
            type: Object,
            default () {
                return {}
            }
        },
        parentVnode: {
            validator () {
                return true
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
