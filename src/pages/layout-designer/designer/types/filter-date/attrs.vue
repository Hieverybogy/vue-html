<template>
    <div class="drag-option">
        <div class="item">
            <div class="title must-star">绑定字段</div>
            <div class="value">
                <div>
                    <p>起始字段</p>
                    <el-input v-model="vnode.fieldId" @change="addRecord"></el-input>
                </div>
                <div>
                    <p>结束字段</p>
                    <el-input v-model="vnode.endFieldId" @change="addRecord"></el-input>
                </div>
            </div>
        </div>
        <div class="item">
            <div class="title must-star" ref="displayTitle">
                显示标题
                <i v-if="false" class="icon-edit sapi-code-icon" 
                    title="编辑代码" 
                    :class="{'sapi-code-edited': !!vnode.attrs['label-expression']}"
                    @click="showPopover('displayTitle', 'sapi-form-item', 'label')"></i>
            </div>
            <div class="value">
                <el-input v-model="vnode.label" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item" >
            <div class="title">起始文本提示（placeholder）</div>
            <div class="value">
                <el-input v-model="vnode.attrs.startPlaceholder" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item" >
            <div class="title">结束文本提示（placeholder）</div>
            <div class="value">
                <el-input v-model="vnode.attrs.endPlaceholder" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item" v-if="!inListLayout && !inTableColumn && false">
            <div class="title" ref="conditionTitle">显示条件
                <i class="icon-edit sapi-code-icon" 
                    title="编辑代码" 
                    :class="{'sapi-code-edited': !!vnode.attrs['v-if-expression']}"
                    @click="showPopover('conditionTitle', 'sapi-form-item', 'v-if')"></i></div>
            <div class="value" ref="conditionBtn">
                <el-button @click="setCondition('conditionBtn', 'v-if')" size="small" style="width:100%">设置条件</el-button>
            </div>
        </div>
        <div class="item" v-if="false" ref="bindEvent">
            <el-button @click="setBindEvent('bindEvent')" size="small" style="width:100%">设置绑定事件</el-button>
        </div>
    </div>
</template>

<script>
import typeMixin from '../type-mixin.js'
export default {
    mixins: [typeMixin],
    data () {
        return {
            formatTypes: [],
            currFormat: '',
            eventType: [
                { event: 'change', remark: '用户确认选定的值时触发', defaultArguments: '组件绑定值。格式与绑定值一致' },
                { event: 'focus', remark: '在 Input 获得焦点时触发', defaultArguments: '组件实例' },
                { event: 'blur', remark: '在 Input 失去焦点时触发', defaultArguments: '组件实例' }
            ]
        }
    }
}
</script>
