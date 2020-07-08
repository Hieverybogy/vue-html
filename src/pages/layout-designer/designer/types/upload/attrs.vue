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
        <div class="item" v-if="!inListLayout">
            <div class="title" ref="placeTitle">文本提示(placeholder)
                <i class="icon-edit sapi-code-icon" 
                    title="编辑代码" 
                    :class="{'sapi-code-edited': !!vnode.attrs['placeholder-expression']}"
                    @click="showPopover('placeTitle', 'sapi-upload', 'placeholder')"></i>
            </div>
            <div class="value">
                <el-input v-model="vnode.attrs.placeholder" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">文件大小</div>
            <div class="value">
                <el-input v-model="vnode.attrs.size" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">文件格式</div>
            <div class="value">
                <el-input v-model="vnode.attrs.type" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">文件数量</div>
            <div class="value">
                <el-input v-model="vnode.attrs.count" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">显示字段</div>
            <div class="value">
                <el-checkbox v-model="vnode.attrs.hasUser" @change="addRecord">上传者</el-checkbox>
                <el-checkbox v-model="vnode.attrs.hasSize" @change="addRecord">文件大小</el-checkbox>
                <el-checkbox v-model="vnode.attrs.hasDate" @change="addRecord">上传日期</el-checkbox>
                <el-checkbox v-model="vnode.attrs.hasLoad" @change="addRecord">下载按钮</el-checkbox>
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
                    @click="showPopover('readonlyTitle', 'sapi-upload', 'readonly')"></i>
                
            </div>
            <div class="value">
                <el-checkbox v-model="vnode.attrs.readonly" @change="addRecord">只读</el-checkbox>
            </div>
        </div>
        <div class="item">
            <div class="title">是否可预览</div>
            <div class="value">
                <el-checkbox v-model="vnode.attrs.hasPreview" @change="addRecord">是</el-checkbox>
            </div>
        </div>
        <div class="item">
            <div class="title">绑定下载扩展方法</div>
            <div class="value">
                <el-select v-model="vnode.attrs.downloadExtend" @change="addRecord" placeholder="请选择">
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
            <div class="title">绑定上传扩展方法</div>
            <div class="value">
                <el-select v-model="vnode.attrs.uploadExtend" @change="addRecord" placeholder="请选择">
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
            <div class="title">绑定图片预览扩展方法</div>
            <div class="value">
                <el-select v-model="vnode.attrs.previewExtend" @change="addRecord" placeholder="请选择">
                    <el-option
                        v-for="item in bindingMethods"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
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
    </div>
</template>

<script>
import typeMixin from '../type-mixin.js'
export default {
    mixins: [typeMixin],
    data () {
        return {
            eventType: [
                { event: 'change', remark: '绑定值变化时触发的事件', defaultArguments: '更新后的值' }
            ]
        }
    }
}
</script>
