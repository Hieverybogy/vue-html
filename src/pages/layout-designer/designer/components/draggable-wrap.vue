<template>
    <div class="draggable-wrap" 
        @click.stop="setActivateVnode"
        :class="{
            'active': active,
            'can-draggable': canDraggable
        }">
        <slot></slot>

        <div class="draggable-btns-wrap" v-if="useBtns">
            <a href="javascript:void(0)" title="前移"
                v-show="moveUpVisible"
                class="move-up-vnode" @click.stop="moveUp">
                <i class="el-icon-top"></i>
            </a>
            <a href="javascript:void(0)" title="后移"
                v-show="moveDownVisible"
                class="move-down-vnode" @click.stop="moveDown">
                <i class="el-icon-bottom"></i>
            </a>
            <a href="javascript:void(0)" v-if="useCopyBtn" title="复制"
                class="copy-vnode"
                @click.stop="copyVnode"><i class="el-icon-copy-document"></i></a>
            <a href="javascript:void(0)" v-if="useDeleteBtn" title="删除"
                class="delete-vnode"
                @click.stop="deleteVnode"><i class="el-icon-delete"></i></a>
        </div>
    </div>
</template>

<script>
    import { Types } from '../types/index.js'
    export default {
        props: {
            vnode: Object,
            index: Number,
            useBtns: {
                type: Boolean,
                default: true
            },
            useCopyBtn: {
                type: Boolean,
                default: true
            },
            useDeleteBtn: {
                type: Boolean,
                default: true
            },
            // 列长度，vnode.type为column有效
            columnsLength: Number,
            parentVnode: {
                validator () {
                    return true
                }
            }
        },
        inject: ['ueditor', 'draggable', 'preview'],
        computed: {
            moveUpVisible () {
                return this.index !== 0
            },
            moveDownVisible () {
                if (!this.draggable || !this.canDraggable) {
                    return false
                }

                if (this.isTableColumn) {
                    return this.index !== this.columnsLength - 1
                }
                return this.index !== (this.draggable.list.length - 1)
            },
            active () {
                return this.ueditor && this.ueditor.activateVnode === this.vnode
            },
            canDraggable () {
                return !this.preview.readonly
            },
            isTableColumn () {
                return this.vnode.type === 'column' || this.vnode.type === 'listTableColumn'
            }
        },
        methods: {
            setActivateVnode () {
                !this.preview.readonly && this.ueditor.setActiveVnode(this.vnode, this.parentVnode)
            },
            deleteVnode () {
                if (this.isTableColumn) {
                    this.$emit('delete-vnode', this.index)
                    this.ueditor.setActiveVnode(null)
                    this.ueditor.addRecord()
                    return
                }
                const vnode = this.draggable.list.splice(this.index, 1)
                this.ueditor.setActiveVnode(null)
                this.$emit('delete-vnode', vnode)
                this.ueditor.addRecord()
            },
            copyVnode () {
                const newVnode = Types.$copy(this.vnode)
                this.draggable.list.splice(this.index, 0, newVnode)
                this.ueditor.setActiveVnode(newVnode)
                this.ueditor.addRecord()
            },
            moveUp () {
                if (this.isTableColumn) {
                    this.$emit('move-up', this.index)
                    this.ueditor.addRecord()
                    return
                }
                const currVnode = this.draggable.list[this.index]
                const prevVnode = this.draggable.list[this.index - 1]

                this.$set(this.draggable.list, this.index - 1, currVnode)
                this.$set(this.draggable.list, this.index, prevVnode)
                this.ueditor.addRecord()
            },
            moveDown () {
                if (this.isTableColumn) {
                    this.$emit('move-down', this.index)
                    this.ueditor.addRecord()
                    return
                }
                const currVnode = this.draggable.list[this.index]
                const nextVnode = this.draggable.list[this.index + 1]

                this.$set(this.draggable.list, this.index + 1, currVnode)
                this.$set(this.draggable.list, this.index, nextVnode)
                this.ueditor.addRecord()
            }
        },
        created () {
            const _this = this
            this.updateActivateVnode = function (guid) {
                if (guid === _this.vnode.guid) {
                    _this.setActivateVnode(this.vnode)
                }
            }
            !this.preview.readonly && this.ueditor.$on('update-activate-vnode', this.updateActivateVnode)
        },
        beforeDestroy () {
            !this.preview.readonly && this.ueditor.$off('update-activate-vnode', this.updateActivateVnode)
        }
    }
</script>

<style lang="less">
    @import '~@/static/css/sapi-variables.less';
    .draggable-wrap{
        position:relative;
        border: 1px solid transparent;
        border-radius: 3px;
        min-height: 64px;

        >.draggable-btns-wrap {
            display:none;
            position:absolute;
            bottom: -10px;
            right: 0;
        }

        &.can-draggable:hover{
            border: 1px dashed #ccc;
        }

        &.can-draggable.active {
            border: 1px dashed @--color-primary;
            z-index: 2;

            >.draggable-btns-wrap {
                display:block;

                a {
                    display:inline-block;
                    width: 20px;
                    height: 20px;    
                    text-align: center;
                    vertical-align: middle;
                    line-height: 20px;
                    height: 20px;
                    background-color: white;
                    box-shadow: 1px 1px 1px;
                    border-radius: 2px;
                    margin-right: 10px;
                }
            }
        }
    }
</style>
