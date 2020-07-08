export default {
    inject: ['ueditor'],
    props: {
        // 嵌套组件：明细列表中的列会传该对象
        parentVnode: Object
    },
    computed: {
        vnodeFieldId () {
            return [this.vnode.fieldId, this.vnode.subFieldId]
        }
    },
    watch: {
        vnodeFieldId: {
            handler (fieldIds, prevFieldIds) {
                if (!this.needMark()) {
                    return
                }

                if (prevFieldIds) {
                    this.removeDataModelMark(prevFieldIds[0], prevFieldIds[1])
                }

                if (fieldIds) {
                    this.addDataModelMark(fieldIds[0], fieldIds[1])
                }
            }
        }
    },
    methods: {
        addDataModelMark (fieldId, subFieldId) {
            if (fieldId) {
                this.ueditor.dataModel.forEach((model) => {
                    // 存在子集的情况不标记MarkCount
                    if (subFieldId && model.FieldId === fieldId) {
                        model.Chidlren.forEach((cModel) => {
                            if (cModel.FieldId === subFieldId) {
                                cModel.MarkCount += 1
                            }
                        })
                    } else if (model.Relationship !== 1 && model.FieldId === fieldId) {
                        model.MarkCount += 1
                    }
                })
            }
        },
        removeDataModelMark (fieldId, subFieldId) {
            if (fieldId) {
                this.ueditor.dataModel.forEach((model) => {
                    if (subFieldId && model.FieldId === fieldId) {
                        model.Chidlren.forEach((cModel) => {
                            if (cModel.FieldId === subFieldId) {
                                cModel.MarkCount -= 1
                            }
                        })
                    } else if (model.Relationship !== 1 && model.FieldId === fieldId) { // 一对一关系不需要禁用
                        model.MarkCount -= 1
                    }
                })
            }
        },
        needMark () {
            if (!this.ueditor) {
                return
            }
            // 明细表不需要标记字段选择mark
            if (this.parentVnode && this.parentVnode.type === 'detial') {
                return false
            }

            return true
        }
    },
    created () {
        this.needMark() && this.addDataModelMark(this.vnode.fieldId, this.vnode.subFieldId)
    },
    beforeDestroy () {
        this.needMark() && this.removeDataModelMark(this.vnode.fieldId, this.vnode.subFieldId)
    }
}
