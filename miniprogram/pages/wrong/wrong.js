// pages/learning.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      wrongnumber: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var wrongnumber = 0;
    if(wx.getStorageSync('wronglist')){
      wrongnumber = JSON.parse(wx.getStorageSync('wronglist')).length;
    }
    
    this.setData({
      wrongnumber: wrongnumber,
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
    wx.navigateTo({
      url: '../wronglearning/wronglearning?testId=' + testId
      
    })
  },
  jumpPage: function (e) {
    wx.navigateTo({
      // url: '../logs/logs'
      url: '../collection/collection'
    })
  }
})