<template>
    <el-input 
        type="textarea"
        :rows="vnode.attrs.rows || 2"
        v-model="vnode.attrs.value"></el-input>
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
                        attrs: {}
                    }
                }
            }
        }
    }
</script>
