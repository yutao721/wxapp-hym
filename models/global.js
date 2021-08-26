import * as L from '../config/login';
import { Http } from '../lib/http';
import { UPLOAD_IMAGE, UPLOAD_FILES } from '../config/config';

let app = getApp();

export class Global extends Http {
  constructor() {
    super();
  }

  /**
   * @description 用户授权
   * @author YoKa_zhangxm
   * @date 2020-12-31
   * @param {*} e
   * @returns
   * @memberof Global
   */
  authen(e) {
    let _this = this;
    let _util = app.$util;
    return new Promise((resolve, reject) => {
      console.log(e);
      if (e.errMsg == 'getUserInfo:fail auth deny') {
        _util.showToast('授权失败');
        return false;
      }
      _this
        .request(L.USER_AUTH, 'POST', {
          encryptedData: e.encryptedData,
          iv: e.iv,
          userInfo: e.userInfo,
          signature: e.signature
        })
        .then((res) => {
          console.zxm('用户授权', res);
          let resData = res.data;
          _util.setCache('TOKEN', resData.meta.access_token);
          _util.setCache('USERINFO', resData);
          _util.getCurrentPage().setData({
            isLogin: true,
            userInfo: {
              avatar: resData.avatar_url,
              nickname: resData.nickname,
              userId: resData.id,
              status: resData.status
            }
          });
          _util.showToast('登录成功!');
          resolve(res);
        });
    });
  }

  /**
   * @description 上传图片
   * @author YoKa_zhangxm
   * @date 2021-01-30
   * @param {*} imgPaths
   * @param {function} cb
   * @param {string} [fileName='file']
   * @param {number} [index=0]
   * @returns
   * @memberof Global
   */
  upLoadImage(
    imgPaths,
    cb,
    fileName = 'file',
    index = 0,
    isShowLoading = true
  ) {
    return this.uploadImages(
      UPLOAD_IMAGE,
      imgPaths,
      cb,
      fileName,
      index,
      isShowLoading
    );
  }

  /**
   * @description 上传文件
   * @author YoKa_zhangxm
   * @date 2021-06-04
   * @param {*} imgPaths
   * @param {function} cb
   * @param {string} [fileName='file']
   * @param {number} [index=0]
   * @param {boolean} [isShowLoading=true]
   * @returns
   * @memberof Global
   */
  uploadFile(imgPaths, cb, fileName = 'file', index = 0, isShowLoading = true) {
    return this.uploadFiles(
      UPLOAD_FILES,
      imgPaths,
      cb,
      fileName,
      index,
      isShowLoading
    );
  }
}
