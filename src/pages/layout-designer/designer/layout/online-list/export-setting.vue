<template>
    <sapi-popover
        v-model="visible"
        :reference="reference"
        placement="left"
        :width="600"
        title="设置导出"
        title-bottom-border-visible
        @confirm="saveExport"
        trigger="click">
        <div style="height: 400px;padding-top:10px;">
            <el-scrollbar class="page-component__scroll">
                <sapi-form ref="tempExportBtn" 
                    :model="tempExportBtn" 
                    :rules="tempRules" 
                    :in-dialog="false">
                    <sapi-form-item label="按钮名称" prop="text">
                        <el-input v-model="tempExportBtn.text"></el-input>
                    </sapi-form-item>
                    <sapi-form-item label="v-if表达式" prop="permission">
                        <el-input v-model="tempExportBtn['v-if-expression']"></el-input>
                    </sapi-form-item>
                    <sapi-form-item label="导出方式" prop="exportWay">
                        <el-radio-group v-model="vnode.exportWay">
                            <el-radio label="dialog">弹窗</el-radio>
                            <el-radio label="direct">直接导出</el-radio>
                        </el-radio-group>
                    </sapi-form-item>
                    <sapi-form-item v-show="vnode.exportWay === 'dialog'" label="导出弹窗标题" prop="title">
                        <el-input v-model="tempExportBtn.title"></el-input>
                    </sapi-form-item>
                    <sapi-form-item label="导出api服务" prop="server">
                        <el-input v-model="tempExportBtn.server"></el-input>
                    </sapi-form-item>
                    <sapi-form-item label="导出api地址" prop="api">
                        <el-input v-model="tempExportBtn.api"></el-input>
                    </sapi-form-item>
                    <sapi-form-item 
                         full label-width="auto" label="导出api参数" prop="apiParams">
                        <el-table class="common-table" :data="tempExportBtn.apiParams">
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
                                    <el-input v-model="scope.row.paramValue" ></el-input>
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
                </sapi-form>
            </el-scrollbar>
        </div>
    </sapi-popover>
</template>

<script>
import SapiPopover from '../../components/sapi-popover'
export default {
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

        return {
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
            visible: false,
            tempExportBtn: {
                type: 'export', 
                text: '导出',
                exportWay: 'dialog',
                'v-if-expression': 'permissions.EXPORT',
                title: '',
                server: '',
                api: '',
                apiParams: []
            },
            tempRules: {
                text: {required: true, message: '按钮名称不能为空', trigger: ['blur']},
                title: {required: true, message: '导出标题不能为空', trigger: ['blur']},
                server: {required: true, message: '导出api服务不能为空', trigger: ['blur']},
                api: {required: true, message: '导出api地址不能为空', trigger: ['blur']},
                apiParams: { validator: checkParams }
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
            this.tempExportBtn = JSON.parse(JSON.stringify(this.vnode))
        },
        saveExport () {
            this.$refs.tempExportBtn.validate((valid) => {
                if (valid) {
                    Object.assign(this.vnode, this.tempExportBtn)
                    this.visible = false
                    this.ueditor.addRecord()
                }
            })
        },
        addParam () {
            this.tempExportBtn.apiParams.push({
                paramId: '',
                paramType: 'query',
                paramValueSource: 'filterField',
                paramValue: ''
            })
        },
        deleteParam (prop, index) {
            this.tempExportBtn.apiParams.slice(index, 1)
        }
    }
}
</script>
