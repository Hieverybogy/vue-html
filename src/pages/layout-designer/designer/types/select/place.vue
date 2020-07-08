<template>
    <el-select :value="vnode.attrs.value">
        <el-option :disabled='item.disabled' 
            :key='index' :label='item.label' 
            :value='item.value' 
            v-for='(item, index) in vnode.options'></el-option>
    </el-select>
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
        computed: {
            vnodeTextFieldId () {
                return this.vnode.textFieldId
            }
        },
        watch: {
            vnodeTextFieldId: {
                handler (fieldId, prevFieldId) {
                    if (!this.needMark()) {
                        return
                    }

                    if (prevFieldId) {
                        this.removeDataModelMark(prevFieldId)
                    }

                    if (fieldId) {
                        this.addDataModelMark(fieldId)
                    }
                }
            }
        },
        created () {
            this.needMark() && this.addDataModelMark(this.vnode.textFieldId)
        },
        beforeDestroy () {
            this.needMark() && this.removeDataModelMark(this.vnode.textFieldId)
        }
    }
</script>
