<template>
    <el-radio-group :value="vnode.attrs.value">
        <el-radio :key='index' :label='item.value' 
            v-for='(item, index) in vnode.options'>{{item.label}}</el-radio>
    </el-radio-group>
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
