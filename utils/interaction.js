export class Interaction {
  constructor() {}

  /**
   * @description 用户点击触发
   * @param {number} [timeout=0]
   * @param {function} cb
   * @memberof Interaction
   */
  userTap(timeout = 0, cb) {
    wx.vibrateShort();
  }
}
