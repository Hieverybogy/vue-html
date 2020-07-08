export const Types = {
    $factory(type, opts, parentVnode, context, ueditor) {
        type = type || 'text'
        if (this[type] &&
            Vue.$utils.isFunction(this[type].create)) {
            return this[type].create(opts, parentVnode, context, ueditor)
        }

        return {
            type: type
        }
    },
    $copy(vnode, isCopyVnode) {
        if (this[vnode.type] && Vue.$utils.isFunction(this[vnode.type].copy)) {
            return this[vnode.type].copy(vnode)
        }

        let copyVnode
        if (!isCopyVnode) {
            copyVnode = JSON.parse(JSON.stringify(vnode))
        } else {
            copyVnode = vnode
        }
        this.$setGuid(copyVnode)
        this.$copyVnodes(copyVnode.vnodes)

        return copyVnode
    },
    $setGuid(vnode) {
        vnode.guid = vnode.type + '_' + Vue.$utils.guid(8)
    },
    $copyVnodes(vnodes) {
        if (Vue.$utils.isArray(vnodes) && vnodes.length > 0) {
            vnodes.forEach((n, i) => {
                vnodes[i] = this.$copy(n)
            })
        }
    }
}

export const TypesAttrs = {
    // 统一属性名称：${vnode.type}-attrs
    'placeholder-attrs': () => import('./placeholder/attrs.vue'),
    'text-attrs': () => import('./text/attrs.vue'),
    'textarea-attrs': () => import('./textarea/attrs.vue'),
    'checkbox-attrs': () => import('./checkbox/attrs.vue'),
    'collapseItem-attrs': () => import('./collapse-item/attrs.vue'),
    'custom-attrs': () => import('./custom/attrs.vue'),
    'detail-attrs': () => import('./detail/attrs.vue'),
    'float-attrs': () => import('./float/attrs.vue'),
    'int-attrs': () => import('./int/attrs.vue'),
    'radio-attrs': () => import('./radio/attrs.vue'),
    'select-attrs': () => import('./select/attrs.vue'),
    'upload-attrs': () => import('./upload/attrs.vue'),
    'areaSelect-attrs': () => import('./area-select/attrs.vue'),
    'column-attrs': () => import('./column/attrs.vue'),
    'date-attrs': () => import('./date/attrs.vue'),
    'keyword-attrs': () => import('./keyword/attrs.vue'),
    'listTable-attrs': () => import('./list-table/attrs.vue'),
    'listTableColumn-attrs': () => import('./list-table-column/attrs.vue'),
    'struTree-attrs': () => import('./stru-tree/attrs.vue'),
    'selectStation-attrs': () => import('./select-station/attrs.vue'),
    'imgsUpload-attrs': () => import('./imgs-upload/attrs.vue'),
    'selectCompany-attrs': () => import('./select-company/attrs.vue'),
    'selectUser-attrs': () => import('./select-user/attrs.vue'),
    'label-attrs': () => import('./label/attrs.vue'),
    'tableForm-attrs': () => import('./table-form/attrs.vue'),
    'fileList-attrs': () => import('./file-list/attrs.vue'),
    'subformList-attrs': () => import('./subform-list/attrs.vue'),
    'filterDate-attrs': () => import('./filter-date/attrs.vue'),
    'filterTile-attrs': () => import('./filter-tile/attrs.vue')
}

export const TypesPlaces = {
    // 统一属性名称：${vnode.type}-place
    'placeholder-place': () => import('./placeholder/place.vue'),
    'text-place': () => import('./text/place.vue'),
    'textarea-place': () => import('./textarea/place.vue'),
    'checkbox-place': () => import('./checkbox/place.vue'),
    'custom-place': () => import('./custom/place.vue'),
    'detail-place': () => import('./detail/place.vue'),
    'float-place': () => import('./float/place.vue'),
    'int-place': () => import('./int/place.vue'),
    'radio-place': () => import('./radio/place.vue'),
    'select-place': () => import('./select/place.vue'),
    'upload-place': () => import('./upload/place.vue'),
    'areaSelect-place': () => import('./area-select/place.vue'),
    'date-place': () => import('./date/place.vue'),
    'keyword-place': () => import('./keyword/place.vue'),
    'listTable-place': () => import('./list-table/place.vue'),
    'struTree-place': () => import('./stru-tree/place.vue'),
    'selectStation-place': () => import('./select-station/place.vue'),
    'imgsUpload-place': () => import('./imgs-upload/place.vue'),
    'selectCompany-place': () => import('./select-company/place.vue'),
    'selectUser-place': () => import('./select-user/place.vue'),
    'label-place': () => import('./label/place.vue'),
    'tableForm-place': () => import('./table-form/place.vue'),
    'fileList-place': () => import('./file-list/place.vue'),
    'subformList-place': () => import('./subform-list/place.vue'),
    'filterDate-place': () => import('./filter-date/place.vue'),
    'filterTile-place': () => import('./filter-tile/place.vue')
}

// // 在线组件
// export const OnlineTypesPlaces = {
//     'keyword-place': () => import('./keyword/online-place.vue'),
//     'areaSelect-place': () => import('./area-select/online-place.vue'),
//     'date-place': () => import('./date/online-place.vue'),
//     'radio-place': () => import('./radio/online-place.vue'),
//     'sapiCompany-place': () => import('./sapi-company/online-place.vue'),
//     'select-place': () => import('./select/online-place.vue')
// }

// // 在线表单组件
// export const OnlineFormPlaces = {
//     'text-place': () => import('./text/online-form-place.vue')
// }

export const OnlineComponent = {
    'sapi-area-multiple': () => import('@/components/sapi-area-multiple.vue'),
    'sapi-stru': () => import('@/components/selectStru/index.vue'),
    'sapi-select-btn': () => import('@/components/sapi-select-btn.vue'),
    'sapi-select-station': () => import('@/components/selectStation/index.vue'),
    'sapi-select-user': () => import('@/components/selectUser/index.vue'),
    'sapi-upload': () => import('@/components/sapi-upload'),
    'sapi-imgs-upload': () => import('@/components/sapi-imgs-upload'),
    'sapi-import': () => import('@/components/sapi-import.vue'),
    'sapi-export': () => import('@/components/sapi-export.vue'),
    'sapi-export-direct': () => import('@/components/sapi-export-direct.vue'),
    'sapi-tile-filter': () => import('@/pages/components/sapi-tile-filter.vue'),
    'select-stru': () => import('@/components/selectStru')
}

export const FlowFormComponent = {
    'file-list-output': () => import('./file-list/output.vue'),
    'subform-list-output': () => import('./subform-list/output.vue'),
    'table-form-output': () => import('./table-form/output.vue')
}
