<template>
    <file-list-output
        :frame="vnode.attrs.frame"
        :rules="vnode.attrs.rules"
        :dataList="model[fieldId]"
        :dataForm="vnode.attrs.dataForm"/>
</template>

<script>
import FileListOutput from './output.vue'
export default {
    components: {
        FileListOutput
    },
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
        },
        model: Object
    },
    computed: {
        fieldId () {
            return `${this.vnode.fieldId}${this.vnode.subFieldId ? ('.' + this.vnode.subFieldId) : ''}`
        }
    }
}
</script>

<style>

</style>
