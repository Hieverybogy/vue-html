export const pagerMixin = `
export default {
    data: function () {
        return {
            params: {
                pageNum: 1,
                pageSize: 20
            },
            pageTotal: 0,
            pageArr: [10, 20, 40, 60, 100],
            pageFunc: null,
            layout: "total, sizes, next, pager, prev",
            maxBodyHeight: 0,
            currentSelectRows: []
        }
    },
    methods: {
        pageSizeChange: function (val) {
            this.params.pageSize = val;
            if (this.params.pageNum !== 1) {
                this.params.pageNum = 1;
            }

            if (typeof this.pageFunc === "function") {
                this.pageFunc();
            }
        },
        pageCurrentChange: function (val) {
            this.params.pageNum = val;
            if (typeof this.pageFunc === "function") {
                this.pageFunc();
            }
        }
    },
    created () {
        var _this = this
        // 监听异步标签页触发的刷新页面，触发点在@/components/layout/top-menus-layout/base-layout.vue
        // add by zhangmq 2018-10-12
        this.$root.$on('async-tab_refresh-page-table', function (pageTableId) {
            // 每个页面需定义一个分页表格的唯一标识
            if (typeof pageTableId === 'object' &&
                pageTableId.pageTableId === _this.pageTableId &&
                typeof _this[pageTableId.methodName] === 'function') {
                // 传对象可指定执行的方法：{ pageTableId: '', methodName: ''}
                _this[pageTableId.methodName](_this.params.pageNum)
            } else if (pageTableId === _this.pageTableId) {
                _this.pageCurrentChange(_this.params.pageNum)
            }
        })
    },
    watch: {
        pageTotal(val) {
            let total = (this.params.pageNum - 1) * this.params.pageSize + 1;
            if (total > val && this.params.pageNum > 1) {
                this.params.pageNum--;
            }
        }
    }
}`

export const moreFilterMixin = `
export default {
    data: function () {
        return {
            dateType: ''
        }
    },
    methods: {
        /**
         *  {
         *      key: 当前筛选唯一标识
         *      label: 当前筛选结果文本
         *      remove: 重置函数
         *  }
        */
        addFilterRecord (record) {
            var _this = this
            if (!this._isInjectReload) {
                this._isInjectReload = true
                // 注册当前列表的刷新方法
                this.$children[0].$emit('inject-reload', function () {
                    _this._filterReload()
                })
            }

            this.$children[0].$emit('add-filter-record', record)
        },
        handleQtime(key, method, n, dateTypeProp = 'dateType') {
            var end = new Date()
            var start
            var label
            let date = null;
            switch(n) {
                // 最近一个月
                case 1:
                case 'lastMonth':
                    start = this.$utils.getDateByMonthApart(end, -1)
                    this[key] = [start, end];
                    label = '最近一个月'
                    break
                // 最近三个月
                case 2:
                case 'lastThreeMonths':
                    start = this.$utils.getDateByMonthApart(end, -3)
                    this[key] = [start, end];
                    label = '最近三个月'
                    break
                // 最近一年
                case 3:
                case 'lastYear':
                    start = this.$utils.getDateByYearApart(end, -1)
                    this[key] = [start, end];
                    label = '最近一年'
                    break
                case '':
                    this[key] = [];
                    label = ''
            }
            this[method](this[key], label)
            this[dateTypeProp] = n;
        }
    },
    created () {
        this._isInjectReload = false
        // 删除过滤结果或者清除都会自动触发这个方法
        this._filterReload = this.loadData
    }
}
`
