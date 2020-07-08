<template>
    <sapi-popover
        v-model="visible"
        :reference="reference"
        placement="left"
        :width="800"
        title="设置底部按钮"
        title-bottom-border-visible
        @confirm="saveFooterBtns"
        trigger="click">
        <div style="height: 400px;padding-top:10px;">
            <el-scrollbar class="page-component__scroll">
                <sapi-form ref="tempFooter" :model="tempFooter" :rules="tempRules" :in-dialog="false">
                    <sapi-form-item 
                        v-for="(btns, prop) in tempFooter" :key="prop" 
                        full :label="titleDD[prop]" :prop="prop" 
                        label-width="auto">
                        <el-table class="common-table" :data="btns">
                            <el-table-column prop="text" label="按钮名称">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.text"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="type" label="按钮类型">
                                <template slot-scope="scope">
                                    <el-select 
                                        v-model="scope.row.type" placeholder="请选择">
                                        <el-option
                                            v-for="item in btnTypes"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="execution" width="80" align="center" label="异步请求">
                                <template slot-scope="scope">
                                    <el-checkbox v-model="scope.row.submit"></el-checkbox>
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
                            <el-table-column prop="execution" width="80" align="center" label="立即执行">
                                <template slot-scope="scope">
                                    <el-checkbox v-model="scope.row.execution"></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column prop="clickEventArgs" label="点击事件参数">
                                <template slot-scope="scope">
                                    <el-input :readonly="!scope.row.execution" v-model="scope.row.clickEventArgs"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="v-if-expression" label="v-if表达式">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row['v-if-expression']"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column key="operation"
                                fixed="right" label="操作" width="80">
                                <template slot-scope="scope">
                                    <a @click="deleteFooterBtn(prop, scope.$index)" href="javascript:void(0)">删除</a>
                                    <a @click="moveUp(prop, scope.$index)" v-show="scope.$index > 0" title="上移" href="javascript:void(0)"><i class="el-icon-top"></i></a>
                                    <a @click="moveDown(prop, scope.$index)" v-show="scope.$index < (btns.length - 1)" title="下移" href="javascript:void(0)"><i class="el-icon-bottom"></i></a>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="common-table__bottom-btn">
                            <span @click="addFooterBtn(prop)">
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
    name: 'footer-btns-setting',
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
        const checkBtns = (rule, value, callback) => {
            let errorMsg = ''
            if(value) {
                value.forEach(function (item, i) {
                    if (!item.text || !item.clickEvent) {
                        errorMsg += `第${i+1}行按钮名称或绑定事件方法不能为空；`
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
            titleDD: {
                Add: '新增模式',
                Edit: '修改模式',
                Adjust: '调整模式',
                View: '查看模式'
            },
            visible: false,
            tempFooter: {
                Add: [],
                Edit: [],
                Delete: []
            },
            tempRules: {
                Add: {validator: checkBtns},
                Edit: {validator: checkBtns},
                Add: {validator: checkBtns}
            },
            btnTypes: [
                { label: '默认', value: '' },
                { label: '主要按钮', value: 'primary' },
                { label: '危险按钮', value: 'danger' },
            ]
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
            this.tempFooter = this.vnode.footer ? JSON.parse(JSON.stringify(this.vnode.footer)) : this.ueditor.preview.getBlankSlots().footer
        },
        addFooterBtn (mode) {
            this.tempFooter[mode].push({
                submit: false, 
                text: '', 
                type: '', 
                clickEvent: '', 
                clickEventArgs: '', 
                'v-if-expression': '', 
                execution: false
            })
        },
        deleteFooterBtn (mode, index) {
            this.tempFooter[mode].splice(index, 1)
        },
        saveFooterBtns () {
            this.$refs.tempFooter.validate((valid) => {
                if (valid) {
                    this.vnode.footer = this.tempFooter
                    this.visible = false
                    this.ueditor.addRecord()
                }
            })
        },
        moveUp (mode, index) {
            const btns = this.tempFooter[mode]
            const currVnode = btns[index]
            const prevVnode = btns[index - 1]

            this.$set(btns, index - 1, currVnode)
            this.$set(btns, index, prevVnode)
        },
        moveDown (mode, index) {
            const btns = this.tempFooter[mode]
            const currVnode = btns[index]
            const nextVnode = btns[index + 1]

            this.$set(btns, index, nextVnode)
            this.$set(btns, index + 1, currVnode)
        }
    }
}
</script>