Page({
  data: {
    popup: true
  },
  /* 隐藏弹窗 */
  hidePopup(flag = true) {
    this.setData({
        "popup": flag
    });
  },
  /* 显示弹窗 */
  showPopup() {
    this.hidePopup(false);
  },

  onLoad: function(e) {
      var that = this
      var that = this;
      var url = 'http://34.92.251.246:8091/questionRecord/test/';
      if (this.data.state) {
        url = 'http://34.92.251.246:8091/questionRecord/getWrongQuestion/'
      }
      console.log(url);
      wx.request({
        method: 'POST',
        header: {
          "accept": "*/*",
          "content-type": "application/x-www-form-urlencoded"
        },
        url: url,
        // data: {
        //   commonUserID: app.globalData.openId,
        //   level: level,
        //   lecture: lecture
        // },
        success: function (response) {
          console.log(response);

        },
        fail: function (res) {
          console.log(res);
          prompt.toast('获取题目失败');
          setTimeout(function () {
            that.onUnload();
          }, 2000)
          return
        }
      })
  }
})