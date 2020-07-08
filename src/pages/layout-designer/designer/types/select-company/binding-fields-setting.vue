<template>
    <sapi-popover
        v-model="visible"
        :reference="reference"
        placement="left"
        :width="600"
        :title="title"
        title-bottom-border-visible
        @confirm="saveBindingFields"
        trigger="click">
        <div style="height: 350px;padding-top:10px;">
            <el-scrollbar class="page-component__scroll">
                <sapi-form ref="tempVnode" :model="tempVnode" :rules="tempRules" :in-dialog="false">
                    <!-- <sapi-form-item label="绑定字段类型">
                        <el-radio-group v-model="tempVnode.relationship" @change="relationshipChange">
                            <el-radio :label="1">一对一</el-radio>
                            <el-radio :label="2">一对多字段</el-radio>
                        </el-radio-group>
                    </sapi-form-item>
                    <sapi-form-item v-if="tempVnode.relationship === 2" label="选择一对多字段">
                        <el-select v-model="tempVnode.multFieldId" @change="relationshipChange">
                            <el-option v-for="(field,index) in multDataModel" :key="index" 
                                :disabled="field.MarkCount > 0" :label="field.FieldName" :value="field.FieldId">
                                <span :class="{'before-must-star': !field.IsNullable}">{{ field.FieldName }}</span>
                            </el-option>
                        </el-select>
                    </sapi-form-item> -->
                    <sapi-form-item full label-width="auto">
                        <el-table class="common-table" :data="tempVnode.mapFieldIds" ref="tableBody">
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
                            <el-table-column prop="userFieldId" label="绑定关联选中字段">
                                <template slot-scope="scope">
                                    <el-select :disabled="scope.row.custom" 
                                        v-model="scope.row.userFieldId" placeholder="请选择">
                                        <el-option
                                            v-for="item in itemFieldIds"
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
                </sapi-form>
            </el-scrollbar>
        </div>
    </sapi-popover>
</template>

<script>
import SapiPopover from '../../components/sapi-popover'
export default {
    inject: ['ueditor'],
    components: {
        SapiPopover
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        reference: {
            validator: function (el) {
                if (el && el.nodeType === 1) {
                    return true
                }
                return false
            },
            required: true
        },
        vnode: Object,
        title: {
            type: String,
            default: '设置绑定字段'
        },
        inRow: {
            type: Boolean,
            default: false
        }
    },
    data () {
        const _this = this
        const checkMultFieldId = (rule, value, callback) => {
            if (this.tempVnode.relationship === 2 && !value) {
                callback(new Error('请选择一对多字段'))
            } else {
                callback()
            }
        }

        const checkMapFieldIds = (rule, value, callback) => {
            let errorMsg = ''
            if(value) {
                let isExistId = false
                value.forEach(function (item, i) {
                    if (!item.fieldId || !item.userFieldId) {
                        errorMsg += `第${i+1}行绑定字段、绑定关联用户字段不能为空；`
                    }

                    if (item.userFieldId === 'id') {
                        isExistId = true
                    }
                })

                if (!isExistId) {
                    errorMsg += `必须关联选中字段“公司/部门id”`
                }
            }

            if(errorMsg) {
                callback(new Error(errorMsg))
            } else {
                callback();
            }
        }
    
        return {
            visible: false,
            tempVnode: {
                relationship: 1,
                multFieldId: null,
                mapFieldIds: []
            },
            itemFieldIds: [
                { fieldName: '公司/部门id', fieldId: 'id'},
                { fieldName: '公司/部门简称', fieldId: 'name'},
                { fieldName: '公司/部门全称', fieldId: 'fullname'},
                { fieldName: '公司/部门code', fieldId: 'code'},
                { fieldName: '公司/部门type', fieldId: 'departmentId'},
                { fieldName: '上级名称', fieldId: 'parentStruName'},
                { fieldName: '上级id', fieldId: 'pid'},
                { fieldName: '上级type', fieldId: 'parentStruType'}
            ],
            tempRules: {
                multFieldId: {required: true, validator: checkMultFieldId},
                mapFieldIds: {required: true, validator: checkMapFieldIds}
            }
        }
    },
    computed: {
        multDataModel () {
            return this.ueditor.dataModel.filter((data) => {
                return data.Relationship === 2
            })
        },
        bindingMapFields () {
            let fields
            if (this.tempVnode.relationship === 1) {
                fields = this.ueditor.dataModel.filter((data) => {
                    return data.Relationship !== 2
                })
            } else {
                fields = this.multDataModel.filter((data) => {
                    return data.FieldId === this.tempVnode.multFieldId
                })
            }

            return fields
        }
    },
    watch: {
        visible (val) {
            this.$emit('input', val)
        },
        value: {
            handler (val) {
                this.visible = val

                if (this.visible) {
                    this.reSet()
                }
            },
            immediate: true
        }
    },
    methods: {
        reSet () {
            this.tempVnode = JSON.parse(JSON.stringify(this.vnode))
        },
        relationshipChange () {
            // 重置绑定字段
            this.tempVnode.mapFieldIds.forEach((field) => {
                field.fieldId = ''
            })
        },
        deleteMapField (index) {
            this.tempVnode.mapFieldIds.splice(index, 1)
        },
        addMapFieldId () {
            this.tempVnode.mapFieldIds.push({
                fieldId: '',
                userFieldId: ''
            })
        },
        saveBindingFields () {
            this.$refs.tempVnode.validate((valid) => {
                if (valid) {
                    Object.assign(this.vnode, this.tempVnode)
                    this.ueditor.addRecord()
                    this.visible = false
                }
            })
        }
    }
}
</script>
