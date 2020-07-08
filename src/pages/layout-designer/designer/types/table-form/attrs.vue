<template>
    <div class="drag-option">
        <div v-if="!inTableColumn" class="item" ref="displayTitle">
            <div class="title">显示标题 
                <i class="icon-edit sapi-code-icon" 
                    title="编辑代码" 
                    :class="{'sapi-code-edited': !!vnode.attrs['label-expression']}"
                    @click="showPopover('displayTitle', 'sapi-form-item', 'label')"></i></div>
            <div class="value">
                <el-input v-model="vnode.label" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">是否展示表头栏</div>
            <div class="value">
                <el-checkbox v-model="vnode.attrs.isShowThead" @change="addRecord">展示</el-checkbox>
            </div>
        </div>
        <div class="item">
            <div class="title">设置（n）行</div>
            <div class="value">
                <el-input-number class="input-number-other" v-model="vnode.attrs.row" @change="addRecordNumber" :min="1"></el-input-number>
            </div>
        </div>
        <div class="item">
            <div class="title">设置（n）列</div>
            <div class="value">
                <el-input-number class="input-number-other" v-model="vnode.attrs.column" @change="addRecordNumber" :min="1" :max="10"></el-input-number>
            </div>
        </div>
        <div class="item">
            <div class="title">指定列宽度</div>
            <div class="value">
                <div v-for="(o1, i1) in vnode.attrs.colgroup" :key="i1">
                    <span>{{`第${i1+1}列`}}</span>
                    <el-input v-model="o1.width" @change="addRecord"></el-input>
                </div>
            </div>
        </div>
       
        <div class="item" v-if="!inListLayout">
            <div class="title" ref="conditionTitle">显示条件 
                <i class="icon-edit sapi-code-icon" 
                    title="编辑代码" 
                    :class="{'sapi-code-edited': !!vnode.attrs['v-if-expression']}"
                    @click="showPopover('conditionTitle', 'sapi-form-item', 'v-if')"></i></div>
            <div class="value" ref="conditionBtn">
                <el-button @click="setCondition('conditionBtn', 'v-if')" size="small" style="width:100%">设置条件</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import typeMixin from '../type-mixin.js'
export default {
    mixins: [typeMixin],
    watch: {
        'vnode.attrs.column': {
            handler(val, oldVal) {
                oldVal = oldVal || 0
                if (this.vnode.attrs.colgroup.length !== val) {
                    if (val - oldVal > 0) { // 添加
                        for (let i = 0; i < (val - oldVal); i++) {
                            this.vnode.attrs.colgroup.push({width: ''})
                            this.vnode.attrs.headLabel.push({title: '', align: 'left'})
                        }
                    } else if (val - oldVal < 0){ // 删除
                        this.vnode.attrs.colgroup = this.vnode.attrs.colgroup.slice(0, val)
                        this.vnode.attrs.headLabel = this.vnode.attrs.headLabel.slice(0, val)
                    }
                }
            },
            deep: true
        }
    },
    methods: {
        addRecordNumber() {
            setTimeout(() => {
                this.addRecord()
            }, 100)
        }
    },
    created() {
    },
}
</script>
<style lang="less">
.input-number-other{
    width: 140px;
    display: block;
    // margin: 0 auto;
    .el-input__inner{
        text-align: center;
    }
}
</style>
