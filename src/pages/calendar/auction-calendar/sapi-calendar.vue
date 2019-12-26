<template>
    <div class="sapi-calendar_wrap">
        <table class="sapi-calendar_table">
            <thead ref="calendarHeader">
                <tr>
                    <th>日</th>
                    <th>一</th>
                    <th>二</th>
                    <th>三</th>
                    <th>四</th>
                    <th>五</th>
                    <th>六</th>
                </tr>
            </thead>
            <tbody>
                <tr :ref="'weekRow_' + i" v-for="(week, i) in weeks">
                    <td v-for="d in week" :class="{
                        'vux-1px-b': i < weeks.length - 1,
                        'sapi-calendar_today': d.today,
                        'sapi-calendar_sele-day': d.seleDay,
                        'sapi-calendar_prev-month': d.type === 'prevMonth',
                        'sapi-calendar_next-month': d.type === 'nextMonth'
                        }">
                        <div class="sapi-calendar_cell-wrap">
                            <slot name="cell" v-bind:date="d">
                                <div class="sapi-calendar_cell" @click="onDateClick(d)">
                                    <span class="sapi-calendar_date">{{ d.date }}</span>
                                    <span class="sapi-calendar_lunar">{{ d.lunarText }}</span>
                                </div>
                            </slot>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="useFixedHeader" 
            v-show="headerScrollOver"
            :style="{top: fixedHeaderTop + 'px'}"
            class="sapi-calendar_fixed-header">
            <table class="sapi-calendar_table">
                <thead>
                    <tr>
                        <th>日</th>
                        <th>一</th>
                        <th>二</th>
                        <th>三</th>
                        <th>四</th>
                        <th>五</th>
                        <th>六</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="0 <= seleDateWeeksIndex && seleDateWeeksIndex < weeks.length"
                        v-show="seleRowScrollOver">
                        <td v-for="d in weeks[seleDateWeeksIndex]" :class="{
                            'sapi-calendar_today': d.today,
                            'sapi-calendar_sele-day': d.seleDay,
                            'sapi-calendar_prev-month': d.type === 'prevMonth',
                            'sapi-calendar_next-month': d.type === 'nextMonth'
                            }" class="vux-1px-b">
                            <div class="sapi-calendar_cell-wrap">
                                <slot name="cell" v-bind:date="d">
                                    <div class="sapi-calendar_cell" @click="onDateClick(d)">
                                        <span class="sapi-calendar_date">{{ d.date }}</span>
                                        <span class="sapi-calendar_lunar">{{ d.lunarText }}</span>
                                    </div>
                                </slot>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import AuctionCalendar from './calendar.js'

export default {
    name: 'auction-calendar',
    model: {
        handler: 'update-date',
        prop: 'date'
    },
    props: {
        // 当前日期
        date: {
            type: [String, Date],
            required: true
        },
        // 单元格重新渲染
        cellRender: {
            type: Function
        },
        config: {
            type: Object,
            default () {
                return {}
            }
        },
        useFixedHeader: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            weeks: null,
            seleDate: null,
            seleDateWeeksIndex: 0,
            // 日历头部是否滚过标题栏
            headerScrollOver: false,
            // 选中日期行是否滚过标题栏
            seleRowScrollOver: false,
            fixedHeaderTop: 0
        }
    },
    watch: {
        date (val, prevVal) {
            this.seleDate = val || new Date()
            if (val !== prevVal && this._calendar) {
                this._calendar.updateSeleDate(this.seleDate)

                this.updateData()
            }
        }
    },
    methods: {
        prevMonth () {
            if (this._calendar) {
                this._calendar.prevMonth()
                this.updateData()
            }
        },
        nextMonth () {
            if (this._calendar) {
                this._calendar.nextMonth()
                this.updateData()
            }
        },
        updateDate (date) {
            if (this._calendar) {
                this._calendar.updateSeleDate(date)
                this.updateData()
            }
        },
        onDateClick (d) {
            if (this._calendar) {
                this._calendar.updateSeleDate(d.datetime)
                this.updateData()
            }

            this.$emit('on-date-click', d)
        },
        updateData () {
            if (this.weeks !== this._calendar.weeks) {
                this.$emit('month-change', this._calendar.year, this._calendar.month)
            }
            this.weeks = this._calendar.weeks
            this.seleDateWeeksIndex = this._calendar.seleDayWeeksIndex

            if (!this.seleDate || this.seleDate.getFullYear() !== this._calendar.year ||
                this.seleDate.getMonth() + 1 !== this._calendar.month ||
                this.seleDate.getDate() !== this._calendar.selDate) {
                this.seleDate = this._calendar.date
                this.$emit('on-date-change', {
                    dateTime: this.seleDate,
                    year: this._calendar.year,
                    month: this._calendar.month,
                    date: this._calendar.selDate,
                    // 小于当前日期表示过去时
                    isPastDate: new Date(`${this._calendar.year}/${this._calendar.month}/${this._calendar.selDate}`) < new Date(`${this._calendar.todayYear}/${this._calendar.todayMonth}/${this._calendar.todayDate}`)
                })
            }
        },
        initFixedHeader () {
            const _this = this
            const top = this.fixedHeaderTop
            const headerHeight = this.$refs.calendarHeader.getBoundingClientRect().height
            this.fixedHeaderFn = function (scroller, scrollTop) {
                const pos = _this.$el.getBoundingClientRect()
                _this.headerScrollOver = pos.top <= top
                const selePos = _this.$refs['weekRow_' + _this.seleDateWeeksIndex][0].getBoundingClientRect()
                _this.seleRowScrollOver = selePos.top <= top + headerHeight
            }
            this.$root.$on('page-body-scroll', this.fixedHeaderFn)
        }
    },
    created () {
        this.seleDate = this.date || new Date()
        this._calendar = new AuctionCalendar({
            date: this.seleDate,
            config: this.config
        })

        this.updateData()
        this.fixedHeaderTop = parseFloat(this.$root.$layoutVm ? this.$root.$layoutVm.bodyPaddingTop : 0)
    },
    mounted () {
        if (this.useFixedHeader) {
            this.initFixedHeader()
        }
    },
    beforeDestroy () {
        this.fixedHeaderFn && this.$root.$off('page-body-scroll', this.fixedHeaderFn)
    }
}
</script>

<style lang="less">
    .sapi-calendar_wrap {
        background: #FFFFFF;
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.15);
        border-radius: 4px;
        margin: 10px;
    }

    .sapi-calendar_table {
        table-layout: fixed;
        width: 100%;
        border-collapse: collapse;

        >thead th {
            font-size: 12px;
            color: #1F2D3D;
            font-weight: normal;
            text-align: center;
            line-height: 1em;
            height: 37px;
            background: rgba(218,218,218,0.10);
        }
        
        td, th {
            padding: 0px;
        }

        .sapi-calendar_date{
            font-size: 18px;
            color: #1F2D3D;
            text-align: center;
            line-height: 1em;
            display:block;
        }

        .sapi-calendar_lunar {
            font-size: 10px;
            color: #7B7B7B;
            letter-spacing: 0;
            text-align: center;
            display:block;
        }

        .sapi-calendar_today{
            .sapi-calendar_date{
                color: #E43333;
            }
        }

        .sapi-calendar_sele-day{
            .sapi-calendar_cell{
                background: rgba(255,75,75,0.80);
            }
            .sapi-calendar_date, .sapi-calendar_lunar{
                color: #FFFFFF;
            }
        }

        .sapi-calendar_prev-month, .sapi-calendar_next-month{
            .sapi-calendar_date, .sapi-calendar_lunar {
                color: #B2B2B2;
            }
        }
    }

    .sapi-calendar_cell-wrap{
        padding: 5px 7px;
        .sapi-calendar_cell{
            border-radius: 4px;
            transition: background-color 200ms;
            padding: 4px 0;
            border: 1px solid transparent;
        }
    }

    .sapi-calendar_fixed-header {
        background: #FFFFFF;
        margin: 0 10px;
        position: absolute;
        right:0;
        left:0;
        z-index: 1;
    }
</style>
