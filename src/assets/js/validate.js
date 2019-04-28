/**
 * Created by JANZ on 2017/10/31.
 */
import { isEmpty } from './utils.js';

/**
 * @params R 自定义规则,格式参照格式范例
 * @params obj 需要验证的属性所在对象
 * @example R
 * {
 *      key1 : {
 *          required : 'key1不能为空',
 *          rules:[
 *              {
 *                  rule(val){
 *                      return val > 10
 *                  },
 *                  msg : 'key1不能大于10'
 *              },
 *              {
 *                  rule(val){
 *                      return val < 2
 *                  },
 *                  msg : 'key1不能小于2'
 *              }
 *          ]
 *      },
 *      key2,
 *      ......
 * }
 */

function validate(R, obj) {
    for (let key in R) {
        //验证为空
        if (!isEmpty(R[key].required) && isEmpty(obj[key])) {
            return R[key].required;
        }
        //自定义规则验证
        let rs = R[key].rules || [];
        let len = rs.length;
        if (len > 0) {
            for (let i = 0; i < len; i++) {
                if (rs[i].rule(obj[key])) return rs[i].msg;
            }
        }
    }
    return false;
}

export default validate;