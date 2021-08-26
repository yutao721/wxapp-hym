/*
 * @Author: zhangxm
 * @Date: 2020-12-28 15:12:16
 * @LastEditors: zhangxm
 * @LastEditTime: 2021-04-02 13:20:02
 * @Description: 工具类
 * @FilePath: /wxapp-school/utils/util.js
 */

import { PREFIX } from '../config/config';
import { promisifyAll } from 'miniprogram-api-promise';

const wxp = {};
promisifyAll(wx, wxp);

export class Util {
  constructor() {}

  /**
   * @description 获取缓存值
   * @author YoKa_zhangxm
   * @date 2020-12-18
   * @param {*} key
   * @returns
   * @memberof Util
   */
  getCache(key) {
    return wx.getStorageSync(`${PREFIX}${key}`) || null;
  }

  /**
   * @description 设置缓存值
   * @author YoKa_zhangxm
   * @date 2020-12-18
   * @param {*} key
   * @param {*} value
   * @memberof Util
   */
  setCache(key, value) {
    wx.setStorageSync(`${PREFIX}${key}`, value);
  }

  /**
   * @description 二次封装 wx.showModal
   * @author YoKa_zhangxm
   * @date 2020-12-30
   * @param {*} content
   * @param {*} confirmCallback
   * @param {string} [title='温馨提示']
   * @param {boolean} [showCancel=false]
   * @param {*} cancelCallback
   * @param {string} [confirmText='确定']
   * @param {string} [cancelText='取消']
   * @param {string} [confirmColor='#3cc51f']
   * @param {string} [cancelColor='#000000']
   * @memberof Util
   */
  showMsgModal(
    content,
    confirmCallback,
    title = '温馨提示',
    showCancel = false,
    cancelCallback,
    confirmText = '确定',
    cancelText = '取消',
    confirmColor = '#3cc51f',
    cancelColor = '#000000'
  ) {
    wx.showModal({
      title,
      content,
      showCancel,
      confirmText,
      cancelText,
      confirmColor,
      cancelColor,
      success(res) {
        if (res.confirm) {
          if (typeof confirmCallback == 'function') {
            confirmCallback();
          }
        } else if (res.cancel) {
          if (typeof cancelCallback == 'function') {
            cancelCallback();
          }
        }
      }
    });
  }

  /**
   * @description 获取当前页面对象
   * @author YoKa_zhangxm
   * @date 2020-12-20
   * @returns
   * @memberof Util
   */
  getCurrentPage() {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    return currentPage;
  }

  /**
   * @description 获取上个页面对象
   * @author YoKa_zhangxm
   * @date 2021-02-01
   * @returns
   * @memberof Util
   */
  getPreviousPage() {
    let pages = getCurrentPages();
    let previousPage = pages[pages.length - 2];
    return previousPage;
  }

  /**
   * @description
   * @author YoKa_zhangxm
   * @date 2020-12-31
   * @param {*} title
   * @param {string} [icon='none']
   * @param {number} [duration=1500]
   * @param {boolean} [mask=true]
   * @param {*} image
   * @returns
   * @memberof Util
   */
  showToast(title, icon = 'none', duration = 1500, mask = true, image) {
    return wxp
      .showToast({
        title,
        icon,
        duration,
        mask,
        image
      })
      .then((res) => {
        setTimeout(() => {}, duration);
      });
  }

  /**
   * @description 加载更多
   * @author YoKa_zhangxm
   * @date 2020-12-31
   * @param {function} cb
   * @returns
   * @memberof Util
   */
  onPageReachBottom(cb) {
    let _self = this.getCurrentPage();
    if (_self.data.isMore) cb(_self.data.page + 1);
  }

  /**
   * @description 时间戳转时间对象
   * @author YoKa_zhangxm
   * @date 2020-12-31
   * @param {*} inputTime
   * @returns
   * @memberof Util
   */
  timestamp2TimeObj(inputTime) {
    let date = new Date(inputTime);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    let d = date.getDate();
    d = d < 10 ? '0' + d : d;
    let h = date.getHours();
    h = h < 10 ? '0' + h : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;
    return {
      y,
      m,
      d,
      h,
      minute,
      second
    };
  }

  /**
   * @description 服务器时间转时间对象
   * @author YoKa_zhangxm
   * @date 2021-01-28
   * @param {*} time
   * @returns
   * @memberof Util
   */
  serverTime2TimeObj(date) {
    date = date.replace(/-/g, '/');
    let y = new Date(date).getFullYear();
    let m = new Date(date).getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    let d = new Date(date).getDate();
    d = d < 10 ? '0' + d : d;
    let h = new Date(date).getHours();
    h = h < 10 ? '0' + h : h;
    let minute = new Date(date).getMinutes();
    let second = new Date(date).getSeconds();
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;
    return {
      y,
      m,
      d,
      h,
      minute,
      second
    };
  }

  /**
   * @description 二次封装 wx.showLoading
   * @author YoKa_zhangxm
   * @date 2021-01-30
   * @param {string} [title='加载中...']
   * @returns
   * @memberof Util
   */
  showLoading(title = '加载中...') {
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title,
        mask: true,
        success: (result) => {
          resolve(result);
        }
      });
    });
  }

  /**
   * @description 节流函数
   * @author YoKa_zxmlovecxf
   * @date 2019-10-25
   * @param {function} fn
   * @param {*} interval
   * @returns
   * @memberof Util
   */
  throttle(fn, interval) {
    let enterTime = 0; //触发的时间
    let gapTime = interval || 300; //间隔时间，如果interval不传，则默认300ms
    return function() {
      let context = this;
      let backTime = new Date(); //第一次函数return即触发的时间
      if (backTime - enterTime > gapTime) {
        fn.call(context, arguments);
        enterTime = backTime; //赋值给第一次触发的时间，这样就保存了第二次触发的时间
      }
    };
  }

  /**
   * @description 防抖函数
   * @author YoKa_zxmlovecxf
   * @date 2019-10-25
   * @param {function} fn
   * @param {*} interval
   * @returns
   * @memberof Util
   */
  debounce(fn, interval) {
    let timer;
    let gapTime = interval || 1000; //间隔时间，如果interval不传，则默认1000ms
    return function() {
      clearTimeout(timer);
      let context = this;
      let args = arguments; //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
      timer = setTimeout(function() {
        fn.call(context, args);
      }, gapTime);
    };
  }

  /**
   * @description 时间差
   * @author YoKa_zhangxm
   * @date 2021-03-11
   * @param {*} before
   * @param {*} [after=new Date()]
   * @returns
   * @memberof Util
   */
  timeToNow(before, after = new Date()) {
    let dateBegin = before;
    let dateEnd = after;

    if (typeof dateBegin != 'number') {
      if (typeof dateBegin != 'object') {
        dateBegin = new Date(dateBegin.replace(/-/g, '/')); //将-转化为/，使用new Date
      }
      if (typeof dateEnd != 'object') {
        if (typeof dateEnd == 'number') {
          dateEnd = new Date(Number(dateEnd) * 1000);
        } else {
          dateEnd = new Date(dateEnd.replace(/-/g, '/'));
        }
      }
    } else {
      dateBegin = new Date(Number(dateBegin) * 1000);
      dateEnd =
        typeof dateEnd == 'object' ? dateEnd : new Date(Number(dateEnd) * 1000);
    }
    let dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
    let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
    let leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    let hours = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
    //计算相差分钟数
    let leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    let minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
    //计算相差秒数
    let leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
    let seconds = Math.round(leave3 / 1000);
    let allMinutes = dayDiff * 24 * 60 + hours * 60 + minutes;
    let allSeconds =
      dayDiff * 24 * 3600 + hours * 3600 + minutes * 60 + seconds;
    let dayHours = `${dayDiff}天${hours}小时`;
    let allHours = `${dayDiff * 24 + hours}`;
    return {
      dayDiff,
      hours,
      minutes,
      seconds,
      allMinutes,
      allSeconds,
      dayHours,
      allHours
    };
  }

  /**
   * @description rpx转px
   * @author YoKa_zxmlovecxf
   * @date 2019-08-14
   * @param {*} rpx
   * @returns
   * @memberof Util
   */
  rpxToPx(rpx) {
    let systemInfo = wx.getSystemInfoSync();
    return Number((rpx / 750) * systemInfo.windowWidth);
  }

  /**
   * @description 秒转时分秒
   * @author YoKa_zhangxm
   * @date 2020-09-22
   * @param {*} s
   * @returns
   * @memberof Util
   */
  secToTimeObj(s) {
    let t;
    if (s > -1) {
      let hour = Math.floor(s / 3600);
      let min = Math.floor(s / 60) % 60;
      let sec = s % 60;
      let h, m, s;
      if (hour < 10) {
        h = '0' + hour;
      } else {
        h = hour;
      }

      if (min < 10) {
        m = '0' + min;
      } else {
        m = min;
      }

      if (sec < 10) {
        s = '0' + sec;
      } else {
        s = sec;
      }
    }
    return {
      h,
      m,
      s
    };
  }

  /**
   * @description 时间戳转年月日时分秒
   * @author YoKa_zhangxm
   * @date 2019-12-03
   * @param {*} inputTime
   * @returns
   * @memberof Util
   */
  serDate2Time(inputTime) {
    var date = new Date(inputTime * 1000);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? '0' + d : d;
    var h = date.getHours();
    h = h < 10 ? '0' + h : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;

    return {
      date: `${y}-${m}-${d}`,
      time: `${h}:${minute}:${second}`,
      dateTime: `${y}-${m}-${d} ${h}:${minute}:${second}`,
      dateTimeNoSecond: `${y}-${m}-${d} ${h}:${minute}`
    };
  }
}
