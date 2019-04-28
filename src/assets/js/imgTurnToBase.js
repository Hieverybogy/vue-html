/**
 * Created by JANZ on 2017/3/23.
 */
const turnToBase = function (obj, tarSize, fn) {
    let self = obj;
    let targetSize = tarSize;
    let file = self.files[0];
    let r = new FileReader();

    r.readAsDataURL(file);

    r.onload = function () {
        let fileStream = this.result;
        let URL = window.URL || window.webkitURL,
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');
        if (URL && File && ctx) {
            // let fileURL = URL.createObjectURL(file),
            let img = new Image();
            img.src = fileStream;
            img.onload = function () {

                let drawWidth = img.width, drawHeight = img.height;
                //以下改变一下图片大小

                let maxSide = Math.max(drawWidth, drawHeight);
                let tarSize = targetSize;
                if (maxSide > tarSize) {
                    let minSide = Math.min(drawWidth, drawHeight);
                    minSide = minSide / maxSide * tarSize;
                    maxSide = tarSize;
                    if (drawWidth > drawHeight) {
                        drawWidth = maxSide;
                        drawHeight = minSide;
                    } else {
                        drawWidth = minSide;
                        drawHeight = maxSide;
                    }
                }
                canvas.width = drawWidth;
                canvas.height = drawHeight;
                ctx.drawImage(img, 0, 0, drawWidth, drawHeight);
                let base64 = canvas.toDataURL('image/jpeg');
                if (fn) {
                    fn(base64);
                }
                canvas = null;
                img = null;
            };
        } else {
            fn && fn(fileStream);
        }
    };
};
export default turnToBase;