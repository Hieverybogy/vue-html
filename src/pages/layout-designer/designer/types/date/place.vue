<template>
    <div>
        <el-date-picker 
            v-show="vnode.attrs.multiType === 1"
            v-model="value"
            :type="vnode.attrs.type" 
            :readonly="vnode.attrs.readonly" 
            :placeholder="vnode.attrs.placeholder" 
            :format="vnode.attrs.format"></el-date-picker>
        <el-date-picker
            v-show="vnode.attrs.multiType === 2"
            v-model="value1"
            :type="vnode.attrs.type2" 
            range-separator="至"
            :start-placeholder="vnode.attrs.placeholder1"
            :end-placeholder="vnode.attrs.placeholder2"></el-date-picker>
    </div>
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
        },
        data() {
            return {
                value: '',
                value1: ''
            }
        },
        watch: {
            value(val) {
                console.log(111, val)
            },
            value1(val) {
                console.log(222, val)
            }
        }
    }
</script>
