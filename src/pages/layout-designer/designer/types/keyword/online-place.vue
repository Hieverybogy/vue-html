<template>
    <el-input :maxlength="vnode.attrs.maxlength"  
        :placeholder="vnode.attrs.placeholder"
        v-model="params[vnode.fieldId]" 
        @keydown.enter.native="filterChange" clearable>
        <el-button size="small" slot="append" icon="el-icon-search" @click="filterChange"></el-button>
    </el-input>
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
            filterChange () {
                this.list.loadData()
            }
        }
    }
</script>
