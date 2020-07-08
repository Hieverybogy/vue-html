<template>
    <div class="drag-option">
        <div class="item inline-block">
            <div class="title">表头名称</div>
            <div class="value">
                <el-input v-model="vnode.label" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item inline-block">
            <div class="title">组件类型</div>
            <div class="value">
                <el-select v-model="vnode.vnode.type" @change="typeChange">
                    <el-option 
                        v-for="(type,index) in types" :key="index" 
                        :label="type.label" :value="type.value"></el-option>
                </el-select>
            </div>
        </div>

        <component :is="vnode.vnode.type ? (vnode.vnode.type + '-attrs') : ''" 
            :vnode="vnode.vnode" :container="vnode.type" style="padding:0;"></component>

        <div class="item inline-block">
            <div class="title">宽度</div>
            <div class="value">
                <el-input v-model="vnode.width" placeholder="单位为PX" @change="addRecord"></el-input>
            </div>
        </div>
    </div>
</template>

<script>
import { TypesAttrs } from '../../types/index.js'

export default {
    components: TypesAttrs,
    inject: ['ueditor'],
    props: {
        vnode: {
            type: Object,
            default () {
                return {
                    vnode: {}
                }
            }
        },
        parentVnode: {
            type: Object,
            default () {
                return {
                    vnode: {}
                }
            }
        },
        dataModel: {
            type: Array,
            required: true
        },
        container: {
            type: String,
            default: 'default'
        },
        layoutAttrs: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {
            types: [],
            view: ''
        }
    },
    methods: {
        typeChange (type) {
            const newVnode = this.ueditor.preview.Types.$factory(type || '', void 0, this.parentVnode, this.layoutAttrs)
            newVnode.attrs.length = this.vnode.vnode.attrs.length
            newVnode.fieldId = this.vnode.fieldId

            this.$set(this.vnode, 'vnode', newVnode)

            this.addRecord()
        },
        addRecord () {
            this.ueditor.addRecord()
        }
    },
    created () {
        const ts = this.ueditor.preview.Types
        for (let type in ts) {
            if (ts[type] && ts[type].user &&
                ts[type].user.indexOf(this.vnode.type) > -1) {
                this.types.push({
                    label: ts[type].label,
                    value: ts[type].type
                })
            }
        }
    }
}
</script>
