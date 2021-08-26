/*
 * @Author: zhangxm
 * @Date: 2021-01-11 16:29:59
 * @LastEditors: zhangxm
 * @LastEditTime: 2021-01-11 16:31:13
 * @Description: 业务工具
 * @FilePath: /wxapp-school/utils/index.js
 */

import { promisifyAll } from 'miniprogram-api-promise';

/**
 * @description promise化小程序api接口
 * @author YoKa_zhangxm
 * @date 2021-01-11
 * @export
 * @returns promise化后api集合
 */
export function promiseWXApi() {
	const wxp = {};
	promisifyAll(wx, wxp);
	return wxp;
}
