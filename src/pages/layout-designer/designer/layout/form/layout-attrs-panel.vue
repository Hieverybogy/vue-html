<template>
    <div class="drag-option">
        <div class="item">
            <div class="title must-star">页面标题</div>
            <div class="value" ref="pageTitle">
                <el-input v-model="layoutAttrs.title" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">表单布局</div>
            <div class="value">
                <el-radio-group v-model="layoutAttrs.doubleColumns" @change="addRecord">
                    <el-radio :label="false">单列</el-radio>
                    <el-radio :label="true">双列</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="item">
            <div class="title">宽度（width）</div>
            <div class="value">
                <el-input v-model="layoutAttrs.dialogOption.width" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">高度（top）</div>
            <div class="value">
                <el-input v-model="layoutAttrs.dialogOption.top" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item" v-if="false">
            <div class="title">初始化api</div>
            <div class="value">
                <el-input v-model="layoutAttrs.dialogOption.top"></el-input>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    inject: ['ueditor'],
    props: {
        layoutAttrs: {
            type: Object,
            default () {
                return {
                    dialogOption: {}
                }
            }
        }
    },
    data () {
        return {
            activeName: 'base'
        }
    },
    methods: {
        addRecord () {
            this.ueditor.addRecord()
        }
    },
    created () {
        this.$root.layoutAttrsPanel = this
    }
}
</script>
