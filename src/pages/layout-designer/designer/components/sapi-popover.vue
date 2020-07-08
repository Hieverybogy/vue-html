<template>
    <el-popover
        ref="popover"
        :transition="transition"
        :placement="placement"
        :width="width"
        :trigger="trigger"
        :title="title"
        :popper-class="'sapi-popover ' + (titleBottomBorderVisible ? 'el-popover__title-border-bottom ' : '') + popperClass"
        @after-enter="$emit('after-enter')"
        @hide="popoverHide">
        <i class="el-icon-close" @click="popoverHide" title="关闭"></i>

        <slot></slot>

        <div v-if="footerVisible" class="sapi-popover-footer">
            <el-button size="mini" @click="popoverHide">关闭</el-button>
            <el-button type="primary" size="mini" @click="$emit('confirm')">确定</el-button>
        </div>
    </el-popover>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        placement: {
            type: String,
            default: 'left-start'
        },
        width: {
            type: Number,
            default: 500
        },
        trigger: {
            type: String,
            default: 'click'

        },
        reference: {
            validator: function (el) {
                if (el && el.nodeType === 1) {
                    return true
                }
                return false
            },
            required: true
        },
        popperClass: String,
        transition: {
            type: String,
            default: 'el-fade-in'
        },
        title: String,
        footerVisible: {
            type: Boolean,
            default: true
        },
        titleBottomBorderVisible: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        value (val) {
            if (val) {
                this.show()
            } else {
                this.hide()
            }
        }
    },
    methods: {
        show () {
            if (this.$refs.popover) {
                this.popover = this.$refs.popover
                this.popover.referenceElm = this.popover.$refs.reference = this.reference
                this.popover.doShow()
            }
        },
        popoverHide () {
            this.$emit('input', false)
            this.$emit('close')
        },
        hide () {
            if (this.$refs.popover) {
                this.popover.doClose()
            }
        }
    },
    mounted () {
        if (this.value) {
            this.show()
        }
    },
    beforeDestroy (){
        if (this.$refs.popover) {
            this.popover.doDestroy(true)
        }
    }
}
</script>

<style lang="less">
@import '~@/static/css/sapi-variables.less';
.sapi-popover{
    padding: 0;
    padding-top: 10px;
    padding-bottom: 8px;

    .el-popover__title{
        text-align: center;
        font-size: 14px;
        padding-bottom: 10px;
        margin-bottom: 0;
    }

    .el-icon-close{
        position:absolute;
        right: 10px;
        top: 10px;
        font-size: 16px;
        cursor: pointer;
        color: #222;
        &:hover{
            background-color:#f1f1f1;
        }
    }
    .sapi-popover-footer{
        text-align:center;
        padding-top: 8px;
        border-top: 1px solid #F2F6FC;
    }
}
.el-popover__title-border-bottom .el-popover__title{
    border-bottom: 1px solid @--border-color-extra-light;
}
</style>