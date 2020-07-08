<template>
    <el-input readonly placeholder="组件占位符"></el-input>
</template>

<script>
    export default {
        props: {
            vnode: {
                type: Object,
                default () {
                    return {
                    }
                }
            }
        }
    }
</script>
