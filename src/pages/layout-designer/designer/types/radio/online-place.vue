<template>
    <el-radio-group @change="filterChange" v-model="vnode.attrs.value">
        <el-radio :key='index' :label='item.value' 
            v-for='(item, index) in vnode.options'>{{item.label}}</el-radio>
    </el-radio-group>
</template>

<script>
    export default {
        inject: ['list'],
        props: {
            vnode: {
                type: Object,
                default () {
                    return {
                        attrs: {}
                    }
                }
            },
            params: Object
        },
        methods: {
            filterChange (data) {
                this.params[this.vnode.fieldId] = data
               
                this.list.loadData()
            }
        }
    }
</script>
