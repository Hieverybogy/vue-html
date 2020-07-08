<template>
    <div class="drag-option">
        <div v-if="!inTableColumn" class="item">
            <div class="title must-star">绑定字段</div>
            <div class="value">
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
        <div v-if="!inListLayout && vnode.defaultValueType === 'loginInfo'" class="item">
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
        <div class="item" v-if="vnode.defaultValueType === 'const'">
            <div class="title">默认值</div>
            <div class="value">
                <el-input v-model="vnode.attrs.value" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item" v-if="!inListLayout">
            <div class="title" ref="placeTitle">文本提示(placeholder)
                <i class="icon-edit sapi-code-icon" 
                    title="编辑代码" 
                    :class="{'sapi-code-edited': !!vnode.attrs['placeholder-expression']}"
                    @click="showPopover('placeTitle', 'sapi-number', 'placeholder')"></i>
            </div>
            <div class="value">
                <el-input v-model="vnode.attrs.placeholder" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">校验</div>
            <div class="value">
                <el-checkbox v-model="vnode.required" @change="addRecord">必填</el-checkbox>
            </div>
        </div>
        <div class="item" v-if="vnode.required">
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
        <div class="item">
            <div class="title" ref="readonlyTitle">字段权限
                <i class="icon-edit sapi-code-icon" 
                    title="编辑代码" 
                    :class="{'sapi-code-edited': !!vnode.attrs['readonly-expression']}"
                    @click="showPopover('readonlyTitle', 'sapi-number', 'readonly')"></i>
            </div>
            <div class="value">
                <el-checkbox v-model="vnode.attrs.readonly" @change="addRecord">只读</el-checkbox>
            </div>
        </div>
        <div class="item">
            <div class="title">格式</div>
            <div class="value">
                <el-select v-model="vnode.attrs.format" @change="addRecord">
                    <el-option label="常规" value="normal"></el-option>
                    <el-option label="会计格式" value="thousand"></el-option>
                </el-select>
            </div>
        </div>
        <div class="item">
            <div class="title">显示值自定义格式化</div>
            <div class="value">
                <el-select v-model="vnode.attrs.formatFn" @change="addRecord" placeholder="请选择">
                    <el-option
                        v-for="item in bindingMethods"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="item">
            <div class="title">提交值自定义格式化</div>
            <div class="value">
                <el-select v-model="vnode.attrs.sourceFormatFn" @change="addRecord" placeholder="请选择">
                    <el-option
                        v-for="item in bindingMethods"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="item">
            <div class="title">小数位数</div>
            <div class="value">
                <el-input v-model="vnode.attrs.place" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">单位</div>
            <div class="value">
                <el-input v-model="vnode.unit" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">最大值</div>
            <div class="value">
                <el-input v-model="vnode.attrs.max" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">最小值</div>
            <div class="value">
                <el-input v-model="vnode.attrs.min" @change="addRecord"></el-input>
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
        <div v-if="!inTableColumn && layoutAttrs.doubleColumns" class="item">
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
import typeMixin from '../type-mixin.js'
export default {
    mixins: [typeMixin],
    data () {
        return {
            eventType: [
                { event: 'change', remark: '仅在输入框失去焦点或用户按下回车时触发', defaultArguments: '(value: string | number)' },
                { event: 'input', remark: '在 Input 值改变时触发', defaultArguments: '(value: string | number)' },
                { event: 'focus', remark: '在 Input 获得焦点时触发', defaultArguments: '(event: Event)' },
                { event: 'blur', remark: '在 Input 失去焦点时触发', defaultArguments: '(event: Event)' }
            ]
        }
    }
}
</script>
