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
            <div class="title">文本提示（placeholder）</div>
            <div class="value">
                <el-input v-model="vnode.attrs.placeholder" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">控件高度</div>
            <div class="value">
                <el-input type="number" v-model="vnode.attrs.height" @change="addRecord" placeholder="px"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">是否多选</div>
            <div class="value">
                <el-checkbox v-model="vnode.attrs.multiple" @change="addRecord">多选</el-checkbox>
            </div>
        </div>
        <div class="item">
            <div class="title">文本展示规则</div>
            <div class="value">
                <div><el-radio v-model="vnode.attrs.isCustomFormat" :label="false" @change="addRecord">默认可选规则</el-radio></div>
                <div style="paddingLeft: 10px;" v-if="!vnode.attrs.isCustomFormat">
                    <el-checkbox-group v-model="vnode.attrs.format" @change="addRecord">
                        <div><el-checkbox label="CorpName" :disabled="vnode.attrs.isCustomFormat">组别（CorpName）</el-checkbox></div>
                        <div><el-checkbox label="DeptName" :disabled="vnode.attrs.isCustomFormat">部门（DeptName）</el-checkbox></div>
                        <div><el-checkbox label="StationName" :disabled="vnode.attrs.isCustomFormat">职能（StationName）</el-checkbox></div>
                        <div><el-checkbox label="EmployeeName" disabled>姓名（EmployeeName）</el-checkbox></div>
                    </el-checkbox-group>
                </div>
                
                <div>
                    <el-radio v-model="vnode.attrs.isCustomFormat" :label="true" @change="addRecord">自定义规则</el-radio> 
                </div>
                <div v-if="vnode.attrs.isCustomFormat">
                    <div style="fontSize: 12px;color: #999;lineHeight: 20px;wordBreak: break-all;">例如：${CorpName}/${DeptName}/${StationName} (${EmployeeName})</div>
                    <el-input type="textarea" v-model="vnode.attrs.formatTxt" @change="addRecord"></el-input>
                </div>
            </div>
        </div>
        <div class="item">
            <div class="title">数据缓存名称</div>
            <div class="value">
                <el-input v-model="vnode.attrs.cookieName" @change="addRecord"></el-input>
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
