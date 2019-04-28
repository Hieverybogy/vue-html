/**
 * Created by janzho on 2017/7/4.
 */
import { turnToNextPage, isEmpty } from './utils';

let host = window.location.host;
let hostArr = host.split('.');
let isLocal = hostArr[0] == '192' || hostArr[0].indexOf('localhost') > -1;
let appointUrl = {};
appointUrl.ma = isLocal ? 'http://localhost:8280' : `http://ma.${hostArr[1]}.com`;
appointUrl.emkt = isLocal ? 'http://localhost:8380' : `http://emkt.${hostArr[1]}.com`;

export function turnToHostPage(url, hostName, params) {
    let fullUrl = isEmpty(hostName) ? url : `${appointUrl[hostName]}${url}`;
    turnToNextPage(fullUrl, params);
}
export { appointUrl };