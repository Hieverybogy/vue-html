<template>
    <sapi-popover
        v-model="visible"
        :reference="reference"
        placement="left"
        :width="600"
        title="设置操作列"
        title-bottom-border-visible
        @confirm="saveOperationColumnConfig"
        trigger="click">
        <div style="height: 400px;padding-top:10px;">
            <el-scrollbar class="page-component__scroll">
                <sapi-form ref="tempOperationColumn" :model="tempOperationColumnConfig" :rules="tempRules" :in-dialog="false">
                    <sapi-form-item label="列名称" prop="label">
                        <el-input v-model="tempOperationColumnConfig.label" ></el-input>
                    </sapi-form-item>
                    <sapi-form-item label="列宽度" prop="width">
                        <el-input v-model="tempOperationColumnConfig.width"></el-input>
                    </sapi-form-item>
                    <sapi-form-item label="列v-if表达式" prop="v-if-expression">
                        <el-input v-model="tempOperationColumnConfig['v-if-expression']"></el-input>
                    </sapi-form-item>
                    <sapi-form-item full label="操作列按钮" prop="columnBtns" label-width="auto">
                        <el-table class="common-table" :data="tempOperationColumnConfig.btns">
                            <el-table-column prop="text" label="按钮名称">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.text"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="clickEvent" label="绑定点击事件">
                                <template slot-scope="scope">
                                    <el-select 
                                        v-model="scope.row.clickEvent" placeholder="请选择">
                                        <el-option
                                            v-for="item in bindingMethods"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="clickEventArgs" label="点击事件参数">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.clickEventArgs"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="v-if-expression" label="v-if表达式">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row['v-if-expression']"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column key="operation"
                                fixed="right" label="操作" width="60">
                                <template slot-scope="scope">
                                    <a @click="deleteOperationColumnBtn(scope.$index)" href="javascript:void(0)">删除</a>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="common-table__bottom-btn">
                            <span @click="addOperationColumnBtn">
                                <i class="el-icon-circle-plus"></i>
                                新增
                            </span>
                        </div>
                    </sapi-form-item>
                    <sapi-form-item v-if="editBtnVisible" label="编辑地址" prop="editUrl">
                        <el-input v-model="tempOperationColumnConfig.editUrl"></el-input>
                    </sapi-form-item>
                    <sapi-form-item v-if="editBtnVisible" full label-width="auto" label="编辑地址参数" prop="editUrlParams">
                        <el-table class="common-table" :data="tempOperationColumnConfig.editUrlParams">
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
                                    <a @click="deleteEditUrlParam(scope.$index)" href="javascript:void(0)">删除</a>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="common-table__bottom-btn">
                            <span @click="addEditUrlParam">
                                <i class="el-icon-circle-plus"></i>
                                新增
                            </span>
                        </div>
                    </sapi-form-item>
                    <sapi-form-item v-if="deleteBtnVisible" label="删除api服务" prop="deleteApiServer">
                        <el-input v-model="tempOperationColumnConfig.deleteApiServer"></el-input>
                    </sapi-form-item>
                    <sapi-form-item v-if="deleteBtnVisible" label="删除api地址" prop="deleteApiUrl">
                        <el-input v-model="tempOperationColumnConfig.deleteApiUrl"></el-input>
                    </sapi-form-item>
                    <sapi-form-item v-if="deleteBtnVisible" full label-width="auto" label="删除api参数" prop="deleteApiParams">
                        <el-table class="common-table" :data="tempOperationColumnConfig.deleteApiParams">
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
                                    <a @click="deleteDeleteApiParam(scope.$index)" href="javascript:void(0)">删除</a>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="common-table__bottom-btn">
                            <span @click="addDeleteApiParam">
                                <i class="el-icon-circle-plus"></i>
                                新增
                            </span>
                        </div>
                    </sapi-form-item>
                    <sapi-form-item v-if="deleteBtnVisible" label="删除成功提示" prop="deleteSuccessMsg">
                        <el-input v-model="tempOperationColumnConfig.deleteSuccessMsg"></el-input>
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

        const checkOperationBtns = (rule, value, callback) => {
            let errorMsg = ''
            if(value) {
                value.forEach(function (item, i) {
                    if (!item.text || !item.clickEvent) {
                        errorMsg += `第${i+1}行按钮名称、点击绑定事件不能为空；`
                    }
                })
            }
            if(errorMsg) {
                callback(new Error(errorMsg));
            } else {
                callback();
            }
        }

        const checkEditUrl = (rule, value, callback) => {
            if (_this.editBtnVisible && !value) {
                 callback(new Error('编辑地址不能为空'));
            } else {
                callback();
            }
        }

        const checkEditUrlParams = (rule, value, callback) => {
            if (_this.editBtnVisible) {
                checkParams(rule, value, callback)
            } else {
                callback();
            }
        }

        const checkDeleteApiServer = (rule, value, callback) => {
            if (_this.deleteBtnVisible && !value) {
                 callback(new Error('删除api服务不能为空'));
            } else {
                callback();
            }
        }

        const checkDeleteApiUrl = (rule, value, callback) => {
            if (_this.deleteBtnVisible && !value) {
                 callback(new Error('删除api地址不能为空'));
            } else {
                callback();
            }
        }

        const checkDeleteSuccessMsg = (rule, value, callback) => {
            if (_this.deleteBtnVisible && !value) {
                 callback(new Error('删除成功提示不能为空'));
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
            tempOperationColumnConfig: {
                label: '操作',
                width: '100',
                btns: [
                    { type: 'edit', text: '修改', clickEvent: 'openEditView', clickEventArgs: 'props.row, props.$index', 'v-if-expression': 'permissions.UPDATE' },
                    { type: 'delete', text: '删除', clickEvent: 'deleteRowData', clickEventArgs: 'props.row, props.$index', 'v-if-expression': 'permissions.DELETE' }
                ],
                editUrl: '',
                editUrlParams: [],
                deleteApiServer: '',
                deleteApiUrl: '',
                deleteApiParams: [],
                deleteSuccessMsg: '删除成功'
            },
            tempRules: {
                label: {required: true, message: '列名称不能为空', trigger: ['blur']},
                width: {required: true, message: '列宽度不能为空', trigger: ['blur']},
                btns: {validator: checkOperationBtns},
                editUrl: {required: true, validator: checkEditUrl, trigger: ['blur']},
                editUrlParams: {validator: checkEditUrlParams},
                deleteApiServer: {required: true, validator: checkDeleteApiServer, trigger: ['blur']},
                deleteApiUrl: {required: true, validator: checkDeleteApiUrl, trigger: ['blur']},
                deleteApiParams: {validator: checkEditUrlParams},
                deleteSuccessMsg: {required: true, validator: checkDeleteSuccessMsg, trigger: ['blur']}
            }
        }
    },
    computed: {
        operParamValueSource () {
            const source = this.paramValueSource.slice(0)
            source.push({ label: '数据行属性', value: 'rowProp' })

            return source
        },
        bindingMethods () {
            const rst = [{ value: '', label: '请选择' }]
            Object.keys(this.ueditor.bindingMethodsOption || {}).forEach((key) => {
                rst.push({ value: key, label: this.ueditor.bindingMethodsOption[key] })
            })

            return rst
        },
        // 编辑按钮是否可见：操作列是否配置了type='edit'的按钮
        editBtnVisible () {
            const config = this.tempOperationColumnConfig
            if (!config) {
                return false
            }
            const btn = config.btns.filter((btn) => {
                return btn.clickEvent === 'openEditView'
            })
            return btn.length > 0
        },
        // delete按钮是否可见：操作列是否配置了type='delete'的按钮
        deleteBtnVisible () {
            const config = this.tempOperationColumnConfig
            if (!config) {
                return false
            }
            const btn = config.btns.filter((btn) => {
                return btn.clickEvent === 'deleteRowData'
            })
            return btn.length > 0
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
            this.tempOperationColumnConfig = JSON.parse(JSON.stringify(this.vnode.operationColumnConfig || []))
        },
        deleteOperationColumnBtn (index) {
            this.tempOperationColumnConfig.btns.splice(index, 1)
        },
        addOperationColumnBtn () {
            this.tempOperationColumnConfig.btns.push({
                type: 'custom',
                text: '',
                clickEvent: '',
                clickEventArgs: 'props.row, props.$index',
                'v-if-expression': ''
            })
        },
        saveOperationColumnConfig () {
            this.$refs.tempOperationColumn.validate((valid) => {
                if (valid) {
                    this.vnode.operationColumnConfig = this.tempOperationColumnConfig
                    this.visible = false
                    this.ueditor.addRecord()
                }
            })
        },
        addEditUrlParam () {
            this.tempOperationColumnConfig.editUrlParams.push({
                paramId: '',
                paramType: 'query',
                paramValueSource: 'filterField',
                paramValue: ''
            })
        },
        deleteEditUrlParam (index) {
            this.tempOperationColumnConfig.editUrlParams.splice(index, 1)
        },
        addDeleteApiParam () {
            this.tempOperationColumnConfig.deleteApiParams.push({
                paramId: '',
                paramType: 'query',
                paramValueSource: 'filterField',
                paramValue: ''
            })
        },
        deleteDeleteApiParam (index) {
            this.tempOperationColumnConfig.deleteApiParams.splice(index, i)
        }
    }
}
</script>