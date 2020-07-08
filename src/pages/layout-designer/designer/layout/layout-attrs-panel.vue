<template>
    <component :is="layout ? layout + '-attrs' : '' "
        :layout-attrs="layoutAttrs"></component>
</template>

<script>
// 页面级属性设置
export default {
    props: {
        layout: String,
        layoutAttrs: {
            type: Object,
            default () {
                return {
                    slots: {}
                }
            }
        }
    },
    components: {
        'form-attrs': () => import('./form/layout-attrs-panel.vue'),
        'list-attrs': () => import('./list/layout-attrs-panel.vue'),
        'tree-list-attrs': () => import('./tree-list/layout-attrs-panel.vue'),
        'online-form-attrs': () => import('./online-form/layout-attrs-panel'),
        'flow-form-attrs': () => import('./flow-form/layout-attrs-panel'),
        'online-list-attrs': () => import('./online-list/layout-attrs-panel')
    }
}
</script>
