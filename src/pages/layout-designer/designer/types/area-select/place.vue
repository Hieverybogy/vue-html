<template>
    <sapi-area-multiple ref="areaSelect"
        :type="vnode.attrs.type" 
        :multiple="vnode.attrs.multiple"
        :limit="vnode.attrs.limit" 
        :readonly="vnode.attrs.readonly"></sapi-area-multiple>
</template>

<script>
    import sapiAreaMultiple from '@/components/sapi-area-multiple.vue'
    import PlaceMixin from '../place-mixin'
    export default {
        mixins: [PlaceMixin],
        props: {
            vnode: {
                type: Object,
                default() {
                    return {
                        attrs: {}
                    }
                }
            },
            list: []
        },
        components: {
            sapiAreaMultiple
        },
        watch: {
            'vnode.attrs.type'(val) {
                this.$refs.areaSelect.clear();
            },
            'vnode.attrs.multiple'(val) {
                this.$refs.areaSelect.clear();
            },
        }
    }
</script>