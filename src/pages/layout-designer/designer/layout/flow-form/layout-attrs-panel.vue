<template>
    <div class="drag-option">
        <el-collapse :value="activeName">
            <el-collapse-item title="基本设置" name="1">
                <div class="item">
                    <div class="title">页面标题</div>
                    <div class="value" ref="pageTitle">
                        <el-input v-model="layoutAttrs.title" @change="addRecord"></el-input>
                    </div>
                </div>
                <!-- <div class="item">
                    <div class="title">表单布局</div>
                    <div class="value">
                        <el-radio-group v-model="layoutAttrs.doubleColumns" @change="addRecord">
                            <el-radio :label="false">单列</el-radio>
                            <el-radio :label="true">双列</el-radio>
                        </el-radio-group>
                    </div>
                </div> -->
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
            </el-collapse-item>
            <el-collapse-item title="高级设置" name="2">
                <div class="item">
                    <el-button @click="openDrawer" size="small" style="width:100%">编码</el-button>
                </div>
            </el-collapse-item>
        </el-collapse>
        
        <code-drawer :size="'100%'"
            append-to-body
            :visible.sync="drawerVisible"></code-drawer>
    </div>
</template>

<script>
import CodeDrawer from './code-drawer'
export default {
    inject: ['ueditor'],
    components: {
        CodeDrawer
    },
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
            activeName: ['1', '2'],
            drawerVisible: false
        }
    },
    methods: {
        addRecord () {
            this.ueditor.addRecord()
        },
        openDrawer () {
            this.drawerVisible = true
        }
    },
    created () {
        this.$root.layoutAttrsPanel = this
    }
}
</script>
