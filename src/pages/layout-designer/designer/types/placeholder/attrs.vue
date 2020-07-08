<template>
    <div class="drag-option">
        <div v-if="!inTableColumn" class="item">
            <div class="title must-star">显示标题</div>
            <div class="value">
                <el-input v-model="vnode.label" @change="addRecord"></el-input>
            </div>
        </div>
        <div v-if="!inListLayout && !inTableColumn && layoutAttrs.doubleColumns" class="item">
            <div class="title">布局</div>
            <div class="value">
                <el-checkbox v-model="vnode.fullline" @change="addRecord">占据整行</el-checkbox>
            </div>
            <div class="value">
                <el-checkbox v-model="vnode.alone" @change="addRecord">左侧空置</el-checkbox>
            </div>
        </div>
    </div>
</template>

<script>
import typeMixin from '../type-mixin.js'
export default {
    mixins: [typeMixin]
}
</script>
