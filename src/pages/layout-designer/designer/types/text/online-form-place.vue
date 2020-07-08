<template>
    <el-input 
        :maxlength="vnode.attrs.maxlength"
        :readonly="readonly"
        :placeholder="vnode.attrs.placeholder"
        v-model="value"></el-input>
</template>

<script>
    export default {
        props: {
            vnode: {
                type: Object,
                default () {
                    return {
                        attrs: { value: '' }
                    }
                }
            },
            mode: {
                type: String,
                default: 'add'
            },
            model: Object
        },
        data () {
            return {
                value: ''
            }
        },
        computed: {
            readonly () {
                return this.vnode.attrs.readonly || this.mode === 'view'
            }
        },
        watch: {
            value (val) {
                this.updateValue(val)
            }
        },
        methods: {
            updateValue (val) {
                let modelData = this.model
                if (this.vnode.subFieldId) {
                    if (!this.model.hasOwnProperty(this.vnode.fieldId)) {
                        this.$set(this.model, this.vnode.fieldId, {})
                        modelData = this.model[this.vnode.fieldId]
                    }

                    this.$set(modelData, this.vnode.subFieldId, val)
                } else {
                    this.$set(modelData, this.vnode.fieldId, val)
                }
            }
        },
        created () {
            // ${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? '.' + vnode.subFieldId : ''}
            let modelData = this.model
            if (this.vnode.subFieldId) {
                modelData = this.model[this.vnode.fieldId]
                this.value = modelData[this.vnode.subFieldId]
            } else {
                this.value = this.model[this.vnode.fieldId]
            }
        }
    }
</script>
