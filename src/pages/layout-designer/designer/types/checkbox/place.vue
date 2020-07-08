<template>
    <el-checkbox-group :value="vnode.attrs.value">
        <el-checkbox :key='index' :label='item.value' 
            v-for='(item, index) in vnode.options'>{{item.label}}</el-checkbox>
    </el-checkbox-group>
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
