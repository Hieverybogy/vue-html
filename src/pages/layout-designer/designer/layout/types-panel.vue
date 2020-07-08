<template>
    <component :is="layout ? (layout + '-types-' + env): ''" :layout="layout"></component>
</template>

<script>
export default {
    props: {
        layout: String,
        env: String
    },
    components: {
        'form-types-web': () => import('./form/types-panel.vue'),
        'list-types-web': () => import('./list/types-panel.vue'),
        'tree-list-types-web': () => import('./tree-list/types-panel.vue'),
        'online-form-types-web': () => import('./online-form/types-panel.vue'),
        'flow-form-types-web': () => import('./flow-form/types-panel.vue'),
        'online-list-types-web': () => import('./online-list/types-panel.vue'),
    }
}
</script>
