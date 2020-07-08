<template>
    <sapi-popover
        v-model="visible"
        :reference="reference"
        placement="left"
        :width="600"
        :title="title"
        title-bottom-border-visible
        @confirm="saveCustomBtn"
        trigger="click">
        <div style="height: 400px;padding-top:10px;">
            <el-scrollbar class="page-component__scroll">
                <sapi-form ref="customBtn" :model="tempCustomBtn" :rules="tempRules" :in-dialog="false">
                    <sapi-form-item label="按钮名称" prop="text">
                        <el-input v-model="tempCustomBtn.text"></el-input>
                    </sapi-form-item>
                    <sapi-form-item label="v-if表达式" prop="v-if-expression">
                        <el-input v-model="tempCustomBtn['v-if-expression']"></el-input>
                    </sapi-form-item>
                    <sapi-form-item label="主题" prop="" v-if="!inRow">
                        <el-select 
                            v-model="tempCustomBtn.btnType" placeholder="请选择">
                            <el-option
                                v-for="item in btnTypes"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </sapi-form-item>
                    <sapi-form-item label="按钮用途" prop="usage">
                        <el-radio-group v-model="tempCustomBtn.usage">
                            <el-radio  v-for="item in usageOptions"
                                :key="item.value" 
                                :label="item.value">{{item.label}}</el-radio>
                        </el-radio-group>
                    </sapi-form-item>

                    <sapi-form-item v-if="tempCustomBtn.usage === 'custom'"
                        label="绑定点击方法" prop="clickEvent">
                        <el-select v-model="tempCustomBtn.clickEvent" placeholder="请选择">
                            <el-option
                                v-for="item in bindingMethods"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </sapi-form-item>
                    <sapi-form-item label="自定义方法" v-if="false">
                        <base-code-editor ref="customFun" class="custom-fun-code"
                            :value="tempCustomBtn.customFun"
                            :options="{
                                minimap: {
                                    enabled:false
                                },
                                wordWrap: 'on',
                                lineNumbersMinChars: 2,
                                lineDecorationsWidth: 2,
                                overviewRulerBorder: false,
                                scrollbar: {
                                    horizontalHasArrows:false,
                                    horizontal:'hidden',
                                    vertical: 'hidden'
                                }
                            }"
                            beautifier="js"
                            language="javascript"></base-code-editor>
                    </sapi-form-item>
                    <sapi-form-item v-if="tempCustomBtn.usage === 'custom'" label="立即执行" prop="execution">
                        <el-checkbox v-model="tempCustomBtn.execution"></el-checkbox>
                    </sapi-form-item>
                    <sapi-form-item v-if="tempCustomBtn.usage === 'custom'" label="点击事件参数" prop="clickEventArgs">
                        <el-input v-model="tempCustomBtn.clickEventArgs"></el-input>
                    </sapi-form-item>
                    
                    <sapi-form-item v-if="tempCustomBtn.usage === 'openPage'" label="打开地址" prop="openUrl">
                        <el-input v-model="tempCustomBtn.openUrl"></el-input>
                    </sapi-form-item>
                    <sapi-form-item v-if="tempCustomBtn.usage === 'openPage'" label="打开方式" prop="openWay">
                        <el-radio-group v-model="tempCustomBtn.openWay">
                            <el-radio label="_self">当前页</el-radio>
                            <el-radio label="_blank">新标签</el-radio>
                        </el-radio-group>
                    </sapi-form-item>
                    <sapi-form-item v-if="tempCustomBtn.usage === 'openPage'" full label-width="auto" label="打开地址参数" prop="params">
                        <el-table class="common-table" :data="tempCustomBtn.openUrlParams">
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
                                            v-for="item in (inRow ? operParamValueSource : paramValueSource)"
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
                                    <a @click="deleteParam('openUrlParams', scope.$index)" href="javascript:void(0)">删除</a>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="common-table__bottom-btn">
                            <span @click="addParam('openUrlParams')">
                                <i class="el-icon-circle-plus"></i>
                                新增
                            </span>
                        </div>
                    </sapi-form-item>

                    <sapi-form-item v-if="tempCustomBtn.usage === 'ajax'" label="api服务" prop="apiServer">
                        <el-input v-model="tempCustomBtn.apiServer" ></el-input>
                    </sapi-form-item>
                    <sapi-form-item v-if="tempCustomBtn.usage === 'ajax'" label="api地址" prop="apiUrl">
                        <el-input v-model="tempCustomBtn.apiUrl"></el-input>
                    </sapi-form-item>
                    <sapi-form-item v-if="tempCustomBtn.usage === 'ajax'" label="api请求方式" prop="apiType">
                        <el-radio-group v-model="tempCustomBtn.apiType">
                            <el-radio v-for="item in apiTypeOptions"
                                :key="item.value"
                                :label="item.value">{{item.label}}</el-radio>
                        </el-radio-group>
                    </sapi-form-item>
                    <sapi-form-item v-if="tempCustomBtn.usage === 'ajax'" full label="api参数" prop="apiParams" label-width="auto">
                        <el-table class="common-table" :data="tempCustomBtn.apiParams">
                            <el-table-column prop="paramId" label="参数id">
                                <template slot-scope="scope">
                                    <div class="body-prop-param-wrap">
                                        <span class="body-prop-prefix" v-if="scope.row.parentGuid">--</span>
                                        <el-input v-model="scope.row.paramId">
                                        </el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="paramType" label="参数类型">
                                <template slot-scope="scope">
                                    <el-select 
                                        v-model="scope.row.paramType" placeholder="请选择" @change="apiParamTypeChange(scope.row, scope.$index)">
                                        <el-option
                                            v-for="item in (scope.row.parentGuid ? [{label: 'body子属性', value: 'bodyProp'}]: (tempCustomBtn.apiType === 'get' ? paramType : requestParamType))"
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
                                        v-model="scope.row.paramValueSource" placeholder="请选择" @change="apiParamValueSourceChange(scope.row, scope.$index)">
                                        <el-option
                                            v-for="item in getApiParamValueSource(scope.row)"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="paramValue" label="关联参数值">
                                <template slot-scope="scope">
                                    <el-input v-if="scope.row.paramValueSource !== 'customObj'" v-model="scope.row.paramValue"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column key="operation"
                                fixed="right" label="操作" width="60">
                                <template slot-scope="scope">
                                    <a v-if="scope.row.paramValueSource === 'customObj'" @click="addObjectParam('apiParams', scope.$index, scope.row.guid)" href="javascript:void(0)">子属性</a>
                                    <a @click="deleteParam('apiParams', scope.$index)" href="javascript:void(0)">删除</a>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="common-table__bottom-btn">
                            <span @click="addParam('apiParams')">
                                <i class="el-icon-circle-plus"></i>
                                新增
                            </span>
                        </div>
                    </sapi-form-item>
                    <sapi-form-item v-if="tempCustomBtn.usage === 'ajax'" label="弹出提示确认框" prop="useConfirm">
                        <el-checkbox v-model="tempCustomBtn.useConfirm"></el-checkbox>
                    </sapi-form-item>
                    <sapi-form-item v-if="tempCustomBtn.useConfirm && tempCustomBtn.usage === 'ajax'" label="提示确认信息" prop="useConfirm">
                        <el-input v-model="tempCustomBtn.confirmMsg" ></el-input>
                    </sapi-form-item>
                    <sapi-form-item v-if="tempCustomBtn.usage === 'ajax'" label="调用成功提示" prop="apiSuccessMsg">
                        <el-input v-model="tempCustomBtn.apiSuccessMsg" ></el-input>
                    </sapi-form-item>
                    <sapi-form-item v-if="tempCustomBtn.usage === 'ajax'"
                        label="调用成功回调" prop="apiSuccess">
                        <el-select v-model="tempCustomBtn.apiSuccess" placeholder="请选择">
                            <el-option
                                v-for="item in bindingMethods"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </sapi-form-item>
                    <sapi-form-item v-if="tempCustomBtn.usage === 'ajax'"
                        label="调用失败回调" prop="apiFail">
                        <el-select v-model="tempCustomBtn.apiFail" placeholder="请选择">
                            <el-option
                                v-for="item in bindingMethods"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </sapi-form-item>
                </sapi-form>
            </el-scrollbar>
        </div>
    </sapi-popover>
</template>

<script>
/**
 * 配置按钮，比如列表操作区按钮、
 */
import SapiPopover from './sapi-popover'
import BaseCodeEditor from './base-code-editor'
export default {
    inject: ['ueditor'],
    components: {
        SapiPopover,
        BaseCodeEditor
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
            default: '新增操作按钮'
        },
        inRow: {
            type: Boolean,
            default: false
        }
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
            if((_this.usage === 'openPage' && rule.field === 'openUrlParams' ||
                _this.usage === 'ajax' && rule.field === 'apiParams') && errorMsg) {
                callback(new Error(errorMsg));
            } else {
                callback();
            }
        }

        const checkField = (rule, value, callback) => {
            const fieldDD = {
                'openUrl' (rule, value, callback) {
                    if(_this.usage === 'openPage' && !value) {
                        callback(new Error('打开地址不能为空'));
                        return true
                    }
                },
                'apiServer'(rule, value, callback) {
                    if(_this.usage === 'ajax' && !value) {
                        callback(new Error('api服务不能为空'));
                        return true
                    }
                },
                'apiUrl' (rule, value, callback) {
                    if(_this.usage === 'ajax' && !value) {
                        callback(new Error('api地址不能为空'));
                        return true
                    }
                },
                'confirmMsg' (rule, value, callback) {
                    if(_this.usage === 'ajax' && _this.useConfirm && !value) {
                        callback(new Error('提示确认信息不能为空'));
                        return true
                    }
                }
            }

            if(fieldDD[rule.field] && fieldDD[rule.field](rule, value, callback)) {
                return
            }

            callback()
        }

        return {
            usageOptions: [
                { label: '跳转页面', value: 'openPage' },
                // { label: '弹出表单', value: 'openDialog' }, // 可支持
                { label: '异步请求', value: 'ajax' },
                { label: '自定义方法', value: 'custom' }
            ],
            apiTypeOptions: [
                { label: 'get', value: 'get' },
                { label: 'post', value: 'post' },
                { label: 'put', value: 'put' },
                { label: 'delete', value: 'delete' },
            ],
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
            btnTypes: [
                { label: '默认', value: '' },
                { label: '主要按钮', value: 'primary' },
                { label: '危险按钮', value: 'danger' },
            ],
            visible: false,
            tempCustomBtn: this.ueditor.preview.Types['btn'].create({
                isCuston: true
            }),
            tempRules: {
                text: {required: true, message: '按钮名称不能为空', trigger: ['blur']},
                clickEvent: {required: true, message: '点击按钮事件不能为空', trigger: ['blur']},
                openUrlParams: {required: true, validator: checkParams},
                openUrl: {required: true, validator: checkField, trigger: ['blur']},
                apiServer: {required: true, validator: checkField, trigger: ['blur']},
                apiUrl: {required: true, validator: checkField, trigger: ['blur']},
                apiParams: {required: true, validator: checkParams},
                confirmMsg: {required: true, validator: checkField, trigger: ['blur']}
            }
        }
    },
    computed: {
        bindingMethods () {
            const rst = [{ value: '', label: '请选择' }]
            Object.keys(this.ueditor.bindingMethodsOption || {}).forEach((key) => {
                rst.push({ value: key, label: this.ueditor.bindingMethodsOption[key] })
            })

            return rst
        },
        operParamValueSource () {
            const source = this.paramValueSource.slice(0)
            source.push({ label: '数据行属性', value: 'rowProp' })

            return source
        },
        requestParamType () {
            const source = this.paramType.slice(0)
            source.push({label: 'body', value: 'body'})

            return source
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
            if (this.vnode) {
                this.tempCustomBtn = JSON.parse(JSON.stringify(this.vnode))
            } else {
                this.tempCustomBtn = this.ueditor.preview.Types['btn'].create({
                    isCuston: true
                })
            }
        },
        deleteParam (prop, index) {
            this.tempCustomBtn[prop].splice(index, 1)
        },
        addParam (prop) {
            this.tempCustomBtn[prop].push({
                guid: this.$utils.guid(8),
                paramId: '',
                paramType: 'query',
                paramValueSource: 'filterField',
                paramValue: '',
                parentGuid: ''
            })
        },
        addObjectParam (prop, index, parentGuid) {
            this.tempCustomBtn[prop].splice(index + 1, 0, {
                guid: this.$utils.guid(8),
                paramId: '',
                paramType: 'bodyProp',
                paramValueSource: 'const',
                paramValue: '',
                parentGuid: parentGuid
            })
        },
        saveCustomBtn () {
            this.$refs.customBtn.validate((valid) => {
                if (valid) {
                    if (this.vnode) {
                        Object.assign(this.vnode, this.tempCustomBtn)
                        this.ueditor.addRecord()
                    } else {
                        this.$emit('confirm', 'set-operation-btn', this.tempCustomBtn)
                    }

                    this.visible = false
                }
            })
        },
        getApiParamValueSource (rowData) {
            let source = this.inRow ? this.operParamValueSource : this.paramValueSource
            if (rowData.paramType === 'body') {
                source = source.slice(0)
                source.push({label:'自定义对象', value: 'customObj'})
            }
            
            return source
        },
        apiParamTypeChange (rowData, index) {
            if (rowData.paramType !== 'body') {
                if (rowData.paramValueSource === 'customObj') {
                    rowData.paramValueSource = 'const'
                }
                while(this.tempCustomBtn.apiParams[index + 1] &&
                    this.tempCustomBtn.apiParams[index + 1].parentGuid === rowData.guid) {
                    this.tempCustomBtn.apiParams.splice(index + 1, 1)
                }
            }
        },
        apiParamValueSourceChange (rowData, index) {
            if (rowData.paramType !== 'customObj') {
                while(this.tempCustomBtn.apiParams[index + 1] &&
                    this.tempCustomBtn.apiParams[index + 1].parentGuid === rowData.guid) {
                    this.tempCustomBtn.apiParams.splice(index + 1, 1)
                }
            }
        }
    }
}
</script>

<style scoped lang="less">
.custom-fun-code{
    height: 60px;
    width: 100%;
}
.body-prop-param-wrap{
    display:flex;

    .body-prop-prefix{
        white-space:nowrap;
        width: 25px;
        line-height: 36px;
    }
}
</style>
