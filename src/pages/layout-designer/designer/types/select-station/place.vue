<template>
    <div>
        <sapi-select-btn 
            v-model="items" 
            :format="format" 
            @select="btnClick" 
            :hasMore="vnode.attrs.hasMore"
            :height="vnode.attrs.height ? vnode.attrs.height + 'px' : ''"
            :placeholder="vnode.attrs.placeholder"
            :readonly="vnode.attrs.readonly"></sapi-select-btn>
        <sapi-select-station
            v-model="visible"
            :multiple="vnode.attrs.multiple"
            :data.sync="data"
            :cookieName="vnode.attrs.cookieName"
            @callback="callback"
        ></sapi-select-station>
    </div>
</template>

<script>
import sapiSelectBtn from "@/components/sapi-select-btn.vue";
import sapiSelectStation from "@/components/selectStation/index.vue";
import PlaceMixin from '../place-mixin'
export default {
    mixins: [PlaceMixin],
    components: {
        sapiSelectBtn,
        sapiSelectStation
    },
    props: {
        vnode: {
            type: Object,
            default() {
                return {
                    attrs: {}
                };
            }
        }
    },
    data() {
        return {
            visible: false,
            items: [],
            data: []
        }
    },
    watch: {
        'vnode.attrs.multiple'(val) {
            this.items = []
            this.data = val ? [] : null
        },
        'vnode.attrs.format': {
            handler(val) {
                this.resetItems()
            },
            immediate: true,
            deep: true
        },
        'vnode.attrs.isCustomFormat'(val) {
            this.resetItems()
        },
        'vnode.attrs.formatTxt'(val) {
            this.resetItems()
        }
    },
    methods: {
        format(item) {
            let str = ''
            let arr = []
            if (this.vnode.attrs.isCustomFormat) {
                let str = this.vnode.attrs.formatTxt
                if (str) {
                    let arr1 = str.split('${')
                    for (let i = 0; i < arr1.length; i++) {
                        let arrStr1 = arr1[i].replace(/(^\s*)|(\s*$)/g, "")
                        let arr2 = arrStr1 ? arrStr1.split('}') : ''
                        if (arr2[0] && arr2[0].replace(/(^\s*)|(\s*$)/g, "")) {
                            arr.push('${item.' + arr2.join('}'))
                        }
                    }
                   
                    str = '`' + arr.join('') + '`'
                    return eval(str)
                } else {
                   return '' 
                }
            } else {
                str = `${this.vnode.attrs.format.indexOf('CorpName')>-1 ? item.CorpName : ''}
                    ${this.vnode.attrs.format.indexOf('DeptName')>-1 ? '/' + item.DeptName : ''}
                    ${this.vnode.attrs.format.indexOf('StationName')>-1 ? '/' + item.StationName : ''}
                    ${item.EmployeeName
                        ? "（" + item.EmployeeName + "）"
                        : "（未关联员工）"}`
                str = str.replace(/(^\s*)|(\s*$)/g, "")
                str = str[0] === '/' ? str.substring(1) : str
                str = str[0] === '（' && str[str.length-1] === '）' ? str.substring(1, str.length-1) : str

                return str;
            }
        },
        btnClick() {
            this.visible = true
        },
        callback(data) {
            if (!this.vnode.attrs.multiple) {
                this.items = [data]
            } else {
                this.items = data
            }
        },
        resetItems () {
            this.items = []
            setTimeout(() => {
                //Object.prototype.toString.call(this.data) === '[object Object]'
                if (this.vnode.attrs && !this.vnode.attrs.multiple && ($.isPlainObject(this.data) || this.data.length>0)) {
                    this.items = [JSON.parse(JSON.stringify(this.data))]
                } else if (this.vnode.attrs && this.vnode.attrs.multiple && this.data.length>0){
                    this.items = JSON.parse(JSON.stringify(this.data)) 
                }
            }, 50)
        }
    }
};
</script>