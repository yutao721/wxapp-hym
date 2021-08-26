import { Index } from '../../models/index'
import WxParse from '../../wxParse/wxParse.js';

const INDEX = new Index();
const app = getApp();
Page({
  data: {},

  getDetail(id) {
    let _this = this;
    INDEX.getDetail({ id }).then(res => {
      // 富文本解析
      let article = res.data.content;
      article && WxParse.wxParse('article', 'html', article, _this, 15);
      res.data.time = app.$util.serDate2Time(res.data.addtime).date;
      this.setData({ detail: res.data })
    })
  },

  onLoad(options) {
    this.getDetail(options.id)
  }

});
