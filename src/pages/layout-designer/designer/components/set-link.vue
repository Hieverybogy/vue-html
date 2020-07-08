<template>
    <sapi-popover
        v-model="visible"
        :reference="reference"
        placement="left"
        :width="600"
        title="设置链接"
        title-bottom-border-visible
        @confirm="saveLinkConfig"
        trigger="click">
        <div style="height: 400px;padding-top:10px;">
            <el-scrollbar class="page-component__scroll">
                <sapi-form ref="tempOperationColumn" :model="tempLinkConfig" :rules="linkRules" :in-dialog="false">
                    <sapi-form-item label="绑定点击方法" prop="clickEvent">
                        <el-select 
                            v-model="tempLinkConfig.clickEvent" placeholder="请选择">
                            <el-option
                                v-for="item in bindingMethods"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </sapi-form-item>
                    <sapi-form-item label="绑定方法参数" prop="clickEventArgs">
                        <el-input readonly :value="tempLinkConfig.clickEventArgs"></el-input>
                    </sapi-form-item>
                    <sapi-form-item label="v-if表达式" prop="v-if-expression">
                        <el-input v-model="tempLinkConfig['v-if-expression']"></el-input>
                    </sapi-form-item>
                    <sapi-form-item label="链接地址" prop="linkUrl">
                        <el-input v-model="tempLinkConfig.linkUrl"></el-input>
                    </sapi-form-item>
                    <sapi-form-item full label-width="auto" label="链接关联参数" prop="linkParams">
                        <el-table class="common-table" :data="tempLinkConfig.linkParams">
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
                                    <a @click="deleteLinkParam(scope.$index)" href="javascript:void(0)">删除</a>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="common-table__bottom-btn">
                            <span @click="addLinkParam">
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
            tempLinkConfig: {
                clickEvent: '',
                clickEventArgs: '',
                'v-if-expression': '',
                linkParams: [],
                linkUrl: ''
            },
            linkRules: {
                clickEvent: {required: true, message: '点击事件不能为空', trigger: ['change']},
                linkUrl: {required: true, message: '链接地址不能为空', trigger: ['blur']}
            },
            visible: false
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
            this.tempLinkConfig = {
                clickEvent: this.vnode.clickEvent || `${this.vnode.guid}_click`,
                clickEventArgs: this.vnode.clickEventArgs || 'props.row, props.$index',
                'v-if-expression': this.vnode['v-if-expression'],
                linkParams: this.vnode.linkParams && this.vnode.linkParams.slice(0) || [],
                linkUrl: this.vnode.linkUrl
            }
        },
        addLinkParam () {
            this.tempLinkConfig.linkParams.push({
                paramId: '',
                paramType: 'query',
                paramValueSource: 'filterField',
                paramValue: ''
            })
        },
        deleteLinkParam (index) {
            this.tempLinkConfig.linkParams.splice(index, 1)
        },
        saveLinkConfig () {
            this.$refs.tempOperationColumn.validate((valid) => {
                if (valid) {
                    Object.assign(this.vnode, this.tempLinkConfig)
                    this.visible = false
                    this.ueditor.addRecord()
                }
            })
        }
    }
}
</script>