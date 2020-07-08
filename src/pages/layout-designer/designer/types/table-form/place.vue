<template>
    <div class="template-container" @click="handleTdOut" v-if="!!vnode.attrs">
        <div class="table-container" ref="tableEl">
            <table class="table" @click.stop>
                <colgroup v-if="vnode.attrs.colgroup && vnode.attrs.colgroup.length>0">
                    <col :width="col.width" v-for="(col, c1) in vnode.attrs.colgroup" :key="c1" />
                </colgroup>
                <thead v-if="vnode.attrs.isShowThead">
                    <tr>
                        <th :ref="`th-${i1}`" v-for="(o1, i1) in vnode.attrs.headLabel" :key="i1" @click.stop="handleThClick(o1, i1)">
                            <div class="sec-th">
                                <div
                                    class="left-area"
                                    v-show="o1.openMenu"
                                    @click.stop="handleOpenDoM"
                                >
                                    <i></i>
                                </div>
                                <input :style="{textAlign: `${o1.align}`}" type="text" v-model="o1.title" placeholder="标题" />
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(o1, i1) in vnode.attrs.dataForm" :key="i1">
                        <template v-for="(o2, i2) in o1.tr">
                            <td
                                :key="i2"
                                :ref="`td${o2.rows}-${o2.cols}`"
                                :colspan="o2.colspan"
                                :rowspan="o2.rowspan"
                                @click.stop="handleTdClick($event, o2)"
                                v-if="!o2.isHidden"
                            >
                                <div class="drag-td">
                                    <div
                                        class="left-area"
                                        v-show="o2.openMenu"
                                        @click.stop="handleOpenDoM"
                                    >
                                        <i></i>
                                    </div>
                                    <draggable
                                        tag="ul"
                                        class="table-form-draggable"
                                        :sort="true"
                                        @add="handleCollapsesAdd(o2.slots, i1, i2, $event)"
                                        :list="o2.slots"
                                        ghost-class="ghost"
                                        :move="moveValidate"
                                        @change="draglistChange"
                                        :options="{group:'widget', ghostClass: 'ghost', swapThreshold:0.5, animation: 100}"
                                    >
                                        <li v-for="(vnode, index) in o2.slots" :key="index">
                                            <draggable-wrap
                                                :vnode="vnode"
                                                :index="index"
                                                class="draggable-wrap-other"
                                            >
                                                <component
                                                    :is="vnode.type ? vnode.type + '-place': ''"
                                                    :vnode="vnode"
                                                ></component>
                                            </draggable-wrap>
                                        </li>
                                    </draggable>
                                </div>
                            </td>
                        </template>
                    </tr>
                </tbody>
            </table>

            <ul
                class="opt-group-row"
                :style="optStyle"
                v-show="optDialog"
                @click.stop=""
            >
                <template v-if="focusType === 'td'">
                    <li @click.stop="handleColspan" v-if="canToRightBin">向右合并单元格</li>
                    <li @click.stop="handleRowspan" v-if="canToBottomBin">向下合并单元格</li>
                    <li
                        @click.stop="handleCancelColspan"
                        v-if="curItem && (curItem.colspan>1 || curItem.rowspan>1)"
                    >取消合并单元格</li>
                    <li @click.stop="handleAddRow" v-if="canAddRow">向下插入行</li>
                    <li @click.stop="handleAddCol" v-if="canAddCol">向右插入列</li>
                    <li @click.stop="handleDelRow" v-if="canDelRow">删除行</li>
                    <li @click.stop="handleDelCol" v-if="canDelCol">删除列</li>
                </template>
                <template v-if="focusType === 'th'">
                    <li @click.stop="handleThAlign('left')">居左</li>
                    <li @click.stop="handleThAlign('center')">居中</li>
                    <li @click.stop="handleThAlign('right')">居右</li>
                </template>
            </ul>
        </div>
    </div>
</template>

<script>
import draggable from "../../components/draggable.js";
import draggableWrap from "../../components/draggable-wrap.vue";
import Types from "../../layout/flow-form/types.js";
import { TypesPlaces } from "../index.js";
export default {
    inject: ["ueditor"],
    components: {
        draggable,
        draggableWrap,
        ...TypesPlaces
    },
    props: {
        vnode: {
            type: Object,
            default() {
                return {
                    attrs: {
                        row: 1,
                        column: 2,
                        colgroup: [],
                        isShowThead: false,
                        headLabel: [],
                        dataForm: []
                    }
                }
            }
        }
    },
    data() {
        return {
            optDialog: false,
            x: 0,
            y: 0,
            curItem: null, // 当前选中的td
            /* 菜单各种判断标识 */
            canToRightBin: true, // 表示是否可向右合并单元
            canToBottomBin: true, // 表示是否可向下合并单元
            canAddRow: true, // 表示能否向下添加行
            canAddCol: true, // 表示能否向右添加列
            canDelRow: true, // 表示能否删除删
            canDelCol: true, // 表示能否删除删

            focusType: null,  // th/td 选中类型
        };
    },
    computed: {
        optStyle() {
            if (document.body.clientHeight - this.y < 150) {
                let oTdRect = this.oTd.getBoundingClientRect();
                return { left: this.x + "px", top: this.y - oTdRect.height + "px", transform: 'translateY(-100%)'};
            }
            return { left: this.x + "px", top: this.y + "px" };
        }
    },
    watch: {
        'vnode.attrs.row': {
            handler(val, oldVal = 0) {
                if (val !== this.vnode.attrs.dataForm.length) {
                    let _row = parseInt(val) - parseInt(oldVal);
                    this.handleDeal(_row, 0);
                }
            },
            deep: true
        },
        'vnode.attrs.column': {
            handler(val, oldVal = 0) {
                if (val !== this.vnode.attrs.dataForm[0].tr.length) {
                    let _column = parseInt(val) - parseInt(oldVal);
                    this.handleDeal(0, _column);
                }
            },
            deep: true
        },
    },
    methods: {
        draglistChange(event) {
            this.timerAddR && clearTimeout(this.timerAddR);
            this.timerAddR = setTimeout(() => {
                this.ueditor.addRecord();
            }, 100);

            if (event.removed) {
                const typeObj = event.removed.element;
                typeObj.isInTable = false
            }
        },
        handleCollapsesAdd(list, i1, i2, event) {
            let _this = this
            let typeObj = list[event.newIndex];

            if (typeObj.guid) {
                typeObj.isInTable = true
                
                return;
            }

            const newVnode = Types[typeObj.type]['flow-form'].create(
                { model: "model" },
                void 0,
                { layout: "form" }
            );

            newVnode.isInTable = true
            this.$set(list, event.newIndex, newVnode);

            this.$nextTick(() => {
                this.handleEvent()
            })
        },
        moveValidate(evt) {
            // if (evt.draggedContext.element.type === 'tableForm' || evt.draggedContext.element.type === 'collapseItem'){
            //     return false
            // }
        },
        handleDeal(disRow, disColumn) {
            let _tableData = JSON.parse(JSON.stringify(this.vnode.attrs.dataForm));

            let _row = this.vnode.attrs.row ? parseInt(this.vnode.attrs.row) : 0;
            let _column = this.vnode.attrs.column ? parseInt(this.vnode.attrs.column) : 0;
            if (disRow > 0) {
                for (let i = 0; i < disRow; i++) {
                    let tr = [];
                    for (let j = 0; j < _column; j++) {
                        tr.push({
                            slots: [],
                            colspan: 1,
                            rowspan: 1
                        });
                    }
                    _tableData.push({
                        tr: tr
                    });
                }
            } else if (disRow < 0) {
                _tableData = _tableData.slice(0, _tableData.length + disRow);
            }

            if (disColumn > 0) {
                for (let o1 of _tableData) {
                    !o1.tr && (o1.tr = []);
                    for (let j = 0; j < disColumn; j++) {
                        o1.tr.push({
                            slots: [],
                            colspan: 1,
                            rowspan: 1
                        });
                    }
                }
            } else if (disColumn < 0) {
                for (let o1 of _tableData) {
                    o1.tr = o1.tr.slice(0, disColumn);
                }
            }

            this.vnode.attrs.dataForm = this.reorder(_tableData);
        },
        /* th的选中 */
        handleThClick (o1, i1) {
            // 初始化
            this.focusType = 'th'
            this.handleTdOut()
            // 业务操作
            this.thIndex = i1
            this.curThItem = o1;
            this.oTh = this.$refs[`th-${i1}`][0];
            let oTable = this.$refs.tableEl.getBoundingClientRect();
            let oTdRect = this.oTh.getBoundingClientRect();

            this.x = oTdRect.x || 0;
            this.y = oTdRect.y + oTdRect.height || 0;
            this.oTh.querySelectorAll(".sec-th")[0].style.border =
                "1px dashed #458aff";
            this.$set(o1, "openMenu", true);
        },
        /* tr的选中 */
        handleTdClick(e, o2) {
            // 初始化
            this.focusType = 'td'
            this.handleTdOut()
            // 业务操作
            this.index1 = o2.rows;
            this.index2 = o2.cols;
            this.curItem = o2;
            this.oTd = this.$refs[`td${this.index1}-${this.index2}`][0];
            let oTable = this.$refs.tableEl.getBoundingClientRect();
            let oTdRect = this.oTd.getBoundingClientRect();

            this.x = oTdRect.x || 0;
            this.y = oTdRect.y + oTdRect.height || 0;
            this.oTd.querySelectorAll(".drag-td")[0].style.border =
                "1px dashed #458aff";
            this.$set(o2, "openMenu", true);
        },
        // 打开操作菜单
        handleOpenDoM() {
            if (this.focusType === 'td') {
                // 判断menu中哪些展示
                this.limitToRightBin();
                this.limitToBottomBin();
                this.limitAddRow();
                this.limitAddCol();
                this.limieDelRow();
                this.limieDelCol();
            }

            this.optDialog = true;
        },
        handleTdOut(e, i1, i2) {
            // td
            this.oTd &&
                (this.oTd.querySelectorAll(".drag-td")[0].style.border =
                    "none");
            if (!!this.curItem) {
                let item = this.vnode.attrs.dataForm[this.index1].tr[this.index2]
                this.$set(item, "openMenu", false);
            }
            // th
            this.oTh &&
                (this.oTh.querySelectorAll(".sec-th")[0].style.border =
                    "none");
            if (!!this.curThItem) {
                let item = this.vnode.attrs.headLabel[this.thIndex]
                this.$set(item, "openMenu", false);
            }
            this.optDialog = false;
        },
        /**************** 按钮操作（start） ***************/
        // 向右合并单元格
        handleColspan() {
            this.handleTdOut();
            let _tableData = JSON.parse(JSON.stringify(this.vnode.attrs.dataForm));

            let curItem = _tableData[this.index1].tr[this.index2]; // 当前一个
            let {colspan: colspan1,rowspan: rowspan1,slots: slots1} = curItem;

            let slots = [];
            for (let i = 0; i < rowspan1; i++) {
                let nextItem =
                    _tableData[this.index1 + i].tr[this.index2 + colspan1]; // 下一个
                slots = slots.concat(nextItem.slots);
                this.$set(nextItem, "rowspan", 1);
                this.$set(nextItem, "colspan", 1);
                this.$set(nextItem, "slots", []);
                this.$set(nextItem, "isHidden", true);
            }
            this.$set(
                curItem,
                "colspan",
                colspan1 +
                    _tableData[this.index1].tr[this.index2 + colspan1].colspan
            );
            this.$set(curItem, "slots", slots1.concat(slots));

            this.vnode.attrs.dataForm = _tableData;
            this.addTabelRecord(); // 添加操作记录
        },
        // 向下合并单元格
        handleRowspan() {
            this.handleTdOut();
            let _tableData = JSON.parse(JSON.stringify(this.vnode.attrs.dataForm));

            let curItem = _tableData[this.index1].tr[this.index2]; // 当前一个
            let {
                colspan: colspan1,
                rowspan: rowspan1,
                slots: slots1
            } = curItem;

            let slots = [];
            for (let i = 0; i < colspan1; i++) {
                let nextItem =
                    _tableData[this.index1 + rowspan1].tr[this.index2 + i]; // 下一个
                slots = slots.concat(nextItem.slots);
                this.$set(nextItem, "rowspan", 1);
                this.$set(nextItem, "colspan", 1);
                this.$set(nextItem, "slots", []);
                this.$set(nextItem, "isHidden", true);
            }
            this.$set(
                curItem,
                "rowspan",
                rowspan1 +
                    _tableData[this.index1 + rowspan1].tr[this.index2].rowspan
            );
            this.$set(curItem, "slots", slots1.concat(slots));

            this.vnode.attrs.dataForm = _tableData;
            this.addTabelRecord(); // 添加操作记录
        },
        // 取消合并一个单元格
        handleCancelColspan() {
            this.handleTdOut();
            let _tableData = JSON.parse(JSON.stringify(this.vnode.attrs.dataForm));

            let curItem = _tableData[this.index1].tr[this.index2]; // 当前一个
            let { colspan, rowspan, slots } = curItem;
            this.$set(curItem, "rowspan", 1);
            this.$set(curItem, "colspan", 1);

            for (let i = 0; i < rowspan; i++) {
                for (let j = 0; j < colspan; j++) {
                    let nextItem =
                        _tableData[this.index1 + i].tr[this.index2 + j]; // 下一个
                    this.$set(nextItem, "isHidden", false);
                }
            }

            this.vnode.attrs.dataForm = _tableData;
            this.addTabelRecord(); // 添加操作记录
        },
        // 删除行
        handleDelRow() {
            this.handleTdOut();
            let _tableData = JSON.parse(JSON.stringify(this.vnode.attrs.dataForm));
            // 删除
            this.otherCantRecord = true;
            _tableData.splice(this.index1, 1);
            let _row = this.vnode.attrs.row ? parseInt(this.vnode.attrs.row) : 0;
            this.vnode.attrs.row = _row - 1

            this.vnode.attrs.dataForm = this.reorder(_tableData);
            this.addTabelRecord(); // 添加操作记录
        },
        // 删除列
        handleDelCol() {
            this.handleTdOut();
            let _tableData = JSON.parse(JSON.stringify(this.vnode.attrs.dataForm));
            let _colgroup = JSON.parse(JSON.stringify(this.vnode.attrs.colgroup));
            let _headLabel = JSON.parse(JSON.stringify(this.vnode.attrs.headLabel));
            // 删除
            for (let i = 0; i < _tableData.length; i++) {
                _tableData[i].tr.splice(this.index2, 1);
            }

            _colgroup.splice(this.index2, 1)
            _headLabel.splice(this.index2, 1)

            this.vnode.attrs.colgroup = _colgroup
            this.vnode.attrs.headLabel = _headLabel
            this.vnode.attrs.column = this.vnode.attrs.column - 1

            this.vnode.attrs.dataForm = this.reorder(_tableData);
            this.addTabelRecord(); // 添加操作记录
        },
        // 向下插入行
        handleAddRow() {
            this.handleTdOut();
            let _tableData = JSON.parse(JSON.stringify(this.vnode.attrs.dataForm));
            let {rowspan} = _tableData[this.index1].tr[this.index2]; // 当前一个

            let tr = [];
            for (let i = 0; i < this.vnode.attrs.column; i++) {
                tr.push({
                    slots: [],
                    colspan: 1,
                    rowspan: 1
                });
            }
            _tableData.splice(this.index1 + rowspan, 0, {
                tr: tr
            });
            this.vnode.attrs.row = this.vnode.attrs.row + 1

            this.vnode.attrs.dataForm = this.reorder(_tableData);
            this.addTabelRecord(); // 添加操作记录
        },
        // 向右插入列
        handleAddCol() {
            this.handleTdOut();
            let _tableData = JSON.parse(JSON.stringify(this.vnode.attrs.dataForm));
            let _colgroup = JSON.parse(JSON.stringify(this.vnode.attrs.colgroup));
            let _headLabel = JSON.parse(JSON.stringify(this.vnode.attrs.headLabel));
            let {colspan} = _tableData[this.index1].tr[this.index2]; // 当前一个

            for (let i = 0; i < _tableData.length; i++) {
                _tableData[i].tr.splice(this.index2 + colspan, 0, {
                    slots: [],
                    colspan: 1,
                    rowspan: 1
                });
            }

            _colgroup.splice(this.index2 + 1, 0 , {width: ''})
            _headLabel.splice(this.index2 + 1, 0 , {title: ''})

            this.vnode.attrs.colgroup = _colgroup
            this.vnode.attrs.headLabel = _headLabel
            this.vnode.attrs.column = this.vnode.attrs.column + 1

            this.vnode.attrs.dataForm = this.reorder(_tableData);
            this.addTabelRecord(); // 添加操作记录
        },
        /**
         * 按钮限制条件---向右合并
         */
        limitToRightBin() {
            this.canToRightBin = true;
            /**
             * 条件一：不能的当前行的最后一个td
             */
            if (this.curItem.cols + this.curItem.colspan > this.vnode.attrs.column - 1) {
                this.canToRightBin = false;
                return;
            }
            /**
             * 条件二：该元素的右测不能是一个向下合并的单元格
             */
            let nextItem = this.vnode.attrs.dataForm[this.index1].tr[
                this.index2 + this.curItem.colspan
            ]; // 下一个 (已排除了不是最后一个了)
            if (
                nextItem.isHidden ||
                (nextItem.rowspan !== 1 &&
                    nextItem.rowspan !== this.curItem.rowspan)
            ) {
                this.canToRightBin = false;
            }
        },
        /**
         * 按钮限制条件---向下合并
         */
        limitToBottomBin() {
            this.canToBottomBin = true;

            /**
             * 条件一：不能的最后一行
             */
            if (this.curItem.rows + this.curItem.rowspan > this.vnode.attrs.row - 1) {
                this.canToBottomBin = false;
                return;
            }
            /**
             * 条件一：下一行的元素不能是一个向右合并的单元个
             */
            let nextItem = this.vnode.attrs.dataForm[this.index1 + this.curItem.rowspan]
                .tr[this.index2]; // 下一个 (已排除了不是最后一个了)
            if (
                nextItem.isHidden ||
                (nextItem.colspan !== 1 &&
                    nextItem.colspan !== this.curItem.colspan)
            ) {
                this.canToBottomBin = false;
            }
        },
        /**
         * 按钮限制条件---添加行
         */
        limitAddRow() {
            this.canAddRow = true;

            /**
             * 条件一：下一行的所有td不能有一个是被合并列的，排除改合并列元素是最后一个
             */

            // 当为最后一行，直接return
            if (this.index1 + this.curItem.rowspan > this.vnode.attrs.row - 1) return;
            let nextTr = this.vnode.attrs.dataForm[this.index1 + this.curItem.rowspan].tr; // 下一行(已排除了当前行是最后一行)
            for (let i = 0; i < nextTr.length; i++) {
                if (
                    nextTr[i].isHidden &&
                    (!nextTr[i - 1] ||
                        (nextTr[i - 1] &&
                            !nextTr[i - 1].isHidden &&
                            nextTr[i - 1].rowspan === 1))
                ) {
                    this.canAddRow = false;
                    break;
                }
            }
        },
        /**
         * 按钮限制条件---添加列
         */
        limitAddCol() {
            this.canAddCol = true;

            /**
             * 条件一：不能超过10列
             */
            if(this.vnode.attrs.column === 10) {
                this.canAddCol = false;
                return
            }

            /**
             * 条件二：
             */

            // 当为最后一列，直接return
            if (this.index2 + this.curItem.colspan > this.vnode.attrs.column - 1) return;

            for (let i = 0; i < this.vnode.attrs.dataForm.length; i++) {
                let nextTd = this.vnode.attrs.dataForm[i].tr[
                    this.index2 + this.curItem.colspan
                ]; // 每行的下一个td
                let nextTdPre = this.vnode.attrs.dataForm[i].tr[
                    this.index2 + this.curItem.colspan - 1
                ];
                if (
                    nextTd.isHidden &&
                    (nextTdPre.isHidden ||
                        (!nextTdPre.isHidden && nextTdPre.colspan !== 1))
                ) {
                    this.canAddCol = false;
                    break;
                }
            }
        },
        /**
         * 按钮限制条件---删除行
         */
        limieDelRow() {
            this.canDelRow = true;

            if (this.curItem.colspan !== 1 || this.curItem.rowspan !== 1) {
                this.canDelRow = false;
                return;
            }

            for (let i = 0; i < this.vnode.attrs.dataForm[this.index1].tr.length; i++) {
                let td = this.vnode.attrs.dataForm[this.index1].tr[i];
                if (td.isHidden || td.colspan !== 1 || td.rowspan !== 1) {
                    this.canDelRow = false;
                    break;
                }
            }
        },
        /**
         * 按钮限制条件---删除列
         */
        limieDelCol() {
            this.canDelCol = true;

            if (this.curItem.colspan !== 1 || this.curItem.rowspan !== 1) {
                this.canDelCol = false;
                return;
            }

            for (let i = 0; i < this.vnode.attrs.dataForm.length; i++) {
                let td = this.vnode.attrs.dataForm[i].tr[this.index2];
                if (td.isHidden || td.colspan !== 1 || td.rowspan !== 1) {
                    this.canDelCol = false;
                    break;
                }
            }
        },
        /**
         * 执行添加操作日志
         */
        addTabelRecord() {
            this.ueditor.addRecord();
        },
        /* 重新排序 */
        reorder(tableData) {
            for (let i = 0; i < tableData.length; i++) {
                for (let j = 0; j < tableData[i].tr.length; j++) {
                    this.$set(tableData[i].tr[j], "rows", i);
                    this.$set(tableData[i].tr[j], "cols", j);
                }
            }
            return tableData;
        },
        /* th align方式 */
        handleThAlign(align) {
            this.$set(this.curThItem, 'align', align)
            this.ueditor.addRecord();
        },
        /**************** 按钮操作（end） ***************/
        handleEvent () {
            if (!!this.oldInp && this.oldInp.length>0) {
                for (let o1 of this.oldInp) {
                    o1.removeEventListener("focus", this.handleTdOut);
                }
            }

            if (!this.$refs.tableEl) return
            this.oldInp = this.$refs.tableEl.querySelectorAll('input')
            for (let o1 of this.oldInp) {
                o1.addEventListener("focus", this.handleTdOut, false);
            }
        }
    },
    created() {},
    mounted() {
        const _this = this;
        document.addEventListener("click", this.handleTdOut, false);
        this.$nextTick(() => {
            this.handleEvent() // inp focus事件
        })

        // 把父级的margin-left去掉（为了吧标题挤上去）
        let el = this.$el.parentNode
        el.style.marginLeft = 0
        el.previousElementSibling && (el.previousElementSibling.style.width = '100%')
    },
    beforeDestroy() {
        document.removeEventListener("click", this.handleTdOut);

        if (!!this.oldInp && this.oldInp.length>0) {
            for (let o1 of this.oldInp) {
                o1.removeEventListener("focus", this.handleTdOut);
            }
        }
    }
};
</script>

<style lang="less">
@import "~@/static/css/sapi-variables";
.template-container {
    // padding-bottom: 20px;
    .table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #c0ccda;
        table-layout: fixed;
        >thead {
            background-color: #f8f8f8;
            >tr {
                >th {
                    border: 1px solid #c0ccda;
                    height: 36px;
                    min-height: 36px;
                    // padding: 0 8px;
                    
                    .sec-th{
                        width: 100%;
                        height: 100%;
                        min-height: 36px;
                        display: flex;
                        
                        input {
                            flex: 1;
                            border: none;
                            width: 100%;
                            height: 100%;
                            background-color: #eff2f7;
                            outline: none;
                        }
                    }
                }
            }
        }
        .left-area {
            width: 16px;
            height: 100%;
            background-color: @--color-primary;
            z-index: 10;
            position: relative;
            cursor: pointer;
            > i {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: 0;
                height: 0;
                border-right: 5px solid transparent;
                border-left: 5px solid transparent;
                border-top: 5px solid #fff;
            }
        }
        >tbody{
            >tr {
                >td {
                    border: 1px solid #c0ccda;
                    height: 36px;
                    min-height: 36px;
                    .drag-td {
                        width: 100%;
                        height: 100%;
                        min-height: 36px;
                        display: flex;
                        
                        > ul {
                            flex: 1;
                            height: 100%;
                            min-height: 36px;
                        }
                    }
                    .draggable-wrap-other {
                        min-height: 38px;
                    }
                    .label-inp-sec{
                        .el-input__inner {
                            border: none;
                        }
                    }
                }
            }
        }
    }
    .table-container {
        position: relative;
        .opt-group-row {
            position: fixed;
            left: 0;
            top: -10px;
            z-index: 3;
            min-width: 100px;
            border: 1px solid @--color-primary;
            background-color: #fff;
            > li {
                vertical-align: middle;
                line-height: 24px;
                height: 24px;
                background-color: white;
                border-radius: 2px;
                font-size: 10px;
                margin: 6px 0;
                padding: 0 10px;
                cursor: pointer;

                &:hover {
                    background-color: #efefef;
                }
            }
        }
    }
}
</style>
