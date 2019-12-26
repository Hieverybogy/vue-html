<template>
    <div class="test">
        <sapi-calendar
            class="auction-calendar"
            ref="calendar"
            @on-broadcast-calendar-change-month="changeMonth"
            :date="date"
            @month-change="onMonthChage"
            @on-date-change="onDateChange"
            v-if="date"
        ></sapi-calendar>
    </div>
</template>

<script>
    import SapiCalendar from './auction-calendar/sapi-calendar.vue'
    export default {
        components: {
            SapiCalendar
        },
        data(){
            return {
                date: new Date()
            }
        },
        methods:{
            prevMonth () {
                if (this.$refs.calendar) {
                    this.$refs.calendar.prevMonth()
                }
            },
            nextMonth () {
                if (this.$refs.calendar) {
                    this.$refs.calendar.nextMonth()
                }
            },
            changeMonth (prevOrNext) {
                if (prevOrNext === 'prev') {
                    this.prevMonth()
                } else if (prevOrNext === 'next') {
                    this.nextMonth()
                }

                this.$nextTick(function () {
                    this.isResetHeight = new Date().getTime()
                })
            },
            onMonthChage (year, month) {
                console.log(`${year}年${month}月`)
            },
            onDateChange (d) {
               
            },
        },
        created(){

        }
    };
</script>
<style lang="less">
  
</style>