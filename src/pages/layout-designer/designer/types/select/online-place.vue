<template>
    <el-select v-model="val" @change="filterChange">
        <el-option :disabled='item.disabled' 
            :key='index' :label='item.label' 
            :value='item.value' 
            v-for='(item, index) in vnode.options'></el-option>
    </el-select>
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
        data() {
            return {
                val: ''
            }
        },
        methods: {
            filterChange (data) {
                this.params[this.vnode.fieldId] = data
               
                this.list.loadData()
            }
        }
    }
</script>
