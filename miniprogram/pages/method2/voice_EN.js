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
      var url = 'http://34.92.251.246:8091/questionRecord/signAddScore/';
      wx.request({
        method: 'POST',
        header: {
          "accept": "*/*",
          "content-type": "application/x-www-form-urlencoded"
        },
        url: url,
        data: {
          commonUserID: app.globalData.openId,
          // level: that.data.testId,
          // wrong: JSON.stringify([]),
          // right: JSON.stringify(that.data.rightListID),
          // score: that.data.totalScore*0.8
        },
        success: function (response) {
          console.log(response);
          // that.setData({
          //   rankingList: response.data.result
          // })
        },
        fail: function (res) {
          wx.showToast({
            title: '上传答题记录失败',
            icon: 'none',
            duration: 2000,
            success: function () {
              return;
            }
          })
          console.log(res);
        }
      })
  }
})