/*
 * @Author: zhangxm
 * @Date: 2020-12-18 16:55:07
 * @LastEditors: zhangxm
 * @LastEditTime: 2020-12-30 03:49:50
 * @Description: 日志记录
 * @FilePath: /wxapp-school/lib/log.js
 */

var LOGDEBUG = true;
try {
  if (typeof console.__proto__.zxm !== 'function') {
    console.__proto__.zxm = function(tips, v, style) {
      if (!LOGDEBUG) return false;
      if (!style) {
        style =
          'background-image: linear-gradient(45deg, #ffc387, #ff6a61);color:white;font-size: 20px;padding:10px;border-radius:10px';
      }
      if (!v) {
        console.log(`%c${tips || ''}`, style);
      } else {
        console.log(`%c${tips || ''} =========>`, style, v || '');
      }
    };
  }
} catch (error) {
  console.log('console proto error.');
}
