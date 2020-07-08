<template>
    <div>
        <el-date-picker @change="filterChange"
            v-model="value"
            :type="vnode.attrs.multiType === 1 ? vnode.attrs.type : vnode.attrs.type2" 
            :readonly="vnode.attrs.readonly" 
            :placeholder="vnode.attrs.placeholder" 
            range-separator="至"
            :start-placeholder="vnode.attrs.placeholder1"
            :end-placeholder="vnode.attrs.placeholder2"
            :format="vnode.attrs.format"></el-date-picker>
        <!-- <el-date-picker
            v-if="vnode.attrs.multiType === 2"
            v-model="value1"
            :type="vnode.attrs.type2" 
            :readonly="vnode.attrs.readonly" 
            range-separator="至"
            :start-placeholder="vnode.attrs.placeholder1"
            :end-placeholder="vnode.attrs.placeholder2"></el-date-picker> -->
    </div>
</template>

<script>
    export default {
        inject: ['list'],
        props: {
            vnode: {
                type: Object,
                default () {
                    return {
                        attrs: {}
                    }
                }
            },
            params: Object
        },
        data() {
            return {
                value: '',
                value1: ''
            }
        },
        methods: {
            filterChange (data) {
                if (this.vnode.attrs.multiType === 1) {
                    this.params[this.vnode.fieldId] = this.$dateFormat(this.vnode.attrs.format, data)
                } else {
                    this.params[this.vnode.fieldId] = this.$dateFormat(this.vnode.attrs.format, data[0])
                    this.params[this.vnode.fieldId2] = this.$dateFormat(this.vnode.attrs.format, data[1])
                }
                this.list.loadData()
            }
        }
    }
</script>
