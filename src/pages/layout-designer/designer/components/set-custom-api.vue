<template>
    <sapi-popover
        v-model="visible"
        :reference="reference"
        placement="left"
        :width="600"
        title="自定义api"
        title-bottom-border-visible
        @confirm="saveCustomApi"
        trigger="click">
        <div style="height: 400px;padding-top:10px;">
            <el-scrollbar class="page-component__scroll">
                <sapi-form ref="tempCustomApi" :model="tempCustomApiConfig" :rules="rules" :in-dialog="false">
                    <sapi-form-item label="api服务" prop="server">
                        <el-input v-model="tempCustomApiConfig.server" ></el-input>
                    </sapi-form-item>
                    <sapi-form-item label="api地址" prop="api">
                        <el-input v-model="tempCustomApiConfig.api"></el-input>
                    </sapi-form-item>
                    <sapi-form-item full label="api参数" prop="params" label-width="auto">
                        <el-table class="common-table" :data="tempCustomApiConfig.params">
                            <el-table-column prop="paramId" label="参数id">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.paramId"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="paramType" label="参数类型">
                                <template slot-scope="scope">
                                    <el-select 
                                        v-model="scope.row.paramType" placeholder="请选择">
                                        <el-option
                                            v-for="item in paramType"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="paramValueSource" label="参数值来源">
                                <template slot-scope="scope">
                                    <el-select 
                                        v-model="scope.row.paramValueSource" placeholder="请选择">
                                        <el-option
                                            v-for="item in paramValueSource"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="paramValue" label="关联参数值">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.paramValue"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column key="operation"
                                fixed="right" label="操作" width="60">
                                <template slot-scope="scope">
                                    <a @click="deleteParamId(scope.$index)" href="javascript:void(0)">删除</a>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="common-table__bottom-btn">
                            <span @click="addParamId">
                                <i class="el-icon-circle-plus"></i>
                                新增
                            </span>
                        </div>
                    </sapi-form-item>
                    <sapi-form-item label="返回挂载属性">
                        <el-input v-model="tempCustomApiConfig.resListToProps"></el-input>
                    </sapi-form-item>
                    <sapi-form-item full label="返回列表字段" prop="resListFields" label-width="auto">
                        <el-table class="common-table" :data="tempCustomApiConfig.resListFields">
                            <el-table-column prop="fieldId" label="字段id">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.fieldId"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="fieldName" label="字段名称">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.fieldName"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="primaryKey" width="60" label="主键">
                                <template slot-scope="scope">
                                    <el-checkbox v-model="scope.row.primaryKey"></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column prop="fieldType" label="字段类型">
                                <template slot-scope="scope">
                                    <el-select 
                                        v-model="scope.row.fieldType" placeholder="请选择">
                                        <el-option
                                            v-for="item in fieldType"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column key="operation"
                                fixed="right" label="操作" width="60">
                                <template slot-scope="scope">
                                    <a @click="deleteResListField(scope.$index)" href="javascript:void(0)">删除</a>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="common-table__bottom-btn">
                            <span @click="addResListField">
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
import SapiPopover from './sapi-popover'
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
        vnode: Object
    },
    data () {
        const _this = this
        const checkParams = (rule, value, callback) => {
            let errorMsg = ''
            if(value) {
                value.forEach(function (item, i) {
                    if (!item.paramId || !item.paramValue) {
                        errorMsg += `第${i+1}行参数id、关联参数值不能为空；`
                    }
                })
            }
            if(errorMsg) {
                callback(new Error(errorMsg));
            } else {
                callback();
            }
        }

        const checkListFields = (rule, value, callback) => {
            let errorMsg = ''
            if(value) {
                value.forEach(function (item, i) {
                    if (!item.fieldId || !item.fieldName) {
                        errorMsg += `第${i+1}行字段Id、字段名称不能为空；`
                    }
                })
            }
            if(errorMsg) {
                callback(new Error(errorMsg));
            } else {
                callback();
            }
        }

        return {
            visible: false,
            // 克隆用于配置的api
            tempCustomApiConfig: {
                server: '',
                api: '',
                params: [],
                resListToProps: 'list',
                resListFields: []
            },
            rules: {
                server: [{required: true, message: 'api服务不能为空', trigger: ['blur']}],
                api: [{required: true, message: 'api不能为空', trigger: ['blur']}],
                params: { validator: checkParams },
                resListFields: {validator: checkListFields}
            },
            paramType: [
                { label: 'query', value: 'query' },
                { label: 'path', value: 'path' }
            ],
            paramValueSource: [
                { label: '常量', value: 'const' },
                { label: 'url参数', value: 'urlParam' },
                { label: '关联过滤字段', value: 'filterField' },
                { label: '绑定data属性', value: 'dataProp' }
            ],
            fieldType: [
                { label: '文本', value: 'text' },
                { label: '多行文本', value: 'areatext' },
                { label: '整数', value: 'int' },
                { label: '小数', value: 'float' },
                { label: '日期', value: 'date' }
            ]
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
            this.tempCustomApiConfig = JSON.parse(JSON.stringify(this.vnode.customApiConfig))
        },
        deleteParamId (index) {
            this.tempCustomApiConfig.params.splice(index, 1)
        },
        addParamId () {
            this.tempCustomApiConfig.params.push({
                paramId: '',
                paramType: 'query',
                paramValueSource: 'filterField',
                paramValue: ''
            })
        },
        deleteResListField (index) {
            this.tempCustomApiConfig.resListFields.splice(index, 1)
        },
        addResListField () {
            this.tempCustomApiConfig.resListFields.push({
                fieldId: '',
                fieldName: '',
                fieldType: 'text',
                primaryKey: false
            })
        },
        saveCustomApi () {
            this.$refs.tempCustomApi.validate((valid) => {
                if (valid) {
                    this.vnode.customApiConfig = this.tempCustomApiConfig
                    this.visible = false
                    this.$emit('confirm')
                }
            })
        }
    }
}
</script>