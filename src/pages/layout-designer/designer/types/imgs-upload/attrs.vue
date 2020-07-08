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
            <div class="title must-star">显示标题</div>
            <div class="value">
                <el-input v-model="vnode.label" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">设置预览缩略图宽（px）</div>
            <div class="value">
                <el-input v-model="vnode.attrs.width" type="number" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">设置预览缩略图高（px）</div>
            <div class="value">
                <el-input v-model="vnode.attrs.height" type="number" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">是否开启设置文件名</div>
            <div class="value">
                <el-checkbox v-model="vnode.attrs.isShowFileName" @change="addRecord">开启设置文件名</el-checkbox>
            </div>
        </div>
        <div class="item">
            <div class="title">限制个数<span style="fontSize: 12px;color: #999">（默认不限制）</span></div>
            <div class="value">
                <el-input v-model="vnode.attrs.limit" type="number" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">apiUrl（api设置）</div>
            <div class="value" style="paddingLeft: 6px;boxSizing: border-box">
                <div>
                    <el-radio v-model="vnode.attrs.apiUrlDefault" :label="true" @change="addRecord">默认</el-radio>
                    <div v-if="vnode.attrs.apiUrlDefault" style="fontSize: 12px;color: #999;lineHeight: 16px;wordBreak: break-all;marginBottom: 5px;">默认：webConfig.fileServer || webConfig.baseUrl</div>
                </div>
                <div>
                    <el-radio v-model="vnode.attrs.apiUrlDefault" :label="false" @change="addRecord">其他</el-radio>
                    <div v-if="!vnode.attrs.apiUrlDefault">
                        <el-input type="textarea" v-model="vnode.attrs.apiUrl" @change="addRecord"></el-input>
                    </div> 
                </div>
            </div>
        </div>
        <div class="item">
            <div class="title">url（接口设置）</div>
            <div class="value" style="paddingLeft: 6px;boxSizing: border-box">
                <div>
                    <el-radio v-model="vnode.attrs.urlDefault" :label="true" @change="addRecord">默认</el-radio>
                    <div v-if="vnode.attrs.urlDefault" style="fontSize: 12px;color: #999;lineHeight: 16px;wordBreak: break-all;marginBottom: 5px;">默认</div>
                </div>
                <div>
                    <el-radio v-model="vnode.attrs.urlDefault" :label="false" @change="addRecord">其他</el-radio>
                    <div v-if="!vnode.attrs.urlDefault">
                        <el-input type="textarea" v-model="vnode.attrs.url" @change="addRecord"></el-input>
                    </div> 
                </div>
            </div>
        </div>
        <div class="item">
            <div class="title">上传规则</div>
            <div class="value" style="paddingLeft: 6px;boxSizing: border-box">
                <div><el-radio v-model="vnode.attrs.isCustomFormat" :label="false" @change="addRecord">默认可选规则</el-radio></div>
                <div style="paddingLeft: 10px;" v-if="!vnode.attrs.isCustomFormat">
                    <el-checkbox-group v-model="vnode.attrs.rules" @change="addRecord">
                        <div><el-checkbox :label="1">不能上传空文件</el-checkbox></div>
                        <div><el-checkbox :label="2">限JPG/JGEG/PNG 格式</el-checkbox></div>
                        <div><el-checkbox :label="3">大小不能超过 10M</el-checkbox></div>
                    </el-checkbox-group>
                </div>
                <div>
                    <el-radio v-model="vnode.attrs.isCustomFormat" :label="true" @change="addRecord">自定义规则</el-radio> 
                </div>
                <div v-if="vnode.attrs.isCustomFormat">
                    <p style="fontSize: 12px;color: #999;lineHeight: 16px;wordBreak: break-all;marginBottom: 5px;">注：请添加完整的代码片段，文件的字段为file。</p>
                    <p style="fontSize: 12px;color: #999;lineHeight: 16px;wordBreak: break-all;marginBottom: 5px;">例如：if (!file.size) {Vue.msg('不能上传空文件');return false;}</p>
                    <el-input type="textarea" v-model="vnode.attrs.customRules" @change="addRecord"></el-input>
                </div>
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
        <div class="item" v-if="false">
            <div class="title">自定义校验</div>
            <div class="value">
                <el-input type="textarea" v-model="vnode.validator" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
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
    mixins: [typeMixin],
    methods: {

    }
}
</script>
