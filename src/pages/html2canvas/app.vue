<template>
    <div>
        fdsgfsdgdfgsdfgsd
        <img src="./assets/github.jpg" alt="">
        <img src="./assets/github.jpg" alt="">
        <button type="button" @click="doCanvas">点我!</button>
    </div>
</template>

<script>
    import html2canvas from 'html2canvas'
    export default {
        data() {
            return {

            }
        },
        watch: {},
        methods: {
            doCanvas(){
                var imgs = this.$el.getElementsByTagName('img');
                // for(let i=0;i<imgs.length;i++){
                //     this.requestImage(imgs[i])
                // }
                this.toCanvas();
            },
            requestImage (img) {
                const _this = this
                const xmlHTTP = new XMLHttpRequest();
                xmlHTTP.open("GET", img.src + '&_='+ new Date().getTime(), true);
                // 以 ArrayBuffer 的形式返回数据
                xmlHTTP.responseType = "arraybuffer";
                xmlHTTP.onload = function(e) {
                    // 1. 将返回的数据存储在一个 8 位无符号整数值的类型化数组里面
                    const arr = new Uint8Array(xmlHTTP.response)
                    // 2. 转为 charCode 字符串
                    const raw = Array.prototype.map
                        .call(arr, charCode => String.fromCharCode(charCode))
                        .join("")
                    // 3. 将二进制字符串转为 base64 编码的字符串
                    const b64 = btoa(raw)
                    const dataURL = "data:image/png;base64," + b64
                    var newImage = new Image()
                    newImage.onload = function () {
                        _this.loadCount = _this.loadCount - 1
                    }
                    newImage.onerror = function () {
                        _this.loadCount = -1
                    }
                    newImage.src = dataURL
                    newImage.style.position = img.style.position
                    newImage.style.border = img.style.border
                    newImage.style.width = img.style.width
                    newImage.style.height = img.style.height
                    newImage.style.left = img.style.left
                    newImage.style.top = img.style.top
                    newImage.style.maxWidth = img.style.maxWidth
                    newImage.style.opacity = img.style.opacity

                    img.parentNode.appendChild(newImage) // dataURL
                    img.parentNode.removeChild(img)
                };
                xmlHTTP.onerror = function (err) {
                    _this.loadCount = -1
                };
                xmlHTTP.send(null)
            },
            toCanvas(){
                const _this = this;
                try {
                    html2canvas(this.$el, {
                        logging: false,
                        useCORS: true,
                        ignoreElements: function (el) {
                            if(_this.mapOption == 'baidu' && el.className && typeof el.className === 'string' &&
                                (el.className.indexOf('anchorBL') > -1 ||
                                    el.className.indexOf('anchorTL') > -1 ||
                                    el.className.indexOf('anchorTR') > -1 ||
                                    el.className.indexOf('anchorBR') > -1)) {
                                return true
                            }else if(_this.mapOption == 'google' && el.className && typeof el.className === 'string' &&
                                (el.className.indexOf('BMapLib_Drawing') > -1 ||
                                    el.className.indexOf('custom-auto-complete-wrap') > -1 ||
                                    el.className.indexOf('gm-style-mtc') > -1 ||
                                    el.className.indexOf('gmnoprint') > -1 ||
                                    el.className.indexOf('custom-map-type-wrap') > -1 ||
                                    el.className.indexOf('gm-style-cc') > -1)){
                                return true
                            }

                            return false
                        }
                    }).then((canvas) => {
                        document.body.appendChild(canvas);
                        canvas.toBlob(function (blob) {
                            var form = new FormData();
                            form.append('file', blob, '区位图.png')
                            // _this.upload(form)
                        })
                    })
                } catch (err) {
                    this.loadCount = -1
                }
            },
            upload (formData) {
                const _this = this
                this.$request({ method: "post",
                        url: (webConfig.fileServer || globalConfig.baseUrl) + '/' + globalConfig.fileUrl + '/data' || '/api/plat/shares/upload/data',
                        data: formData,
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }, function (data) {
                        data = data.Data
                        _this.$loadingClose()
                        const file = data.Files[0]
                        const fileData = {
                            UploadDate: data.UploadDate,
                            Uploader: data.Uploader,
                            UploaderId: data.UploaderId,
                            FileSize: file.Length,
                            Extension: file.Extension,
                            FileName: file.FileName,
                            ThumbnailPathSmall: file.ThumbnailPathSmall,
                            ThumbnailPathMiddle: file.ThumbnailPathMiddle,
                            ThumbnailPathLarge: file.ThumbnailPathLarge,
                            FilePath: file.RelativePath
                        }

                        if (_this.mapType === 'normal') {
                            _this.normalMap = fileData
                        } else {
                            _this.satelliteMap = fileData
                        }

                        typeof _this.option.onMapChange === 'function' && _this.option.onMapChange(_this.mapType, fileData)
                        _this.$refs.down.removeChild(this.$refs.down.firstChild)
                    },
                    function (e) {
                        _this.$loadingClose()
                        _this.error(e)
                    }
                )
            },
            /* ----------------------------------------------------------- insert (增) start ----------------------------------------------------------------*/

            /* ----------------------------------------------------------- insert (增) end ----------------------------------------------------------------*/

            /* ----------------------------------------------------------- delete (删) start ----------------------------------------------------------------*/

            /* ----------------------------------------------------------- delete (删) end ----------------------------------------------------------------*/

            /* ----------------------------------------------------------- update (改) start ----------------------------------------------------------------*/

            /* ----------------------------------------------------------- update (改) end ----------------------------------------------------------------*/

            /* ----------------------------------------------------------- select (查) start ----------------------------------------------------------------*/

            /* ----------------------------------------------------------- select (查) end ----------------------------------------------------------------*/

            /* ----------------------------------------------------------- handle (操) start ----------------------------------------------------------------*/

            /* ----------------------------------------------------------- handle (操) end ----------------------------------------------------------------*/

        },
        created() {

        },
        mounted() {

        }
    };
</script>

<style lang="less">
    @import './style.less';
    img{
        width: 200px;
    }
</style>
