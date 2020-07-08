<template>
    <div v-if="!!vnode.attrs">
        <el-input
            class="label-inp-sec"
            :class="[{'input-label' : vnode.attrs.type === 2, 
                'input-center' : vnode.attrs.align === 'center',
                'input-right' : vnode.attrs.align === 'right'}]"
            placeholder="label"
            :readonly="!vnode.isNoNeedFieldId"
            @change="change"
            v-model="val">
            <template slot="suffix" v-if="isShowUnit"><div>{{vnode.attrs.unit}}</div></template>
        </el-input>
    </div>
</template>

<script>
// import PlaceMixin from '../place-mixin'
export default {
    inject: ["ueditor"],
    // mixins: [PlaceMixin],
    props: {
        vnode: {
            type: Object,
            default() {
                return {
                    attrs: {
                        value: "",
                        type: 1,
                        align: "left",
                        key: '',
                        txt: ''
                    }
                };
            }
        }
    },
    data() {
        return {
            val: ''
        }
    },
    watch: {
        'vnode.isNoNeedFieldId': {
            handler (val) {
                if (!val) {
                    this.val = this.vnode.attrs ? this.vnode.attrs.txt : ''
                } else {
                    this.val = this.vnode.attrs ? this.vnode.attrs.value : ''
                }
            },
            immediate: true,
            deep: true
        },
        'vnode.attrs.key'(val) {
            !val && (this.vnode.attrs.txt = '') 
            this.val = !this.vnode.isNoNeedFieldId ? this.vnode.attrs.txt : ''
        },
        val(val) {
            this.vnode.attrs.value = this.vnode.isNoNeedFieldId ? val : ''
        }
    },
    computed: {
        isShowUnit () {
            return !this.vnode.isNoNeedFieldId && (this.vnode.attrs.controlType === 1 || this.vnode.attrs.controlType === 2) && this.vnode.attrs.unit
        }
    },
    methods: {
        change() {
            if (this.vnode.isNoNeedFieldId) {
                this.ueditor.addRecord();
            }
        }
    }
};
</script>
<style lang="less">
.input-label {
    background-color: #eff2f7;
    .el-input__inner {
        background-color: #eff2f7;
        border: none;
    }
}
.input-center {
    .el-input__inner {
        text-align: center;
    }
}
.input-right {
    .el-input__inner {
        text-align: right;
    }
}
</style>
