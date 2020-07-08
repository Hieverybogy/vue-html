<template>
    <div class="file-list-place" @click="handleTdOut" v-if="!!vnode.attrs">
        <table style="100%" bordercolor="#c0ccda" :frame="vnode.attrs.frame || 'border'" :rules="vnode.attrs.rules || 'all'">
            <colgroup>
                <col :width="o1.width" v-for="(o1, i1) in vnode.attrs.dataForm" :key="i1" />
            </colgroup>
            <thead>
                <tr>
                    <th :ref="`th-${i1}`" v-for="(o1, i1) in vnode.attrs.dataForm" :key="i1" @click.stop="handleThClick(o1, i1)">
                        <div class="sec-th">
                            <div
                                class="left-area"
                                v-show="o1.openMenu"
                                @click.stop="optDialog = true"
                            >
                                <i></i>
                            </div>
                            <div class="inp-sec">
                                <i class="icon-file" v-if="i1===0"></i>
                                {{o1.title}}
                                <!-- <input  :class="[{'first' : i1===0}]" :style="{textAlign: `${o1.align}`}" type="text" v-model="o1.title" placeholder="标题" /> -->
                            </div>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td
                        v-for="(o1, i1) in vnode.attrs.dataForm" :key="i1"
                        :align="o1.align"
                    >
                        <span :class="[{'isLink' : o1.isLink}]">{{o1.txt || o1.title}}</span>
                    </td>
                </tr>
            </tbody>
        </table>

        <ul
            class="opt-group-row"
            :style="optStyle"
            v-show="optDialog"
        >
            <li @click.stop="handleThAlign('left')">居左</li>
            <li @click.stop="handleThAlign('center')">居中</li>
            <li @click.stop="handleThAlign('right')">居右</li>
            <li @click.stop="handleAddCol" style="border-top: 1px solid #e6e6e6;">向右插入列</li>
            <li @click.stop="handleDelCol" v-if="vnode.attrs.dataForm.length>2 && curThItem && !curThItem.isStatic">删除列</li>
        </ul>
    </div>
</template>

<script>
export default {
    inject: ["ueditor"],
    props: {
        vnode: {
            type: Object,
            default() {
                return {
                    attrs: {
                        frame: '',
                        rules: '',
                        dataForm: []
                    }
                }
            }
        }
    },
    data() {
        return {
            x: 0,
            y: 0,
            optDialog: false,
            curThItem: null
        };
    },
    computed: {
        optStyle() {
            if (document.body.clientHeight - this.y < 150) {
                let oTdRect = this.oTh.getBoundingClientRect();
                return { left: this.x + "px", top: this.y - oTdRect.height + "px", transform: 'translateY(-100%)'};
            }
            return { left: this.x + "px", top: this.y + "px" };
        }
    },
    methods: {
        handleThClick (o1, i1) {
            // 初始化
            this.handleTdOut()
            // 业务操作
            this.thIndex = i1
            this.curThItem = o1;
            this.oTh = this.$refs[`th-${i1}`][0];
            let oTdRect = this.oTh.getBoundingClientRect();
        
            this.x = oTdRect.x || 0;
            this.y = oTdRect.y + oTdRect.height || 0;
            this.oTh.querySelectorAll(".sec-th")[0].style.border =
                "1px dashed #458aff";
            this.$set(o1, "openMenu", true);

            if (!this.ueditor.activateVnode || this.ueditor.activateVnode.type !== this.vnode.type) {
                this.ueditor.activateVnode = this.vnode
                setTimeout(() => {
                    this.ueditor.$root.$emit('file-list-set-colums', this.curThItem)
                })
            } else {
                this.ueditor.$root.$emit('file-list-set-colums', this.curThItem)
            }
        },
        handleTdOut(e, i1, i2) {
            this.oTh &&
                (this.oTh.querySelectorAll(".sec-th")[0].style.border =
                    "none");
            !!this.curThItem && (this.$set(this.curThItem, "openMenu", false))
            this.optDialog = false;
            this.ueditor.$root.$emit('file-list-set-colums', this.curThItem)
        },
        /* th align方式 */
        handleThAlign(align) {
            this.$set(this.curThItem, 'align', align)
            this.ueditor.addRecord();
        },
        // 向右插入列
        handleAddCol() {
            this.vnode.attrs.dataForm.splice(this.thIndex + 1, 0,  {title: '列名', align: 'left', width: '', key: '', txt: '', useMatch: 'none', matchOptions: [], isStatic: false});
            this.handleTdOut()
            this.ueditor.addRecord();
        },
        handleDelCol() {
            this.vnode.attrs.dataForm.splice(this.thIndex, 1);
            this.handleTdOut()
            this.ueditor.addRecord();
        }
    },
    created() {
    },
    mounted() {
        const _this = this;
        document.addEventListener(
            "click",
            () => {
                _this.handleTdOut();
            },
            false
        );

        // 把父级的margin-left去掉（为了吧标题挤上去）
        let el = this.$el.parentNode
        el.style.marginLeft = 0
        el.previousElementSibling && (el.previousElementSibling.style.width = '100%')
    },
    beforeDestroy() {
        document.removeEventListener("click", this.handleTdOut);
    }
};
</script>

<style lang="less" scope>
@import "~@/static/css/sapi-variables";
.file-list-place{
    .item-title{
        line-height: 40px;
        font-size: 14px;
        font-weight: bold;
    }
    >table {
        width: 100%;
        border-collapse: collapse;
        // border: 1px solid #c0ccda;
        table-layout: fixed;
        // margin-bottom: 20px;
        >thead {
            background-color: #f8f8f8;
            >tr {
                th {
                    // border: 1px solid #c0ccda;
                    height: 35px;
                    min-height: 35px;
                    box-sizing: border-box;
                    font-size: 13px;
                    
                    .sec-th{
                        width: 100%;
                        height: 100%;
                        min-height: 35px;
                        display: flex;
                        
                        .inp-sec{
                            flex: 1;
                            padding: 0 10px;
                            display: flex;
                            line-height: 34px;
                            .first{
                                color: @--color-primary;
                            }
                            .icon-file{
                                margin-top: 10px;
                                display: block;
                                width: 16px;
                                height: 16px;
                                text-align: center;
                                color: #fff;
                                background-position: center;
                                background-size: cover;
                                border-radius: 1px;
                                margin-right: 5px;
                                -ms-flex-negative: 0;
                                flex-shrink: 0;
                                background-image: url('~@/static/images/file.png');
                            }
                            input {
                                border: none;
                                width: 100%;
                                height: 100%;
                                background-color: #f8f8f8;
                                outline: none;
                            }
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
            >tr{
                >td {
                    // border: 1px solid #c0ccda;
                    height: 36px;
                    min-height: 36px;
                    padding: 0 10px;
                    box-sizing: border-box;
                    font-size: 13px;
                    line-height: 24px;
                    word-break: break-all;

                    .isLink{
                        cursor: pointer;
                        color: @--color-primary;

                        &:hover{
                            text-decoration: underline;
                        }
                    }
                }
            }
        }
    }
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
            height: 30px;
            background-color: white;
            border-radius: 2px;
            font-size: 10px;
            // margin: 6px 0;
            padding: 3px 10px;
            cursor: pointer;

            &:hover {
                background-color: #efefef;
            }
        }
    }
}

</style>
