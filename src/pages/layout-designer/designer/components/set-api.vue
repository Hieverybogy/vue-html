<template>
    <sapi-popover 
        v-model="visible"
        :width="600"
        title="API设置"
        :reference="reference"
        title-bottom-border-visible
        @confirm="comfirm">

        <div style="height:400px;padding-top:10px;">
			<el-scrollbar class="page-component__scroll">
                <sapi-form :in-dialog="false" ref="form" :rules="rules" :model="model">
                    <sapi-form-item label="api服务" prop="server">
                        <el-input v-model="model.server"></el-input>
                    </sapi-form-item>

                    <sapi-form-item label="api地址" prop="path">
                        <el-input v-model="model.path"></el-input>
                    </sapi-form-item>

                    <sapi-form-item full label="api参数" prop="params" label-width="auto">
                        <el-table class="common-table" :data="model.params">
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

                    <sapi-form-item v-if="keyValueVisible" prop="value" label="组件键值对设置">
                        <div>
                            <span class="wp-50">
                                <span class="w-65">label：</span>
                                <div class="right-auto-box">
                                    <el-input v-model="model.label"></el-input>
                                </div>
                            </span>
                            <span class="wp-50 float-right">
                                <span class="w-65">value：</span>
                                <div class="right-auto-box">
                                    <el-input v-model="model.value"></el-input>
                                </div>
                            </span>
                        </div>
                    </sapi-form-item>

                    <sapi-form-item v-if="type === model.struTree.type" prop="struTree" label="组件键值对设置">
                        <div class="stru-tree-container">
                            <div>
                                <span class="w-65">label</span>
                                <div class="right-auto-box">
                                    <el-input v-model="model.struTree.model.label"></el-input>
                                </div>
                            </div>
                            <div>
                                <span class="w-65">value</span>
                                <div class="right-auto-box">
                                    <el-input v-model="model.struTree.model.value"></el-input>
                                </div>
                            </div>
                            <div>
                                <span class="w-65">disabled</span>
                                <div class="right-auto-box">
                                    <el-input v-model="model.struTree.model.disabled"></el-input>
                                </div>
                            </div>
                            <div>
                                <span class="w-65">hasChild</span>
                                <div class="right-auto-box">
                                    <el-input v-model="model.struTree.model.hasChild"></el-input>
                                </div>
                            </div>
                            <div>
                                <span class="w-65">children</span>
                                <div class="right-auto-box">
                                    <el-input v-model="model.struTree.model.children"></el-input>
                                </div>
                            </div>
                        </div>
                    </sapi-form-item>
                </sapi-form>
            </el-scrollbar>
        </div>

    </sapi-popover>
</template>

<script>
import StruTree from '../types/stru-tree/tree-list.js'
import SapiPopover from './sapi-popover'

export default {
    components: {
        SapiPopover
    },
    props: {
        option: [Object, String],
        value: Boolean,
        type: String, 
        // popover弹窗指向的元素对象
        reference: {
            validator: function (el) {
                if (el && el.nodeType === 1) {
                    return true
                }
                return false
            },
            required: true
        } 
    },
    data () {
        const _this = this
        return {
            model: {
                path: null,
                label: 'label',
                value: 'value',
                params: [],
                struTree: {
                    type: StruTree.type,
                    model: {
                        label: 'label',
                        value: 'value',
                        disabled: 'disabled',
                        hasChild: 'hasChild',
                        children: 'children'
                    }
                }
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
            visible: false,
            rules: {
                server: {required: true, message: 'api服务不能为空', trigger: 'blur'},
                path: { required: true, message: 'api地址不能为空', trigger: 'blur' },
                value: {
                    required: true,
                    validator: function (rule, value, callback) {
                        if (!_this.model.value || !_this.model.label) {
                            callback(new Error('组件键值对设置不能为空'))
                            return
                        }

                        callback()
                    },
                    trigger: 'blur'
                },
                struTree: {
                    required: true,
                    validator: function (rule, value, callback) {
                        if (Object.values(_this.model.struTree.model).filter(val => !!val).length < 5) {
                            callback(new Error('组件键值对设置不能为空'))
                            return
                        }

                        callback()
                    },
                    trigger: 'blur'
                }
            }
        }
    },
    computed: {
        keyValueVisible () {
            if (['radio', 'checkbox', 'select'].indexOf(this.type) > -1) {
                return true
            }

            return false
        }
    },
    watch: {
        visible (val) {
            this.$emit('input', val)
        },
        value: {
            handler (val) {
                this.visible = val;
                if (this.visible) {
                    this.open()
                }
            },
            immediate: true
        }
    },
    methods: {
        open () {
            let model = this.model
            let option
            if (this.option) {
                option = JSON.parse(JSON.stringify(this.option))
            } else {
                option = {}
            }
            for (let key in model) {
                if (option.hasOwnProperty(key)) {
                    model[key] = option[key]
                }
            }
        },
        close () {
            this.$emit('input', false)
        },
        addParam () {
            this.model.params.push({
                paramId: '',
                paramType: 'query',
                paramValueSource: 'filterField',
                paramValue: ''
            })
        },
        deleteParam (index) {
            this.model.params.splice(index, 1)
        },
        comfirm () {
            const _this = this
            this.$refs.form.validate(function (valid) {
                if (valid) {
                    _this.$emit('callback', JSON.parse(JSON.stringify(_this.model)))
                    _this.close()
                }
            })
        }
    }
}
</script>
<style lang="less">
.stru-tree-container {
    display: flex;
    flex-wrap: wrap;
    > div {
        flex-grow: 1;
        width: 50%;
        &:nth-child(even) {
            padding-left: 10px;
        }
    }
}
.page-component__scroll {
    height:100%;
    .el-scrollbar__wrap {
        overflow-x: hidden;
    }
}
</style>
