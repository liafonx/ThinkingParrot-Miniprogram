// miniprogram/pages/timerdemo/timerdemo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: 100,
    t: 12,
    maxtime: 12,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.countdown();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
     * 获取系统信息
     */
    getSystemInfo: function () {
      return new Promise((a, b) => {
          wx.getSystemInfo({
              success: function (res) {
                  a(res)
              },
              fail: function (res) {
                  b(res)
              }
          })
      })
  },
  /**
   * 进度条动画
   */
  countdown: function () {
      const requestAnimationFrame = callback => {
          return setTimeout(callback, 1000 / 60);
      }, cancelAnimationFrame = id => {
          clearTimeout(id);
      };

      this.getSystemInfo().then(v => {
          let maxtime = this.data.maxtime,
              width = this.data.width,
              sTime = +new Date,
              _ts = this,
              temp,   
              animate;
          (animate = () => {
              temp = requestAnimationFrame(() => {
                  let time = maxtime * 1000,
                      currentTime = +new Date,
                      schedule = 1 - (currentTime - sTime) / time,
                      schedule_1 = schedule <= 0 ? 0 : schedule,
                      width = parseInt(schedule_1 * 100),
                      t = parseInt((this.data.maxtime) * schedule_1)+1;
                  _ts.setData({
                      width: width,
                      t:t
                  });
                  if (schedule <= 0) {
                      cancelAnimationFrame(temp);
                      _ts.setData({
                          width: width,
                          t: 0
                      });
                      return;
                  } else {
                      animate();
                  };
              })
          })();

      });
  },
})