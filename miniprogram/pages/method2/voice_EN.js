const DEFAULT_PAGE = 0;
var app = getApp();
Page({
  startPageX: 0,
  currentView: DEFAULT_PAGE,
  data: {
    toView: `card_${DEFAULT_PAGE}`,
    list: ['Javascript', 'Typescript', 'Java', 'PHP', 'Go']
  },

  onLoad() {
      // this.loadingOn()
      var that = this;
      var url = 'http://34.92.251.246:8091/questionRecord/getHistory/';
      wx.request({
        method: 'POST',
        header: {
          "accept": "*/*",
          "content-type": "application/x-www-form-urlencoded"
        },
        url: url,
        data: {
          commonUserID: app.globalData.openId,
          level: "Level2",
          lecture: "Lecture  2"
        },
        success: function (response) {
          // that.loadingOff();
          console.log(response);
        },
        fail: function (res) {
          console.log(res);
          // that.loadingOff();
          wx.showToast({
            title: '获取题目失败',
            icon: 'none',
            duration: 2000,
            success: function () {
              return;
            }
          })
          setTimeout(function () {
            that.onUnload();
          }, 2000)
          return
        }
      })
  }
})