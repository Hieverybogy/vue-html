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
                    <sapi-form-item v-if="tempCustomBtn.usage === 'custom'" label="立即执行" prop="execution">
                        <el-checkbox v-model="tempCustomBtn.execution"></el-checkbox>
                    </sapi-form-item>
                    <sapi-form-item v-if="tempCustomBtn.usage === 'custom'" label="点击事件参数" prop="clickEventArgs">
                        <el-input v-model="tempCustomBtn.clickEventArgs"></el-input>
                    </sapi-form-item>

                    <sapi-form-item v-if="tempCustomBtn.usage === 'openDialog'"
                        label="应用编号" prop="appCode">
                        <el-input v-model="tempCustomBtn.appCode"></el-input>
                    </sapi-form-item>
                    <sapi-form-item v-if="tempCustomBtn.usage === 'openDialog'"
                        label="关联表单id" prop="relateFormId">
                        <el-input v-model="tempCustomBtn.relateFormId"></el-input>
                    </sapi-form-item>
                    <sapi-form-item v-if="tempCustomBtn.usage === 'openDialog'"
                        label="表单模式mode" prop="relateFormMode">
                        <el-select v-model="tempCustomBtn.relateFormMode" 
                            placeholder="请选择">
                            <el-option
                                v-for="item in modeValueOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </sapi-form-item>
                    <sapi-form-item v-if="tempCustomBtn.usage === 'openDialog'"
                        label="表单提交模式" prop="formSubmitType">
                        <el-radio-group v-model="tempCustomBtn.formSubmitType">
                            <el-radio  v-for="item in formSubmitTypes"
                                :key="item.value" 
                                :label="item.value">{{item.label}}</el-radio>
                        </el-radio-group>
                    </sapi-form-item>
                    <sapi-form-item v-if="tempCustomBtn.usage === 'openDialog' && tempCustomBtn.relateFormMode !== 'Add'"
                        label="表单主键" prop="keysParams" full label-width="auto">
                        <sapi-param-setting 
                            :target="tempCustomBtn.keysParams"
                            :in-row="inRow"
                            :in-list="inList"
                            type="object">
                        </sapi-param-setting>
                    </sapi-form-item>
                    <sapi-form-item v-if="tempCustomBtn.usage === 'openDialog'"
                        label="弹窗option参数" prop="formOptions" full label-width="auto">
                        <sapi-param-setting 
                            :target="tempCustomBtn.formOptions"
                            :in-row="inRow"
                            :in-list="inList"
                            type="object">
                        </sapi-param-setting>
                    </sapi-form-item>
                    <sapi-form-item v-if="tempCustomBtn.usage === 'openDialog'"
                        label="表单回调方法" :prop="tempCustomBtn.relateFormMode === 'View' ? '' : 'formConfirm'">
                        <el-select v-model="tempCustomBtn.formConfirm" placeholder="请选择">
                            <el-option
                                v-for="item in bindingMethods"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
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
                    <sapi-form-item v-if="tempCustomBtn.usage === 'openPage'" full label-width="auto" label="打开地址参数" prop="openUrlParams">
                        <sapi-param-setting 
                            :target="tempCustomBtn.openUrlParams"
                            :in-row="inRow"
                            :in-list="inList">
                        </sapi-param-setting>
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
                        <sapi-param-setting 
                            :target="tempCustomBtn.apiParams"
                            :in-row="inRow"
                            :in-list="inList"
                            type="api" :request-type="tempCustomBtn.apiType">
                        </sapi-param-setting>
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
import SapiParamSetting from './sapi-param-setting'
export default {
    inject: ['ueditor'],
    components: {
        SapiPopover,
        SapiParamSetting
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
        },
        inList: {
            type: Boolean,
            default: true
        },
        // 创建btn节点的初始化属性
        createOpts: {
            type: Object,
            default () {
                return {
                    isCustom: true
                }
            }
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
            if((_this.tempCustomBtn.usage === 'openPage' && rule.field === 'openUrlParams' ||
                _this.tempCustomBtn.usage === 'ajax' && rule.field === 'apiParams' ||
                _this.tempCustomBtn.usage === 'openDialog' && rule.field === 'keysParams' && _this.tempCustomBtn.relateFormMode !== 'Add') && errorMsg) {
                callback(new Error(errorMsg));
            } else {
                callback();
            }
        }

        const checkField = (rule, value, callback) => {
            const fieldDD = {
                'openUrl' (rule, value, callback) {
                    if(_this.tempCustomBtn.usage === 'openPage' && !value) {
                        callback(new Error('打开地址不能为空'));
                        return true
                    }
                },
                'apiServer'(rule, value, callback) {
                    if(_this.tempCustomBtn.usage === 'ajax' && !value) {
                        callback(new Error('api服务不能为空'));
                        return true
                    }
                },
                'apiUrl' (rule, value, callback) {
                    if(_this.tempCustomBtn.usage === 'ajax' && !value) {
                        callback(new Error('api地址不能为空'));
                        return true
                    }
                },
                'confirmMsg' (rule, value, callback) {
                    if(_this.tempCustomBtn.usage === 'ajax' && _this.tempCustomBtn.useConfirm && !value) {
                        callback(new Error('提示确认信息不能为空'));
                        return true
                    }
                },
                'appCode' (rule, value, callback) {
                    if (_this.tempCustomBtn.usage === 'openDialog' && !value) {
                        callback(new Error('应用编号不能为空'))
                    }
                },
                'relateFormId' (rule, value, callback) {
                    if (_this.tempCustomBtn.usage === 'openDialog' && !value) {
                        callback(new Error('关联表单id不能为空'))
                    }
                },
                'formConfirm' (rule, value, callback) {
                    if (_this.tempCustomBtn.usage === 'openDialog' && _this.tempCustomBtn.relateFormMode !== 'View' && !value) {
                        callback(new Error('表单回调方法不能为空'))
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
                { label: '弹出表单', value: 'openDialog' }, // 可支持
                { label: '异步请求', value: 'ajax' },
                { label: '自定义方法', value: 'custom' }
            ],
            apiTypeOptions: [
                { label: 'get', value: 'get' },
                { label: 'post', value: 'post' },
                { label: 'put', value: 'put' },
                { label: 'delete', value: 'delete' },
            ],
            modeValueOptions: [
                {value: 'Add', label: '表单新增'},
                {value: 'Edit', label: '表单修改'},
                {value: 'Adjust', label: '表单调整'},
                {value: 'View', label: '表单查看'}
            ],
            btnTypes: [
                { label: '默认', value: '' },
                { label: '主要按钮', value: 'primary' },
                { label: '危险按钮', value: 'danger' },
            ],
            formSubmitTypes: [
                { label: '异步提交', value: 'ajax' },
                { label: '回调返回', value: 'callback' }
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
                confirmMsg: {required: true, validator: checkField, trigger: ['blur']},
                appCode: {required: true, validator: checkField, trigger: ['blur']},
                relateFormId: {required: true, validator: checkField, trigger: ['blur']},
                keysParams: {required: true, validator: checkParams},
                formConfirm: {required: true, validator: checkField}
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
                } else {
                    this.vnode = null
                }
            },
            immediate: true
        }
    },
    methods: {
        reSet () {
            this.$refs.customBtn && this.$refs.customBtn.resetFields()
            console.log(this.vnode)
            if (this.vnode) {
                this.tempCustomBtn = JSON.parse(JSON.stringify(this.vnode))
            } else {
                this.tempCustomBtn = this.ueditor.preview.Types['btn'].create(this.createOpts)
            }
        },
        saveCustomBtn () {
            this.$refs.customBtn.validate((valid) => {
                if (valid) {
                    if (this.vnode) {
                        Object.assign(this.vnode, this.tempCustomBtn)
                        this.ueditor.addRecord()
                    } else {
                        this.$emit('confirm', 'set-operation-btn', Object.assign({}, this.tempCustomBtn))
                    }

                    this.visible = false
                }
            })
        }
    }
}
</script>

<style scoped lang="less">
.custom-fun-code{
    height: 60px;
    width: 100%;
}
</style>
