import { GET_TOKEN } from '../config/login';
import { HOST } from '../config/config';
import { promisifyAll } from 'miniprogram-api-promise';

const wxp = {};
promisifyAll(wx, wxp);
let app = getApp();

export class Http {
  constructor() {}

  /**
   * @description request请求
   * @author YoKa_zhangxm
   * @date 2020-12-18
   * @param {*} url
   * @param {*} [method='GET']
   * @param {*} [data={}]
   * @returns
   * @memberof Http
   */
  request(url, method = 'GET', data = {}) {
    let _this = this;

    // if (!app.$util.getCache('TOKEN') && url != 'auth/login') {
    //   return _this.getToken(url, method, data);
    // }

    return wxp.request({
      url: url.startsWith('http') ? url : HOST + url,
      method,
      data,
      header: method == 'POST' ? {
        'content-type': 'application/json',
        Authorization: 'Bearer ' + app.$util.getCache('TOKEN')
      } : {
        Authorization: 'Bearer ' + app.$util.getCache('TOKEN')
      },
      dataType: 'json'
    }).then((res) => {
      let statusCode = res.statusCode;
      let resData = res.data;
      let resCode = res.data.code;
      let resHeader = res.header;

      app.$util.getCurrentPage().setData({
        isLogin: resHeader['Is-Authorize'] == 1,
        isSchool: resHeader['Is-College'] != 0,
        isMobile: resHeader['Is-Mobile'] != 0
      });

      if (resHeader['Is-College'] != 0) {
        app.$util.getCurrentPage().setData({
          schoolId: resHeader['Is-College']
        });
      }

      if (statusCode.toString().startsWith('5')) {
        app.$util.showMsgModal('服务器报错，请重试！');
        return { resCode: statusCode };
      }

      // 换成枚举最好
      switch (Number(statusCode)) {
        case 200:
          if (resCode == 200) {
            return resData;
          } else {
            app.$util.showMsgModal(resData.msg);
            return { resCode };
          }
          break;
        case 401:
          return _this.getToken(url, method, data);
          break;
        default:
          app.$util.showMsgModal('服务器报错!');
          console.zxm(`${url}接口报错`, err);
          break;
      }
    }).catch((err) => {
      console.zxm(`${url}接口报错`, err);
      let errorCode = err.status;
      switch (Number(errorCode)) {
        case 401:
          return _this.getToken(url, method, data);
          break;
        default:
          break;
      }
    });
  }

  /**
   * @description 获取token
   * @author YoKa_zhangxm
   * @date 2020-12-29
   * @param {*} url
   * @param {*} method
   * @param {*} data
   * @param {number} [type=3]
   * @returns NOTE: 授权类型，默认 auth_base。支持 auth_base（静默授权）/ auth_user（主动授权）/ auth_zhima （获取用户芝麻信息）。
   * @memberof Http
   */
  getToken(url, method, data) {
    return this.getWxCode().then(() => {
      return this.request(url, method, data);
    });
  }

  /**
   * @description 获取token
   * @author YoKa_zhangxm
   * @date 2020-12-29
   * @param {number} [type=3]
   * @returns
   * @memberof Http
   */
  getWxCode() {
    let _this = this;
    return wxp.login().then((res) => {
      console.zxm('获取code', res);
      return _this
        .request(GET_TOKEN, 'POST', {
          code: res.code
        })
        .then((resReq) => {
          console.zxm('获取到token', resReq);
          if (resReq.code == 0) {
            app.$util.setCache('TOKEN', resReq.data.meta.access_token);
            app.$util.setCache('USERINFO', resReq.data);
          }
        });
    });
  }

  /**
   * @description 上传图片
   * @author YoKa_zhangxm
   * @date 2021-01-30
   * @param {*} url
   * @param {*} imgPaths
   * @param {*} successFiles
   * @param {function} cb
   * @param {*} name
   * @param {*} index
   * @memberof Http
   */
  uploadImages(url, imgPaths, cb, name, index, isShowLoading) {
    let _this = this;
    let _self = app.$util.getCurrentPage();
    if (index == 0) {
      _this.successFiles = [];
      _this.failFilesCount = 0;
    }
    isShowLoading && app.$util.showLoading(`正在上传第${index + 1}张`);
    const uploadTask = wx.uploadFile({
      url: url.startsWith('http') ? url : HOST + url,
      filePath: imgPaths[index],
      name,
      header: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${app.$util.getCache('TOKEN')}`
      },
      formData: {},

      success(res) {
        if (res && res.data && res.statusCode == 200) {
          var result = JSON.parse(res.data);
          if (result.data) {
            _this.successFiles.push(result.data);
            if (_self.delIdx) {
              _this.successFiles.splice(_self.delIdx, 1);
              _self.delIdx = '';
            }
          }
        } else {
          console.error('上传图片报错', res);
          _this.failFilesCount++;
        }
      },
      fail(err) {
        console.log('上传图片报错', err);
      },
      complete() {
        index++;
        if (index == imgPaths.length) {
          isShowLoading && wx.hideLoading();
          if (_this.failFilesCount) {
            app.$util.showToast(`第${_this.failFilesCount}张图上传失败`);
            let idx = (_self.uploadedImagesLength ? _self.uploadedImagesLength : 0) + _this.failFilesCount;
            let tempPublicityImages = _self.data.tempPublicityImages;
            tempPublicityImages.splice(idx, 1);
            _self.setData({
              tempPublicityImages
            });
          }
          _self.setData({
            isLoadingImages: false
          });
          cb && cb(_this.successFiles);
        } else {
          _this.uploadImages(url, imgPaths, cb, name, index, isShowLoading);
        }
      }
    });

    uploadTask.onProgressUpdate((res) => {
      let idx = (_self.uploadedImagesLength ? _self.uploadedImagesLength : 0) + index;
      _self.setData({
        ['tempPublicityImages[' + idx + '].progress']: res.progress,
        ['tempPublicityImages[' + idx + '].blur']: 10 - 0.1 * res.progress
      });

      res.progress == 100 && wx.vibrateShort();
    });
  }

  /**
   * @description 上传文件
   * @author YoKa_zhangxm
   * @date 2021-06-04
   * @param {*} url
   * @param {*} imgPaths
   * @param {function} cb
   * @param {*} name
   * @param {*} index
   * @param {boolean} isShowLoading
   * @memberof Http
   */
  uploadFiles(url, filePaths, cb, name, index, isShowLoading) {
    let _this = this;
    let _self = app.$util.getCurrentPage();
    if (index == 0) {
      _this.successFiles = [];
      _this.failFilesCount = 0;
    }
    isShowLoading && app.$util.showLoading(`正在上传`);
    console.zxm('filePaths', filePaths);
    const uploadTask = wx.uploadFile({
      url: url.startsWith('http') ? url : HOST + url,
      filePath: filePaths[index].path,
      name,
      header: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${app.$util.getCache('TOKEN')}`
      },
      formData: {},

      success(res) {
        if (res && res.data && res.statusCode == 200) {
          var result = JSON.parse(res.data);
          console.log(result);
          if (result.data && result.code == 0) {
            _this.successFiles.push(result.data);
            if (_self.delIdx) {
              _this.successFiles.splice(_self.delIdx, 1);
              _self.delIdx = '';
            }
          } else {
            console.error('上传文件报错', result);
            app.$util.showToast(result.msg);
          }
        } else {
          console.error('上传文件报错', res);
          _this.failFilesCount++;
        }
      },
      fail(err) {
        console.log('上传文件报错', err);
      },
      complete() {
        index++;
        if (index == filePaths.length) {
          isShowLoading && wx.hideLoading();
          if (_this.failFilesCount) {
            app.$util.showToast(`第${_this.failFilesCount}个文件上传失败`);
            let idx = _self.uploadedFilesLength + _this.failFilesCount;
            let tempPublicityFiles = _self.data.tempPublicityFiles;
            tempPublicityFiles.splice(idx, 1);
            _self.setData({
              tempPublicityFiles
            });
          }
          _self.setData({
            isLoadingFiles: false
          });
          cb && cb(_this.successFiles);
        } else {
          _this.uploadFiles(url, filePaths, cb, name, index, isShowLoading);
        }
      }
    });

    uploadTask.onProgressUpdate((res) => {
      let idx = _self.uploadedFilesLength + index;
      _self.setData({
        ['tempPublicityFiles[' + idx + '].progress']: res.progress,
        ['tempPublicityFiles[' + idx + '].blur']: 10 - 0.1 * res.progress
      });

      res.progress == 100 && wx.vibrateShort();
    });
  }
}
