<template>
    <div class="drag-option">
        <div v-if="!inTableColumn" class="item">
            <div class="title must-star">绑定字段</div>
            <div class="value" v-if="inListLayout">
                <div>
                    <p v-if="vnode.attrs.multiType===2">起始字段</p>
                    <el-input v-model="vnode.fieldId" @change="addRecord"></el-input>
                </div>
                <div v-if="vnode.attrs.multiType===2">
                    <p>结束字段</p>
                    <el-input v-model="vnode.fieldId2" @change="addRecord"></el-input>
                </div>
            </div>
            <div class="value" v-else>
                <div>
                    <p v-if="vnode.attrs.multiType===2 && !inListLayout && !subDataModelVisible">起始字段</p>
                    <el-select v-model="vnode.fieldId" @change="change">
                        <el-option v-for="(field,index) in dataModel" :key="index" 
                            :disabled="field.MarkCount > 0" :label="field.FieldName" :value="field.FieldId">
                            <span :class="{'before-must-star': !field.IsNullable}">{{ field.FieldName }}</span>
                        </el-option>
                    </el-select>
                </div>
                <div v-if="vnode.attrs.multiType===2 && !inListLayout && !subDataModelVisible">
                    <p>结束字段</p>
                    <el-select v-model="vnode.fieldId2" @change="change">
                        <el-option v-for="(field,index) in dataModel" :key="index" 
                            :disabled="field.MarkCount > 0" :label="field.FieldName" :value="field.FieldId">
                            <span :class="{'before-must-star': !field.IsNullable}">{{ field.FieldName }}</span>
                        </el-option>
                    </el-select>
                </div>
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
                <el-select v-model="vnode.subFieldId2" @change="subChange">
                    <el-option v-for="(field, index) in subDataModel" :key="index" 
                        :disabled="field.MarkCount > 0" :label="field.FieldName" :value="field.FieldId">
                        <span :class="{'before-must-star': !field.IsNullable}">{{ field.FieldName }}</span>
                    </el-option>
                </el-select>
            </div>
        </div>
        <div v-if="!inTableColumn" class="item">
            <div class="title must-star" ref="displayTitle">
                显示标题
                <i class="icon-edit sapi-code-icon" 
                    title="编辑代码" 
                    :class="{'sapi-code-edited': !!vnode.attrs['label-expression']}"
                    @click="showPopover('displayTitle', 'sapi-form-item', 'label')"></i>
            </div>
            <div class="value">
                <el-input v-model="vnode.label" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">类型</div>
            <div class="value">
                <div><el-radio v-model="vnode.attrs.multiType" :label="1" @change="addRecord">选择单一时间</el-radio></div>
                <div><el-radio v-model="vnode.attrs.multiType" :label="2" @change="addRecord">选择时间范围</el-radio></div>
            </div>
        </div>
        <div class="item" v-if="vnode.attrs.multiType === 1">
            <div class="title">默认值类型</div>
            <div class="value">
                <el-radio-group v-model="vnode.defaultValueType" @change="addRecord">
                    <el-radio label="none">无</el-radio>
                    <el-radio label="const">常量</el-radio>
                    <el-radio label="now">当前时间</el-radio>
                    <el-radio label="loginInfo">登录用户信息</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div v-if="!inListLayout && vnode.defaultValueType === 'loginInfo' && vnode.attrs.multiType === 1" class="item">
            <div class="title must-star">登录用户信息</div>
            <div class="value">
                <el-select v-model="vnode.defaultValue" @change="addRecord">
                    <el-option v-for="(field, index) in systemDefaultValue" 
                        :key="index"
                        :label="field.label" :value="field.value">
                        {{ field.label }}
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="item" v-if="vnode.defaultValueType === 'const' && vnode.attrs.multiType === 1">
            <div class="title">默认值</div>
            <div class="value">
                <el-input v-model="vnode.attrs.value" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item" v-if="vnode.attrs.multiType === 1">
            <div class="title">格式</div>
            <div class="value">
                <el-select v-model="currFormat" @change="formatChange">
                    <el-option v-for="f in formatTypes" :key="f.value"
                        v-show="f.multiType === 1"
                        :label="f.label" :value="f.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="item" v-if="vnode.attrs.multiType === 2">
            <div class="title">格式</div>
            <div class="value">
                <el-select v-model="currFormat" @change="formatChange">
                    <el-option v-for="f in formatTypes" :key="f.value"
                        v-show="f.multiType === 2"
                        :label="f.label" :value="f.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="item" v-if="vnode.attrs.multiType === 1">
            <div class="title">文本提示（placeholder）</div>
            <div class="value">
                <el-input v-model="vnode.attrs.placeholder" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item" v-if="vnode.attrs.multiType === 2">
            <div class="title">起始文本提示（placeholder）</div>
            <div class="value">
                <el-input v-model="vnode.attrs.placeholder1" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item" v-if="vnode.attrs.multiType === 2">
            <div class="title">结束文本提示（placeholder）</div>
            <div class="value">
                <el-input v-model="vnode.attrs.placeholder2" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item" v-if="!inListLayout">
            <div class="title">校验</div>
            <div class="value">
                <el-checkbox v-model="vnode.required" @change="addRecord">必填</el-checkbox>
            </div>
        </div>
        <div class="item" v-if="!inListLayout && vnode.required">
            <div class="title">必填校验失败提示</div>
            <div class="value">
                <el-input v-model="vnode.requiredErrorMsg" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item" v-if="!inListLayout && vnode.required && !inTableColumn">
            <div class="title">自定义校验</div>
            <div class="value">
                <el-select v-model="vnode.validator" @change="addRecord" placeholder="请选择">
                    <el-option
                        v-for="item in bindingMethods"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="item" v-if="!inListLayout">
            <div class="title" ref="readonlyTitle">字段权限
                <i class="icon-edit sapi-code-icon" 
                    title="编辑代码" 
                    :class="{'sapi-code-edited': !!vnode.attrs['readonly-expression']}"
                    @click="showPopover('readonlyTitle', 'el-date-picker', 'readonly')"></i>
            </div>
            <div class="value">
                <el-checkbox v-model="vnode.attrs.readonly" @change="addRecord">只读</el-checkbox>
            </div>
        </div>
        <div class="item" v-if="!inListLayout && !inTableColumn">
            <div class="title" ref="conditionTitle">显示条件
                <i class="icon-edit sapi-code-icon" 
                    title="编辑代码" 
                    :class="{'sapi-code-edited': !!vnode.attrs['v-if-expression']}"
                    @click="showPopover('conditionTitle', 'sapi-form-item', 'v-if')"></i>
                <i class="el-icon-s-operation sapi-code-icon" 
                    title="设置条件" 
                    :class="{'sapi-code-edited': !!vnode.conditions['v-if']}"
                    @click="setCondition('conditionTitle', 'v-if')"></i>
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
        <div class="item" ref="bindEvent">
            <el-button @click="setBindEvent('bindEvent')" size="small" style="width:100%">设置绑定事件</el-button>
        </div>
    </div>
</template>

<script>
const FormatTypes = {
    yMd: { type: 'date', label: '日期格式(yyyy-MM-dd)', format: 'yyyy-MM-dd', multiType: 1 },
    yM: { type: 'month', label: '日期格式(yyyy-MM)', format: 'yyyy-MM', multiType: 1 },
    y: { type: 'year', label: '日期格式(yyyy)', format: 'yyyy', multiType: 1 },
    yMdhms: { type: 'datetime', label: '时间格式(yyyy-MM-dd hh:mm:ss)', format: 'yyyy-MM-dd hh:mm:ss', multiType: 1 },
    yMdhm: { type: 'datetime', label: '时间格式(yyyy-MM-dd hh:mm)', format: 'yyyy-MM-dd hh:mm', multiType: 1 },
    daterange: { type: 'daterange', label: '选择日期范围', format: 'yyyy-MM-dd', multiType: 2},
    datetimerange: { type: 'datetimerange', label: '选日期和时间范围', format: 'yyyy-MM-dd hh:mm:ss', multiType: 2}
}

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
    },
    watch: {
        vnode: {
            handler () {
                for (let fmt in FormatTypes) {
                    if (FormatTypes[fmt].type === this.vnode.attrs.type) {
                        this.currFormat = fmt
                    }
                }
            },
            immediate: true
        },
        'vnode.attrs.multiType'(val) {
            this.currFormat = val === 1 ? 'yMd' : 'daterange'
            this.vnode.fieldId = '';
            this.vnode.fieldId2 = '';
            this.vnode.subFieldId = '';
            this.vnode.subFieldId2 = '';
        },
        subDataModelVisible(val) {
            if (this.vnode.attrs.multiType===2 && !this.inListLayout && !val) {
                this.vnode.fieldId2 = this.vnode.fieldId
            }
        },
        'vnode.fieldId'(val) {
            this.subFieldId = ''
        },
        'vnode.fieldId2'(val) {
            this.subFieldId2 = ''
        }
    },
    methods: {
        formatChange (type) {
            const tObj = FormatTypes[type]
            if (this.vnode.attrs.multiType === 1) {
                this.vnode.attrs.type = tObj.type
                this.vnode.attrs.format = tObj.format
            } else {
                this.vnode.attrs.type2 = tObj.type
                this.vnode.attrs.format = tObj.format
            }
            this.addRecord()
        },
    },
    created () {
        for (let type in FormatTypes) {
            this.formatTypes.push({
                value: type,
                label: FormatTypes[type].label,
                multiType: FormatTypes[type].multiType
            })
        }
        this.currFormat = this.vnode.attrs.multiType === 1 ? 'yMd' : 'daterange'
    }
}
</script>
