<template>
    <sapi-popover
        v-model="visible"
        :reference="reference"
        placement="left"
        :width="600"
        title="设置导入"
        title-bottom-border-visible
        @confirm="saveImport"
        trigger="click">
        <div style="height: 400px;padding-top:10px;">
            <el-scrollbar class="page-component__scroll">
                <sapi-form ref="tempImportBtn" 
                    :model="tempImportBtn" 
                    :rules="tempRules" 
                    :in-dialog="false">
                    <sapi-form-item label="按钮名称" prop="text">
                        <el-input v-model="tempImportBtn.text"></el-input>
                    </sapi-form-item>
                    <sapi-form-item label="v-if表达式" prop="permission">
                        <el-input v-model="tempImportBtn['v-if-expression']"></el-input>
                    </sapi-form-item>
                    <sapi-form-item label="模板来源" prop="templateSource">
                        <el-radio-group v-model="vnode.templateSource">
                            <el-radio label="custom">自定义</el-radio>
                            <el-radio label="api">通过api获取</el-radio>
                        </el-radio-group>
                    </sapi-form-item>
                    <sapi-form-item v-show="vnode.templateSource === 'custom'" label="定义模板服务" prop="permission">
                        <el-input v-model="tempImportBtn.customTemplateServer"></el-input>
                    </sapi-form-item>
                    <sapi-form-item v-show="vnode.templateSource === 'custom'" label="定义模板url" prop="permission">
                        <el-input v-model="tempImportBtn.customTemplateUrl"></el-input>
                    </sapi-form-item>
                    <sapi-form-item v-show="vnode.templateSource === 'custom'" 
                        full label-width="auto" label="定义模板参数" prop="params">
                        <el-table class="common-table" :data="tempImportBtn.customTemplateParams">
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
                                    <el-input v-model="scope.row.paramValue" ></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column key="operation"
                                fixed="right" label="操作" width="60">
                                <template slot-scope="scope">
                                    <a @click="deleteParam('customTemplateParams', scope.$index)" href="javascript:void(0)">删除</a>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="common-table__bottom-btn">
                            <span @click="addParam('customTemplateParams')">
                                <i class="el-icon-circle-plus"></i>
                                新增
                            </span>
                        </div>
                    </sapi-form-item>
                    <sapi-form-item v-show="vnode.templateSource === 'api'" label="获取模板服务" prop="templateServer">
                        <el-input v-model="tempImportBtn.templateApiServer"></el-input>
                    </sapi-form-item>
                    <sapi-form-item v-show="vnode.templateSource === 'api'" label="获取模板api" prop="templateUrl">
                        <el-input v-model="tempImportBtn.templateApi"></el-input>
                    </sapi-form-item>
                    <sapi-form-item v-show="vnode.templateSource === 'api'" full label-width="auto" label="获取模板参数" prop="templateApiParams">
                        <el-table class="common-table" :data="tempImportBtn.templateApiParams">
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
                                    <el-input v-model="scope.row.paramValue" ></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column key="operation"
                                fixed="right" label="操作" width="60">
                                <template slot-scope="scope">
                                    <a @click="deleteParam('templateApiParams', scope.$index)" href="javascript:void(0)">删除</a>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="common-table__bottom-btn">
                            <span @click="addParam('templateApiParams')">
                                <i class="el-icon-circle-plus"></i>
                                新增
                            </span>
                        </div>
                    </sapi-form-item>
                    <sapi-form-item v-show="vnode.templateSource === 'api'" label="upload-id" prop="uploadId">
                        <el-input v-model="tempImportBtn.uploadId"></el-input>
                    </sapi-form-item>
                    <sapi-form-item label="导入弹窗标题" prop="title">
                        <el-input v-model="tempImportBtn.title"></el-input>
                    </sapi-form-item>
                    <sapi-form-item label="导入api服务" prop="importServer">
                        <el-input v-model="tempImportBtn.importServer"></el-input>
                    </sapi-form-item>
                    <sapi-form-item label="导入api地址" prop="importApi">
                        <el-input v-model="tempImportBtn.importApi"></el-input>
                    </sapi-form-item>
                    <sapi-form-item label="contentType">
                        <el-radio-group v-model="vnode.importApiContentType">
                            <el-radio label="json">json</el-radio>
                            <el-radio label="form">form</el-radio>
                        </el-radio-group>
                    </sapi-form-item>
                    <sapi-form-item 
                         full label-width="auto" label="导入api参数" prop="importApiParams">
                        <el-table class="common-table" :data="tempImportBtn.importApiParams">
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
                                    <el-input v-model="scope.row.paramValue" ></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column key="operation"
                                fixed="right" label="操作" width="60">
                                <template slot-scope="scope">
                                    <a @click="deleteParam('importApiParams', scope.$index)" href="javascript:void(0)">删除</a>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="common-table__bottom-btn">
                            <span @click="addParam('importApiParams')">
                                <i class="el-icon-circle-plus"></i>
                                新增
                            </span>
                        </div>
                    </sapi-form-item>
                    <sapi-form-item label="导入成功回调" prop="importSuccess">
                        <el-select v-model="tempImportBtn.importSuccess" placeholder="请选择">
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
        const checkFields = function (rule, value, callback) {
            const errorMsgs = {
                customTemplateServer: '定义模板服务不能为空',
                customTemplateUrl: '定义模板url不能为空',
                templateApiServer: '获取模板服务不能为空',
                templateApi: '获取模板api不能为空',
                uploadId: 'upload-id不能为空'
            }

            if (_this.tempImportBtn.templateSource === 'custom') {
                if (['customTemplateServer', 'customTemplateUrl'].indexOf(rule.field) > -1 && !value) {
                    callback(new Error(errorMsgs[rule.field]))
                    return
                }

                if (rule.field === 'customTemplateParams') {
                    checkParams(rule, value, callback)
                }
            } else {
                if (['templateApiServer', 'templateApi', 'uploadId'].indexOf(rule.field) > -1 && !value) {
                    callback(new Error(errorMsgs[rule.field]))
                    return
                }
                
                if (rule.field === 'templateApiParams') {
                    checkParams(rule, value, callback)
                }
            }

            if (rule.field === 'importApiParams') {
                checkParams(rule, value, callback)
            }

            callback()
        }

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
            tempImportBtn: {
                type: 'import', 
                text: '导入',
                templateSource: 'custom',
                customTemplateServer: '',
                customTemplateUrl: '',
                customTemplateParams: [],
                templateApiServer: 'sysServer',
                templateApi: '/docs/file',
                templateApiParams: [
                    { paramId: 'indexid', paramType: 'query', paramValueSource: 'const', paramValue: ''},
                    { paramId: 'code', paramType: 'query', paramValueSource: 'const', paramValue: ''}
                ],
                uploadId: '',
                'v-if-expression': 'permissions.IMPORT',
                title: '',
                importServer: '',
                importApi: '',
                importApiContentType: 'json',
                importApiParams: [],
                importSuccess: 'loadData'
            },
            tempRules: {
                text: {required: true, message: '按钮名称不能为空', trigger: ['blur']},
                customTemplateServer: { validator: checkFields },
                customTemplateUrl: { validator: checkFields },
                customTemplateParams: { validator: checkFields },
                templateApiServer: { validator: checkFields },
                templateApi: { validator: checkFields },
                templateApiParams: { validator: checkFields },
                uploadId: { validator: checkFields },
                title: {required: true, message: '导入标题不能为空', trigger: ['blur']},
                importServer: {required: true, message: '导入api服务不能为空', trigger: ['blur']},
                importApi: {required: true, message: '导入api地址不能为空', trigger: ['blur']},
                importApiParams: { validator: checkFields },
                importSuccess: {required: true, message: '导入成功回调不能为空', trigger: ['blur']}
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
                }
            },
            immediate: true
        }
    },
    methods: {
        reSet () {
            this.tempImportBtn = JSON.parse(JSON.stringify(this.vnode))
        },
        saveImport () {
            this.$refs.tempImportBtn.validate((valid) => {
                if (valid) {
                    Object.assign(this.vnode, this.tempImportBtn)
                    this.visible = false
                    this.ueditor.addRecord()
                }
            })
        },
        addParam (prop) {
            this.tempImportBtn[prop].push({
                paramId: '',
                paramType: 'query',
                paramValueSource: 'filterField',
                paramValue: ''
            })
        },
        deleteParam (prop, index) {
            this.tempImportBtn[prop].slice(index, 1)
        }
    }
}
</script>
