<template>
    <sapi-popover
        v-model="visible"
        :reference="reference"
        placement="left"
        :width="600"
        title="设置api"
        title-bottom-border-visible
        @confirm="saveApiConfig"
        trigger="click">
        <div style="height: 400px;padding-top:10px;">
            <el-scrollbar class="page-component__scroll">
                <sapi-form ref="tempApiConfig" :model="tempApiConfig" :rules="tempRules" :in-dialog="false">
                    <sapi-form-item label="api服务" prop="server">
                        <el-input v-model="tempApiConfig.server"></el-input>
                    </sapi-form-item>
                    <sapi-form-item label="api地址" prop="url">
                        <el-input v-model="tempApiConfig.url"></el-input>
                    </sapi-form-item>
                    <sapi-form-item full label-width="auto" label="api参数" prop="params">
                        <el-table class="common-table" :data="tempApiConfig.params">
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
                                            v-for="item in operParamValueSource"
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
                                    <a @click="deleteParam(scope.$index)" href="javascript:void(0)">删除</a>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="common-table__bottom-btn">
                            <span @click="addParam">
                                <i class="el-icon-circle-plus"></i>
                                新增
                            </span>
                        </div>
                    </sapi-form-item>
                    <sapi-form-item label="返回树形数据" prop="deleteSuccessMsg">
                        <el-checkbox v-model="tempApiConfig.isTreeData"></el-checkbox>
                    </sapi-form-item>
                    <sapi-form-item label="文本字段" prop="label">
                        <el-input v-model="tempApiConfig.label"></el-input>
                    </sapi-form-item>
                    <sapi-form-item label="值字段" prop="value">
                        <el-input v-model="tempApiConfig.value"></el-input>
                    </sapi-form-item>
                    <sapi-form-item v-if="tempApiConfig.isTreeData" label="子集字段" prop="children">
                        <el-input v-model="tempApiConfig.children"></el-input>
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

        const checkChildren = (rule, value, callback) => {
            if(_this.isTreeData && !value) {
                callback(new Error('子集字段不能为空'));
            } else {
                callback();
            }
        }

        return {
            visible: false,
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
            tempApiConfig: {
                server: '',
                url: '',
                params: [],
                isTreeData: false,
                label: '',
                value: '',
                children: ''
            },
            tempRules: {
                label: {required: true, message: '文本字段不能为空', trigger: ['blur']},
                value: {required: true, message: '值字段不能为空', trigger: ['blur']},
                server: {required: true, message: 'api服务不能为空', trigger: ['blur']},
                url: {required: true, message: 'api服务不能为空', trigger: ['blur']},
                children: {required: true, validator: checkChildren,trigger: ['blur']},
                params: {validator: checkParams}
            }
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
            this.tempApiConfig = JSON.parse(JSON.stringify(this.vnode.api || {
                server: '',
                url: '',
                params: [],
                isTreeData: false,
                label: '',
                value: '',
                children: ''
            }))
        },
        saveApiConfig () {
            this.$refs.tempApiConfig.validate((valid) => {
                if (valid) {
                    this.vnode.api = this.tempApiConfig
                    this.visible = false
                    this.ueditor.addRecord()
                }
            })
        },
        addParam () {
            this.apiParams.push({
                paramId: '',
                paramType: 'query',
                paramValueSource: 'filterField',
                paramValue: ''
            })
        },
        deleteParam (index) {
            this.tempApiConfig.apiParams.splice(index, i)
        }
    }
}
</script>