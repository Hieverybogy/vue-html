/**
 * Created by chenwenqiang on 2017/3/28.
 */

export function paramToObject(str) {
    let obj = {};
    if (str.substring(0, 1) == '?') {
        str = str.slice(1);
    }

    let strArr = str.split('&');
    let param = '';
    for (let i = 0; i < strArr.length; i++) {
        param = strArr[i].split('=');
        obj[param[0]] = param[1] || null;
    }

    return obj;
}

function objectToParam(obj) {
    let str = '';
    for (let key in obj) {
        str += `${key}=${obj[key]}&`;
    }
    str = str.slice(0, -1);
    return str;
}

//获取地址栏参数，转化成json
export function getDataFromParam(key) {
    let param = location.search;

    if (!param) {
        return null;
    } else {
        param = paramToObject(decodeURIComponent(param.slice(0)));
    }
    return param[key];
}

export function getDataFromRouter(key) {
    let param = location.hash;
    let begin = param.indexOf('?');
    if (!param) {
        return null;
    } else {
        param = paramToObject(decodeURIComponent(param.slice(begin + 1)));
    }
    return param[key];
}

//带参数跳转到目标页面
export function turnToNextPage(url, opt, newWin) {
    let u = isEmpty(opt) ? url : `${url}?${objectToParam(opt)}`;
    if (newWin) {
        window.open(u);
    } else {
        window.location.href = u;
    }
}

//根据逗号拆分字符串为数组
export function sepByComma(data, emptyTxt) {
    let emptyArray = !emptyTxt ? [] : [emptyTxt];
    return !data ? emptyArray : data.split(',');
}

//将数组根据按逗号组合
export function joinByComma(arr) {
    if (!Array.isArray(arr)) return arr;
    return arr.length == 0 ? '' : arr.join(',');
}

//判断是否为undefined并设置值,不设值时判断是否为空
export function setEmpty(data, val) {
    if (data == undefined) {
        return val != undefined ? val : false;
    } else {
        return data;
    }
}

export const DateUtils = {
    now: function () {
        return new Date();
    },
    dateFormat: function (date, fmt) {
        if (!date) return '';
        let o = {
            'M+': date.getMonth() + 1, // 月份
            'd+': date.getDate(), // 日
            'h+': date.getHours(), // 小时
            'm+': date.getMinutes(), // 分
            's+': date.getSeconds(), // 秒
            'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
            'S': date.getMilliseconds() // 毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (let k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            }
        }
        return fmt;
    },
    dayCalc(paramData, i) {
        let date = paramData || this.now();
        date.setDate(date.getDate() + i);
        return date;
    },
    //将 yyyy-MM-dd hh:mm:ss 格式转成正确的Date对象;
    dateToRegular: function (value) {
        let v = value.replace(/\D+/g, ',').split(',');
        v[1] = parseInt(v[1]) - 1;
        for (let i = 0; i < v.length; i++) {
            v[i] = parseInt(v[i]);
        }
        v = v.join(',');
        return eval('(new Date(' + v + '))');
    },
    //比较两个时间,如果开始时间大于结束时间,则交换两个时间
    swapTime(startTime, endTime) {
        const start = startTime ? DateUtils.dateToRegular(startTime).getTime() : '';
        const end = endTime ? DateUtils.dateToRegular(endTime).getTime() : '';
        let timeArr = [];
        if (start && end && start > end) {
            startTime = [endTime, endTime = startTime][0];
            timeArr = [startTime, endTime];
        } else if (start && end) {
            timeArr = [startTime, endTime];
        } else if (start) {
            timeArr = [startTime, ''];
        } else if (end) {
            timeArr = ['', endTime];
        }
        return timeArr;
    }
};

// 去首尾空格
export function strim(str) {
    if (str === undefined || str === null) return '';
    return str.replace(/(^\s*)|(\s*$)/g, '');
}

// 判断是否为空 {}，[],'','undefined','null','NaN',undefined,null,NaN
export function isEmpty(v) {
    if (v && typeof v === 'object') {
        return Object.keys(v).length === 0;
    } else if (Array.isArray(v)) {
        return v.length === 0;
    } else {
        return v === '' || v === 'undefined' || v === undefined || v === null || v === 'null';
    }
}

//验证规则
const Regs = {
    isID: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    isChinese: /^[\u4e00-\u9fa5]+$/,
    isEmail: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    isURL: /^[a-zA-z]+:\/\/[^\s]+$/,
    isTel: /^(0[1-9]{2})-\d{8}$|^(0[1-9]{3}-(\d{7,8}))$/,
    isMobile: /^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d)\d{5}(\d{3}|\*{3})$/,
    isLegal: /^[a-zA-Z0-9]{6,20}$/, //(允许6-20字节，允许字母数字下划线)
    isIP: /^\d+\.\d+\.\d+\.\d+$/,
    isEmpty: /^\s*$/,
    isCarNum: /^[a-zA-Z0-9]{5}$/,
    isFullCarNum: /^[\u4e00-\u9fa5][a-zA-Z][a-zA-Z0-9]{5}$/,
    isName: /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]{0,13}$/ //姓名和昵称格式
};
//按规则验证
String.prototype.isInReg = function (reg) {
    var _i = reg;
    var _s = this;
    return _i.test(_s);
};

//汉字验证
export function isChinese(val) {
    return val.isInReg(Regs.isChinese);
}

//移动电话验证
export function isMobile(mobile) {
    return (mobile || '').isInReg(Regs.isMobile);
}

//身份证验证
export function isID(id) {
    return id.isInReg(Regs.isID);
}

//邮箱验证
export function isEmail(email) {
    return email.isInReg(Regs.isEmail);
}

//优化JSON.parse方法
export function parseJSON(str) {
    return str && typeof str === 'string' ? JSON.parse(str) : str;
}

//设置cookie
export function setCookie(name, value, time) {
    let strsec = getsec(time);
    let exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
}

//----设置cookie中获取时间-----
//这是有设定过期时间的使用示例：
//s20是代表20秒
//h是指小时，如12小时则是：h12
//d是天数，30天则：d30
export function getsec(str) {
    let str1 = str.substring(1, str.length) * 1;
    let str2 = str.substring(0, 1);
    if (str2 == "s") {
        return str1 * 1000;
    }
    else if (str2 == "h") {
        return str1 * 60 * 60 * 1000;
    }
    else if (str2 == "d") {
        return str1 * 24 * 60 * 60 * 1000;
    }
}

//获取cookie
export function getCookie(name) {
    let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

//删除cookie
export function delCookie(name) {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

/* 日期转化 */
export function formatDate(NewDtime) {
    let datetime = new Date(NewDtime);
    let year = datetime.getFullYear();
    let month = datetime.getMonth() + 1;//js从0开始取
    let date = datetime.getDate();
    let hour = datetime.getHours();
    let minutes = datetime.getMinutes();
    let second = datetime.getSeconds();

    if (month < 10) {
        month = "0" + month;
    }
    if (date < 10) {
        date = "0" + date;
    }
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (second < 10) {
        second = "0" + second;
    }
    let time = year + "-" + month + "-" + date + " " + hour + ":" + minutes + ":" + second; //2009-06-12 17:18:05
    return time;
}