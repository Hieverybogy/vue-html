<template>
    <sapi-imgs-upload :validate-update="validateImage"
        :width="`${vnode.attrs.width}px`" 
        :height="`${vnode.attrs.height}px`" 
        :isShowFileName="vnode.attrs.isShowFileName" 
        :limit="vnode.attrs.limit ? parseInt(vnode.attrs.limit) : 99999" 
        :apiUrl="vnode.attrs.apiUrlDefault ? apiUrl : vnode.attrs.apiUrl" 
        :url="vnode.attrs.urlDefault ? url : vnode.attrs.url" 
        :readonly="vnode.attrs.readonly" 
        v-model="images" />
</template>

<script>
import webConfig from '@/static/config.js'
import sapiImgsUpload from '@/components/sapi-imgs-upload'
import PlaceMixin from '../place-mixin'
export default {
    mixins: [PlaceMixin],
    components: {
        sapiImgsUpload
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
            images: [],
            apiUrl: (webConfig.fileServer || webConfig.baseUrl),
            url: webConfig.fileUrl
        }
    },
    watch: {
        'vnode.attrs.limit'(val) {
            if (parseInt(val) > 0 && parseInt(val) < this.images.length) {
                this.images = this.images.slice(0, parseInt(val))
            } else if (parseInt(val) <= 0) {
                this.images = []
            }
        },
        'vnode.attrs.apiUrl'(val) {
            this.images = []
        }
    },
    methods: {
        validateImage (file) {
            if (!this.vnode.attrs.isCustomFormat) {
                const isJPGOrPng = file.type && (file.type.toLowerCase() === 'image/jpeg' ||
                    file.type.toLowerCase() === 'image/jpg' || file.type.toLowerCase() === 'image/png')
                const isLt500 = file.size / (1024 * 1024) <= 10
                if (!file.size && this.vnode.attrs.rules.indexOf(1)>-1) {
                    Vue.msg('不能上传空文件')
                    return false
                }

                if (!isJPGOrPng && this.vnode.attrs.rules.indexOf(2)>-1) {
                    Vue.msg('上传图片只能是 JPG/JGEG/PNG 格式')
                }
                if (!isLt500 && this.vnode.attrs.rules.indexOf(3)>-1) {
                    Vue.msg('上传图片大小不能超过 10M')
                }

                return isJPGOrPng && isLt500
            } else if (this.vnode.attrs.isCustomFormat && this.vnode.attrs.customRules) {
                eval(this.vnode.attrs.customRules)
            }
        },
    }
};
</script>