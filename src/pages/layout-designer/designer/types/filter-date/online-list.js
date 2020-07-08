import Base from './base.js'
const Type = Object.create(Base)

Type['online-list'] = {
    create (opts, parentVnode, context) {
        const defaultOpts = {
            guid: 'filterDate_' + Vue.$utils.guid(8),
            type: 'filterDate',
            model: '',
            // 绑定字段：开始日期
            fieldId: null,
            // 结束日期
            endFieldId: null,
            // 文本
            label: '时间范围：',
            attrs: {
                startPlaceholder: '开始日期',
                endPlaceholder: '结束日期'
            }
        }

        return Object.assign(defaultOpts, opts || {})
    },
    parseVnode (vnode, parentVnode, context) {
        const dataProp = `${vnode.guid}_date`
        const dateType = `${vnode.guid}_dateType`
        const changeDate = `${vnode.guid}_changeDate`
        context.data[dataProp] = []
        if (!context.data[vnode.model]) {
            context.data[vnode.model] = {}
        }
        context.data[vnode.model][vnode.fieldId] = null
        context.data[vnode.model][vnode.endFieldId] = null
        context.methods[changeDate] = {
            name: changeDate,
            args: 'date, label',
            content: `
            var _this = this;
            var params = this.params;

            var _label = '';
            if (date && date.length > 0) {
                params.${vnode.fieldId} = this.$dateFormat("yyyy-MM-dd hh:mm:ss", date[0])
                params.${vnode.endFieldId} = this.$dateFormat("yyyy-MM-dd hh:mm:ss", date[1])
                _label = this.$utils.isString(label) ? ('${vnode.label}' + label) : ('${vnode.label}' + params.formalStartDate.slice(0, 10) + '至' + params.formalEndDate.slice(0, 10))
            } else {
                params.${vnode.fieldId} = ''
                params.${vnode.endFieldId} = ''
            }

            this.addFilterRecord({
                key: '${dataProp}',
                label: _label,
                remove() {
                    _this.${dataProp} = [];
                    _this.params.${vnode.fieldId} = null;
                    _this.params.${vnode.endFieldId} = null;
                    _this.${dateType} = ''
                }
            });
            this.${dateType} = '';
            this.loadData();
            `
        }

        return `<sapi-filter-item label="${vnode.label}">
            <span class="sapi-time-q-item" :class="[{'active' : ${dateType} === '' && (${dataProp} && ${dataProp}.length === 0 || !${dataProp})}]" @click="handleQtime('${dataProp}', '${changeDate}', '', '${dateType}')">全部</span>
            <span class="sapi-time-q-item" :class="[{'active' : ${dateType} === 'lastMonth'}]" @click="handleQtime('${dataProp}', '${changeDate}', 'lastMonth', '${dateType}')">最近一个月</span>
            <span class="sapi-time-q-item" :class="[{'active' : ${dateType} === 'lastThreeMonths'}]" @click="handleQtime('${dataProp}', '${changeDate}', 'lastThreeMonths', '${dateType}')">最近三个月</span>
            <span class="sapi-time-q-item" :class="[{'active' : ${dateType} === 'lastYear'}]" @click="handleQtime('${dataProp}', '${changeDate}', 'lastYear', '${dateType}')">最近一年</span>
            <el-date-picker
                class="sapi-time-q-date"
                v-model="${dataProp}"
                type="daterange"
                range-separator="至"
                start-placeholder="${vnode.attrs.startPlaceholder}"
                end-placeholder="${vnode.attrs.endPlaceholder}"
                @change="${changeDate}"
            ></el-date-picker>
        </sapi-filter-item>`
    }
}

export default Type
