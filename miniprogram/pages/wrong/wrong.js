// pages/learning.js

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      wrongnumber: 0,
      wronglistnumber: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var wronglistnumber = [];
    var worongtotalnumber = 0;
    var that = this;
    var url = 'http://34.92.251.246:8091/questionRecord/getWrongNum/';
    wx.request({
      method: 'POST',
      header: {
        "accept": "*/*",
        "content-type": "application/x-www-form-urlencoded"
      },
      url: url,
      data: {
        commonUserID: app.globalData.openId,
      },
      success: function (response) {
        // that.loadingOff();
        console.log(response);
        that.setData({
          wronglistnumber: response.data.wrongQuestionNum,
          worongtotalnumber: response.data.wrongQuestionNum['total']
        })
      },
      fail: function (res) {
        console.log(res);
        // that.loadingOff();
        wx.showToast({
          title: '获取错题数失败',
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
    var wrongnumber = 0;
    if(wx.getStorageSync('wronglist')){
      wrongnumber = JSON.parse(wx.getStorageSync('wronglist')).length;
    }
    
    this.setData({
      wrongnumber: wrongnumber,
    })
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
  toTestPage: function (e) {
    let testId = e.currentTarget.dataset['testid'];
    switch (testId) {
      case '1':
        wx.navigateTo({
          url: '' + testId //跳转到答题页， 传入试题
        })
        break;
      case '2':
        wx.navigateTo({
          url: '../choice/choice?testId=Level' + testId + "&state=wrong" + "&currLec=改错" //跳转到答题页， 传入试题
        })
        break;
      case '3':
        wx.navigateTo({
          url: '../choice/choice?testId=Level' + testId + "&state=wrong" + "&currLec=改错" //跳转到答题页， 传入试题
        })
        break;
      case '4':
        wx.navigateTo({
          url: '../speak/speak?testId=Level' + testId + "&state=wrong" + "&currLec=改错" //
        })
        break;
      default:
        console.log(this.data.currLevel);
    }
  },
  jumpPage: function (e) {
    wx.navigateTo({
      // url: '../logs/logs'
      url: '../collection/collection'
    })
  }
})