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
                <el-radio-group v-model="vnode.attrs.multiple" @change="addRecord">
                    <el-radio :label="false">单选</el-radio>
                    <el-radio :label="true">多选</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div v-if="!inTableColumn && !vnode.attrs.multiple" class="item">
            <div class="title">关联选中值文本字段</div>
            <div class="value">
                <el-select v-model="vnode.textFieldId" @change="updateState">
                    <el-option v-for="(field,index) in dataModel" :key="index" 
                        :disabled="field.MarkCount > 0" :label="field.FieldName" :value="field.FieldId">
                        <span :class="{'before-must-star': !field.IsNullable}">{{ field.FieldName }}</span>
                    </el-option>
                </el-select>
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
                    @click="showPopover('placeTitle', 'el-select', 'placeholder')"></i>
            </div>
            <div class="value">
                <el-input v-model="vnode.attrs.placeholder" @change="addRecord"></el-input>
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
                    :class="{'sapi-code-edited': !!vnode.attrs['disabled-expression']}"
                    @click="showPopover('readonlyTitle', 'el-select', 'disabled')"></i>
            </div>
            <div class="value">
                <el-checkbox v-model="vnode.attrs.disabled" @change="addRecord">只读</el-checkbox>
            </div>
        </div>
        <div class="item">
            <div class="title">数据源类型</div>
            <div class="value">
                <el-radio-group v-model="vnode.dataSourceType" @change="addRecord">
                    <el-radio label="custom">自定义</el-radio>
                    <el-radio label="api">设置api</el-radio>
                    <el-radio label="dataProp">绑定data属性</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="item" v-if="vnode.dataSourceType !== 'dataProp'">
            <div class="title must-star">绑定数据源</div>
            <div class="value">
                <el-button size="small" @click="setDataSource" style="width:100%">设置</el-button>
            </div>
        </div>
        <div class="item" v-if="vnode.dataSourceType === 'dataProp'">
            <div class="title must-star">绑定data属性</div>
            <div class="value">
                <el-select v-model="vnode.optionsProp" @change="addRecord">
                     <el-option v-for="p in bindingProps" :key="p" 
                        :label="p" :value="p">
                    </el-option>
                </el-select>
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

        <div v-transfer-dom>
            <component :is="view" 
                v-model="settingVisible"
                :option="currentOption" 
                :reference="reference"
                :type="vnode.type"
                @callback="callback"></component>
        </div>
    </div>
</template>

<script>
import typeMixin from '../type-mixin.js'
import optionsMixin from '../options-mixin.js'
export default {
    mixins: [typeMixin, optionsMixin],
    data () {
        return {
            eventType: [
                { event: 'change', remark: '选中值发生变化时触发', defaultArguments: '目前选中值' },
                { event: 'visible-change', remark: '下拉框出现/隐藏时触发', defaultArguments: '出现则为true，隐藏则为false' },
                { event: 'remove-tag', remark: '多选模式下移除tag时触发', defaultArguments: '移除的tag值' },
                { event: 'clear', remark: '可清空的单选模式下用户点击清空按钮时触发', defaultArguments: '——'},
                { event: 'blur', remark: '当 input 失去焦点时触发', defaultArguments: '(event: Event)'},
                { event: 'focus', remark: '当 input 获得焦点时触发', defaultArguments: '(event: Event)'}
            ]
        }
    }
}
</script>
