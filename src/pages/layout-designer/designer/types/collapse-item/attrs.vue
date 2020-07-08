<template>
    <div class="drag-option">
        <div class="item">
            <div class="title must-star" ref="displayTitle">
                显示标题
                <i class="icon-edit sapi-code-icon" 
                    title="编辑代码" 
                    :class="{'sapi-code-edited': !!vnode.attrs['title-expression']}"
                    @click="showPopover('displayTitle', 'sapi-form-collapses-item', 'title')"></i>
            </div>
            <div class="value">
                <el-input v-model="vnode.attrs.title"  @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">激活</div>
            <div class="value">
                <el-checkbox v-model="vnode.attrs.isExpand"  @change="addRecord"></el-checkbox>
            </div>
        </div>
        <div class="item" v-if="!inListLayout">
            <div class="title" ref="conditionTitle">显示条件
                <i class="icon-edit sapi-code-icon" 
                    title="编辑代码" 
                    :class="{'sapi-code-edited': !!vnode.attrs['v-if-expression']}"
                    @click="showPopover('conditionTitle', 'sapi-form-collapses-item', 'v-if')"></i></div>
            <div class="value" ref="conditionBtn">
                <el-button @click="setCondition('conditionBtn', 'v-if')" size="small" style="width:100%">设置条件</el-button>
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
