<template>
    <div class="drag-option">
        <div v-if="!inTableColumn" class="item">
            <div class="title must-star">绑定字段</div>
            <div class="value" v-if="inListLayout">
                <el-input v-model="vnode.fieldId" @change="addRecord"></el-input>
            </div>
            <div class="value" v-else>
                <el-select v-model="vnode.fieldId" @change="change">
                    <el-option v-for="(field,index) in dataModel" :key="index" 
                        :disabled="field.MarkCount > 0" :label="field.FieldName" :value="field.FieldId">
                        <span :class="{'before-must-star': !field.IsNullable}">{{ field.FieldName }}</span>
                    </el-option>
                </el-select>
            </div>
        </div>
        <div v-if="!inTableColumn && !inListLayout && subDataModelVisible" class="item">
            <div class="title must-star">绑定子字段</div>
            <div class="value">
                <el-select v-model="vnode.subFieldId" @change="subChange">
                    <el-option v-for="(field, index) in subDataModel" :key="index" 
                        :disabled="field.MarkCount > 0" :label="field.FieldName" :value="field.FieldId">
                        <span :class="{'before-must-star': !field.IsNullable}">{{ field.FieldName }}</span>
                    </el-option>
                </el-select>
            </div>
        </div>
        <div v-if="!inTableColumn" class="item">
            <div class="title must-star">显示标题</div>
            <div class="value">
                <el-input v-model="vnode.label" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">选择级别（省/市/区/街）</div>
            <div class="value">
                <el-select v-model="vnode.attrs.type" @change="addRecord">
                    <el-option label="省份" value="province"></el-option>
                    <el-option label="城市" value="city"></el-option>
                    <el-option label="区（县）" value="area"></el-option>
                    <el-option label="街道" value="street"></el-option>
                </el-select>
            </div>
        </div>
        <div class="item">
            <div class="title">是否多选</div>
            <div class="value">
                <el-select v-model="vnode.attrs.multiple" @change="addRecord">
                    <el-option label="是" :value="true"></el-option>
                    <el-option label="否" :value="false"></el-option>
                </el-select>
            </div>
        </div>
        <div class="item" v-if="vnode.attrs.multiple">
            <div class="title">限制选择个数</div>
            <div class="value">
                <el-input v-model="vnode.attrs.limit" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item" v-if="!inListLayout">
            <div class="title">校验</div>
            <div class="value">
                <el-checkbox v-model="vnode.required" @change="addRecord">必填</el-checkbox>
            </div>
        </div>
        <div class="item" v-if="vnode.required && !inListLayout">
            <div class="title">必填校验失败提示</div>
            <div class="value">
                <el-input v-model="vnode.requiredErrorMsg" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item" v-if="false && !inListLayout">
            <div class="title">自定义校验</div>
            <div class="value">
                <el-input type="textarea" v-model="vnode.validator" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item" v-if="!inListLayout">
            <div class="title">字段权限</div>
            <div class="value">
                <el-checkbox v-model="vnode.attrs.readonly" @change="addRecord">只读</el-checkbox>
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
