<template>
    <sapi-upload 
        :type="vnode.attrs.type"
        :size="vnode.attrs.size" 
        :count="vnode.attrs.count"
        :readonly="vnode.attrs.readonly"
        v-model="model[fieldId]">
    </sapi-upload>
</template>
<script>
export default {
    props: {
        vnode: Object,
        mode: String,
        model: Object
    },
    computed () {
        fieldId () {
            return `${this.vnode.model ? this.vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? ('.' + vnode.subFieldId) : ''}`
        }
    }
}
</script>