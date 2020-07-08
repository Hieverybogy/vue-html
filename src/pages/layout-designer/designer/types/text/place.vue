<template>
    <el-input 
        :value="vnode.attrs && vnode.attrs.value || ''" v-bind="vnode.attrs"></el-input>
</template>

<script>
    import PlaceMixin from '../place-mixin'
    export default {
        mixins: [PlaceMixin],
        props: {
            vnode: {
                type: Object,
                default () {
                    return {
                        attrs: { value: '' }
                    }
                }
            }
        }
    }
</script>
