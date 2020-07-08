<template>
    <div class="drag-option">
        <div class="item">
            <div class="title must-star">绑定参数字段</div>
            <div class="value">
                <el-input v-model="vnode.fieldId" @change="changeFieldId"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">点击节点的时候展开或者收缩节点</div>
            <div class="value">
                <el-checkbox v-model="vnode.attrs.expandOnClickNode" @change="addRecord">是</el-checkbox>
            </div>
        </div>
        <div class="item">
            <div class="title">只保持一个顶层节点展开</div>
            <div class="value">
                <el-checkbox v-model="vnode.attrs.uniqueOpened" @change="addRecord">是</el-checkbox>
            </div>
        </div>
        <div class="item">
            <div class="title must-star">绑定数据源</div>
            <div class="value">
                <el-button size="mini" @click="setDataSource">设置</el-button>
            </div>
        </div>
        <div v-transfer-dom>
            <component
                :is="view"
                v-model="settingVisible"
                :option="currentOption"
                :type="vnode.type"
                @callback="callback"
            ></component>
        </div>
    </div>
</template>
<script>
import typeMixin from '../type-mixin.js'
import optionsMixin from '../options-mixin.js'
export default {
    mixins: [typeMixin, optionsMixin],
    methods: {
        changeFieldId () {
            this.addRecord()
            // 改变需要取消校验信息
            this.$root.$emit('validate-preview-field', this.vnode)
        }
    }
}
</script>
