<template>
    <div class="drag-option">
        <div v-if="!inTableColumn" class="item">
            <sapi-popover
                v-model="bindingFieldsVisible"
                :reference="reference"
                :footer-visible="false"
                placement="left"
                :width="600"
                title="设置绑定字段"
                title-bottom-border-visible
                trigger="click">
                <div style="min-height: 300px;">
                    <sapi-form :in-dialog="false">
                        <sapi-form-item label="是否多选">
                            <el-checkbox v-model="vnode.attrs.multiple" @change="multipleChange">多选</el-checkbox>
                        </sapi-form-item>
                        <sapi-form-item label="绑定字段类型">
                            <el-radio-group v-model="vnode.relationship" @change="relationshipChange">
                                <el-radio :disabled="vnode.attrs.multiple" :label="1">一对一</el-radio>
                                <el-radio :label="2">一对多字段</el-radio>
                            </el-radio-group>
                        </sapi-form-item>
                        <sapi-form-item v-if="vnode.relationship === 2" label="选择一对多字段">
                            <el-select v-model="vnode.multFieldId" @change="relationshipChange">
                                <el-option v-for="(field,index) in multDataModel" :key="index" 
                                    :disabled="field.MarkCount > 0" :label="field.FieldName" :value="field.FieldId">
                                    <span :class="{'before-must-star': !field.IsNullable}">{{ field.FieldName }}</span>
                                </el-option>
                            </el-select>
                        </sapi-form-item>
                        <sapi-form-item full label-width="auto">
                            <el-table class="common-table" :data="vnode.mapFieldIds" ref="tableBody">
                                <el-table-column
                                    label="序号"
                                    type="index"
                                    align="center"
                                    width="50">
                                </el-table-column>
                                <el-table-column prop="fieldId" label="绑定字段" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.fieldId" placeholder="请选择">
                                            <el-option v-for="(field,index) in bindingMapFields" :key="index" 
                                                :label="field.FieldName" :value="field.FieldId">
                                                <span :class="{'before-must-star': !field.IsNullable}">{{ field.FieldName }}</span>
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="userFieldId" label="绑定关联用户字段">
                                    <template slot-scope="scope">
                                        <el-select :disabled="scope.row.custom" 
                                            v-model="scope.row.userFieldId" placeholder="请选择">
                                            <el-option
                                                v-for="item in userFieldIds"
                                                :key="item.fieldId"
                                                :label="`${item.fieldName}(${item.fieldId})`"
                                                :value="item.fieldId">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column key="operation"
                                    fixed="right" label="操作" width="60">
                                    <template slot-scope="scope">
                                        <a @click="deleteMapField(scope.$index)" href="javascript:void(0)">删除</a>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="common-table__bottom-btn">
                                <span @click="addMapFieldId">
                                    <i class="el-icon-circle-plus"></i>
                                    新增
                                </span>
                            </div>
                        </sapi-form-item>
                        <sapi-form-item label="选中用户格式化">
                            <el-popover
                                placement="top"
                                popper-class="sapi-popover-tipinfo"
                                width="300"
                                trigger="hover">
                                <div>
                                    以上面表格绑定字段的序号加双括号包裹为占位符，例如{1}({2})，显示时将替换为相应序号绑定字段的值。
                                </div>
                                <el-input slot="reference" v-model="vnode.attrs.format" @change="addRecord"></el-input>
                             </el-popover>
                        </sapi-form-item>
                    </sapi-form>
                </div>
            </sapi-popover>
            <el-button ref="btnBindingFields" @click="setBindingFields" size="small" style="width:100%">设置绑定字段</el-button>
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
            <div class="title">是否只选择企业员工</div>
            <div class="value">
                <el-checkbox v-model="vnode.attrs.type" @change="addRecord">只选择企业员工</el-checkbox>
            </div>
        </div>
        <div class="item">
            <div class="title">是否展示用户图片</div>
            <div class="value">
                <el-checkbox v-model="vnode.attrs.hasImg" @change="addRecord">展示图片</el-checkbox>
            </div>
        </div>
        <div class="item">
            <div class="title">弹窗头部标题</div>
            <div class="value">
                <el-input v-model="vnode.attrs.title" @change="addRecord"></el-input>
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
        <div class="item" v-if="!inListLayout && !inTableColumn">
            <div class="title" ref="conditionTitle">显示条件 
                <i class="icon-edit sapi-code-icon" 
                    title="编辑代码" 
                    :class="{'sapi-code-edited': !!vnode.attrs['v-if-expression']}"
                    @click="showPopover('conditionTitle', 'sapi-form-item', 'v-if')"></i></div>
            <div class="value" ref="conditionBtn">
                <el-button @click="setCondition('conditionBtn', 'v-if')" size="small" style="width:100%">设置条件</el-button>
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
import SapiPopover from '../../components/sapi-popover'
export default {
    components: {
        SapiPopover
    },
    mixins: [typeMixin],
    data () {
        return {
            userFieldIds: [
                { fieldName: '员工编号', fieldId: 'code'},
                { fieldName: '公司名称', fieldId: 'company'},
                { fieldName: '公司id', fieldId: 'companyId'},
                { fieldName: '部门名称', fieldId: 'department'},
                { fieldName: '部门id', fieldId: 'departmentId'},
                { fieldName: '员工id', fieldId: 'id'},
                { fieldName: '主岗', fieldId: 'mainJob'},
                { fieldName: '员工名称', fieldId: 'name'},
                { fieldName: '用户账号id', fieldId: 'userPrimaryId'},
                { fieldName: '用户账号', fieldId: 'userid'}
            ],
            bindingFieldsVisible: false,
            reference: null
        }
    },
    computed: {
        multDataModel () {
            return this.dataModel.filter((data) => {
                return data.Relationship === 2
            })
        },
        bindingMapFields () {
            let fields
            if (this.vnode.relationship === 1) {
                fields = this.dataModel.filter((data) => {
                    return data.Relationship !== 2
                })
            } else {
                fields = this.multDataModel.filter((data) => {
                    return data.FieldId === this.vnode.multFieldId
                })
            }

            return fields
        }
    },
    bindingFieldsVisible (val) {
        this.$emit('input', val)
    },
    methods: {
        addMapFieldId () {
            this.vnode.mapFieldIds.push({
                fieldId: '',
                userFieldId: ''
            })
            this.addRecord()
        },
        deleteMapField (i) {
            this.vnode.mapFieldIds.splice(i, 1)
            this.addRecord()
        },
        relationshipChange () {
            // 重置绑定字段
            this.vnode.mapFieldIds.forEach((field) => {
                field.fieldId = ''
            })

            this.addRecord()
        },
        multipleChange () {
            if (this.vnode.attrs.multiple && this.vnode.relationship === 1) {
                this.vnode.relationship = 2
            }

            this.relationshipChange()
        },
        setBindingFields () {
            this.reference = this.$refs.btnBindingFields.$el
            this.bindingFieldsVisible = true
        }
    }
}
</script>
