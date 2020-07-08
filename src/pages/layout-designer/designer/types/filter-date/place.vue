<template>
    <span>
        <span class="sapi-time-q-item" :class="[{'active' : dateType === '' && (rangeDate && rangeDate.length === 0 || !rangeDate)}]">全部</span>
        <span class="sapi-time-q-item" :class="[{'active' : dateType === 'lastMonth'}]">最近一个月</span>
        <span class="sapi-time-q-item" :class="[{'active' : dateType === 'lastThreeMonths'}]">最近三个月</span>
        <span class="sapi-time-q-item" :class="[{'active' : dateType === 'lastYear'}]">最近一年</span>
        <el-date-picker
            class="sapi-time-q-date"
            v-model="rangeDate"
            type="daterange"
            range-separator="至"
            :start-placeholder="vnode.attrs.startPlaceholder"
            :end-placeholder="vnode.attrs.endPlaceholder"
        ></el-date-picker>
    </span>
</template>

<script>
    import PlaceMixin from '../place-mixin'
    export default {
        mixins: [PlaceMixin],
        props: {
            vnode: {
                type: Object,
                default () {
                    return {
                        attrs: {}
                    }
                }
            }
        },
        data() {
            return {
                value: '',
                value1: '',
                rangeDate: [],
                dateType: ''
            }
        }
    }
</script>
