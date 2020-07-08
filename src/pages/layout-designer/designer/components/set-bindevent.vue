<template>
    <sapi-popover 
        v-model="visible"
        :width="800"
        title="设置绑定事件"
        :reference="reference"
        @confirm="confirm">

        <div style="min-height: 300px; padding: 0 10px;">
            <el-table class="common-table" :data="bindingTable" ref="tableBody">
                <el-table-column prop="event" label="事件名称" width="100">
                </el-table-column>
                <el-table-column prop="remark" label="事件说明" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="defaultArguments" label="默认参数" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="bindEvent" label="绑定方法">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.name" placeholder="请选择">
                            <el-option
                                v-for="item in bindingMethods"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="execution" label="立即执行" width="80" align="center">
                    <template slot-scope="scope">
                        <el-checkbox :readonly="!scope.row.name" v-model="scope.row.execution"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="params" label="自定义参数">
                    <template slot-scope="scope">
                        <el-input :readonly="!scope.row.execution" v-model="scope.row.params"></el-input>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </sapi-popover>
</template>

<script>
import SapiPopover from './sapi-popover'
export default {
    components: {
        SapiPopover
    },
    props: {
        // 弹窗可见
        value: {
            type: Boolean,
            required: true
        },
        option:{
            type: Object,
            required: true
        },
        methodsOption: {
            type: Object,
            required: true
        },
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
        return {
            visible: false,
            width: '80%',
            top: '10%',
            vnode: [],
            /**
             * [{
             *      event: 'change', 
             *      remark: '仅在输入框失去焦点或用户按下回车时触发', 
             *      defaultArguments: '(value: string | number)' },
             * }]
             */
            eventTypes: []
        }
    },
    computed: {
        bindingTable () {
            if (!this.visible) {
                return []
            }
            // vnode.listeners
            const listeners = this.vnode.listeners || {}
            const rst = []            
            this.eventTypes.forEach((type) => {
                const eventObj = listeners[type.event]
                rst.push({
                    ...type,
                    name: eventObj && eventObj.name || '',
                    execution: eventObj && eventObj.execution || false,
                    // 支持字符串和数组，常量变量需要单引号括起来
                    args: eventObj && (this.$utils.isArray(eventObj.args) ? eventObj.args.join(',') : (eventObj.args || '')) || ''
                })
            })

            return rst
        },
        bindingMethods () {
            const rst = [{value: '', label: '请选择'}]
            Object.keys(this.methodsOption || {}).forEach((key) => {
                rst.push({value: key, label: this.methodsOption[key]})
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
                    this.open()
                }
            },
            immediate: true
        }
    },
    methods: {
        open () {
            for(let prop in this.option) {
                this[prop] = this.option[prop]
            }
        },
        confirm () {
            const listeners = {}
            this.bindingTable.forEach((row) => {
                if (row.name) {
                    listeners[row.event] = { name: row.name, execution: row.execution, args: row.args }
                }
            })

            this.$set(this.vnode, 'listeners', listeners)
            this.$emit('input', false)
        }
    }
}
</script>