<template>
    <sapi-popover 
        v-model="visible"
        :width="600"
        title="数据源设置"
        :reference="reference"
        title-bottom-border-visible
        @confirm="comfirm">

    <!-- <sapi-dialog class="add-multiple-dialog" v-model="visible" width="600px" top="100px" @on-open="open" @on-close="close">
        <span slot="title">数据源设置</span> -->
    
        <div class="add-multiple-dialog">
            <div class="fullline warp-mb-20">
                <div class="warp-box">
                    <div class="wp-50">
                        <span class="w-45 must-star">文本</span>
                        <span class="right-auto-box">
                            <el-input id="label" v-model="model.label" :maxlength="100"></el-input>
                        </span>
                    </div>
                    <div class="wp-50 float-right">
                        <span class="w-45">值</span>
                        <span class="right-auto-box">
                            <el-input id="value" v-model="model.value" :maxlength="100"></el-input>
                        </span>
                    </div>
                </div>

                <el-button size="small" class="float-right" @click="add" v-if="isAdd">添加</el-button>
                <el-button size="small" class="float-right" @click="edit" v-if="!isAdd">编辑</el-button>
            </div>
            <div class="fullline">
                <el-table class="common-table" :data.sync="sources" ref="tableBody" :max-height="maxHeight">
                    <el-table-column :key="item.value" v-for="item in headerData" :prop="item.prop" :label="item.label" :width="item.width">
                    </el-table-column>
                    <el-table-column label="操作" width="90">
                        <template slot-scope="props">
                            <a class="table-btn" href="javascript:void(0)" @click.stop="editItem(props.row,props.$index)">编辑</a>
                            <a class="table-btn" href="javascript:void(0)" @click.stop="deleteItem(props.row,props.$index)">删除</a>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- <div class="footer">
            <el-button size="small" class="cancel" @click="close">取消</el-button>
            <el-button type="primary" size="small" @click="comfirm">确定</el-button>
        </div> -->

    </sapi-popover>
</template>

<script>
import SapiPopover from './sapi-popover'
export default {
    components: {
        SapiPopover
    },
    props: { 
        value: Boolean, 
        option: Array, // popover弹窗指向的元素对象
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
        return {
            visible: false,
            maxHeight: 356,
            sources: [],
            headerData: [
                {
                    prop: 'label',
                    width: '150px',
                    label: '显示文本'
                },
                {
                    prop: 'value',
                    label: '值'
                }
            ],
            model: {
                label: null,
                value: null
            },
            isAdd: true,
            index: -1
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
            this.isAdd = true
            this.model = {
                label: '',
                value: ''
            }
            this.sources = this.option ? [].concat(this.option) : []
        },
        comfirm () {
            this.$emit('callback', this.sources)
            this.$emit('input', false)
        },
        add () {
            if (!this.validate()) {
                return
            }

            this.sources.push(this.model)

            this.model = {
                label: null,
                value: null
            }
        },
        edit () {
            if (!this.validate()) {
                return
            }

            this.$set(this.sources, this.index, this.model)
            this.model = {
                label: null,
                value: null
            }

            this.isAdd = true
        },
        editItem (item, index) {
            this.model = {
                label: item.label,
                value: item.value
            }
            this.index = index
            this.isAdd = false
        },
        deleteItem (item, index) {
            this.sources.splice(index, 1)
        },
        validate () {
            if (!this.model.label) {
                this.$errorTips('键不能为空', '#label')
                return false
            }

            var datas = this.sources
            var flag = this.isAdd
            var index = this.index
            var value = this.model.value
            for (var i = 0, ii = datas.length; i < ii; i++) {
                if (flag) {
                    if (datas[i].value === value) {
                        this.$errorTips('已经存在相同的值', '#value')
                        return false
                    }
                } else if (i !== index && datas[i].value === value) {
                    this.$errorTips('已经存在相同的值', '#value')
                    return false
                }
            }

            return true
        }
    }
}
</script>

<style lang='less'>
.add-multiple-dialog .warp-box {
    float: left;
    width: calc(100% - 60px);
}
.add-multiple-dialog .warp-box .wp-50 {
    display: inline-block;
    width: calc(50% - 14px);
}

.add-multiple-dialog  {
    min-height: 400px;
    padding: 0 10px;

    .w-45 {
        display: inline-block;
        width: 45px;
    }

    .right-auto-box {
        display: inline-block;
        width: calc(100% - 50px);
    }

    .fullline {
        clear: both;
        width: 100%;
        margin-bottom: 10px;
        line-height: 28px;
        vertical-align: top;
    }

    .float-right {
        float: right;
    }
}

.add-multiple-dialog .warp-mb-20 + div {
    padding-top: 10px;
}

</style>
