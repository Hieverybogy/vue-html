<template>
    <div class="drag-option">
        <div v-if="!inTableColumn" class="item">
            <div class="title must-star">绑定字段</div>
            <div class="value" v-if="inListLayout">
                <el-input v-model="vnode.fieldId"  @change="addRecord"></el-input>
            </div>
            <div class="value" v-else>
                <el-select v-model="vnode.fieldId" @change="change">
                    <el-option v-for="(field,index) in dataModel" :key="index" :label="field.FieldName" :value="field.FieldId"></el-option>
                </el-select>
            </div>
        </div>
        <div v-if="!inTableColumn && !inListLayout && subDataModelVisible" class="item">
            <div class="title must-star">绑定子字段</div>
            <div class="value">
                <el-select v-model="vnode.subFieldId" @change="subChange">
                    <el-option v-for="(field, index) in subDataModel" :key="index" :label="field.FieldName" :value="field.FieldId"></el-option>
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
            <div class="title must-star">类型</div>
            <div class="value">
                <el-select v-model="vnode.componentName">
                    <el-option v-for="(type,index) in components" :key="index" :label="type.label" :value="type.value"></el-option>
                </el-select>
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
import Config, { getExtendComponents } from '../../config.js'
import typeMixin from '../type-mixin.js'

export default {
    mixins: [typeMixin],
    data () {
        return {
            components: null
        }
    },
    created () {
        getExtendComponents()
        const cs = Config.customerComponent
        let arrs = []
        for (let key in cs) {
            arrs.push({ label: cs[key].label, value: key })
        }

        this.components = arrs
    }
}
</script>
