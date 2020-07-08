<template>
    <el-input 
        class="sapi-filter-search"
        :maxlength="vnode.attrs.maxlength"  
        :placeholder="vnode.attrs.placeholder" 
        :title="vnode.attrs.title" 
        @keydown.enter.native="$emit('submit')" clearable>
        <el-button size="small" slot="append" icon="el-icon-search" @click="$emit('submit')"></el-button>
    </el-input>
</template>

<script>
    export default {
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
