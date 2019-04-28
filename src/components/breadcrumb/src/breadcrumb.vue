<template>
    <div class="zs-breadcrumb">
        <span class="zs-breadcrumb__item"><i class="zs-icon-local"></i></span>
        <slot></slot>
    </div>
</template>
<script>
    export default {
        name: 'ZsBreadcrumb',

        props: {
            separator: {
                type: String,
                default: '>'
            }
        }
    };
</script>
<style lang="less">
    .zs-icon-local{
        width: 15px;
        height: 17px;
        background: url('./home_icon_location.png');
        background-size: 100% 100%;
        vertical-align: middle !important;
        margin-right: 6px;
        margin-top: -2px;
    }
</style>