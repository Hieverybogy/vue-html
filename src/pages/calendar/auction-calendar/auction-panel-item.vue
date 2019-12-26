<template>
    <div class="auction-panel-item">
        <div class="auction-panel-item_left" :style="leftStyle" v-if="$slots['left']">
            <slot name="left"></slot>
        </div>
        <div class="auction-panel-item_main" :style="mainStyle">
            <slot></slot>
        </div>
        <div class="auction-panel-item_right" :style="rightStyle" v-if="$slots['right']">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'auction-panel-item',
        props: {
            leftStyle: {
                type: Object,
                default () {
                    return {}
                }
            },
            mainStyle: {
                type: Object,
                default () {
                    return {}
                }
            },
            rightStyle: {
                type: Object,
                default () {
                    return {}
                }
            }
        }
    }
</script>

<style lang="less">
    .auction-panel-item{
        margin: 10px 0;
        box-sizing:border-box;
        background-color:#FFF;
        display: flex;
        align-items:center;
        min-height:60px;
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.15);
        border-radius: 4px;
    }
</style>
