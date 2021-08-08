const Prompt = require("../../utils/prompt");

// miniprogram/pages/collection/collection.js
var prompt = Prompt
var app = getApp()
var collectList = {
  "LECT1": [
    {
    unit: 'lecture1',
    id: 5,
    example: "Everyone is out for himself.",
    translation: "人人为己",
    meaning: '',
  },
  {
    unit: 'lecture1',
    index: 6,
    question: "赚钱",
    answer: "In the black",
  }
  ],
  "lecture2": [],
  "LECT3":[ {
    unit: 'lecture3',
    index: 5,
    question: "人人为己",
    answer: "Everyone is out for himself.",
  },
  {
    unit: 'lecture3',
    index: 6,
    question: "赚钱",
    answer: "In the black",
  }],
  "lecture4":[],
  "lecture5":[],
  "LECT6":[ {
    unit: 'lecture6',
    index: 5,
    question: "人人为己",
    answer: "Everyone is out for himself.",
  },
  {
    unit: 'lecture6',
    index: 6,
    question: "赚钱",
    answer: "In the black",
  }],
  "lecture7":[],
}


Page({
  /**
   * 页面的初始数据
   */
  data: {
   collection: '',
   choosed: null,
   currLevel: null,
   hiddensetting: true,
   delete:'',
   ifCollected: false,
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    prompt.loadingOn()
    var that = this;
    var openId = wx.getStorageSync('openid');
    if (wx.getStorageSync("collectLect")) {
      this.data.choosed = wx.getStorageSync("collectLect")
      wx.setStorageSync('collectLect', '')
    }
    if (wx.getStorageSync("collectlevel")) {
      this.data.currLevel = wx.getStorageSync("collectlevel")
      wx.setStorageSync('collectlevel', '')
    }
    console.log(this.data.choosed, this.data.currLevel);
    wx.request({
      method: 'POST',
      header: {
        "accept": "*/*",
        "content-type": "application/x-www-form-urlencoded"
      },
      url: 'http://34.92.251.246:8091/questionRecord/getNotesCollection/',
      data: {
        commonUserID: openId,
      },
      success: function (response) {
        prompt.loadingOff();
        console.log(response);
        console.log(response.data.collectedQuestion);
        if (response.data.collectedQuestion) {
          that.setData({
            collection: response.data.collectedQuestion,
            ifCollected: true,
          })
        }else{
            prompt.toast("获取收藏夹失败")
        }

      },
      fail: function (res) {
        console.log(res);
        prompt.toast("获取收藏夹失败")
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

  ChangeUnit: function (e) {
    console.log(e.currentTarget.dataset.unit);
    this.setData({
      choosed: e.currentTarget.dataset.unit,
      currLevel: '',
    })
  },

  ChangeLevel: function(e) {
    this.setData({
      currLevel: e.currentTarget.dataset.level,
    })
  },

  Confirm: function () {
    prompt.loadingOn()
    var index = this.data.delete;
    console.log(index);
    wx.setStorageSync('collectlevel', this.data.currLevel)
    wx.setStorageSync('collectLect', this.data.choosed)
    var that = this;
      var url = 'http://34.92.251.246:8091/questionRecord/toCancelCollect/';
      wx.request({
        method: 'POST',
        header: {
          "accept": "*/*",
          "content-type": "application/x-www-form-urlencoded"
        },
        url: url,
        data: {
          commonUserID: app.globalData.openId,
          questionID: that.data.delete,
          level: that.data.currLevel
        },
        success: function (response) {
          prompt.loadingOff();
          that.setData({
            hiddensetting: true,
            delete: '',
          })
          prompt.toast("删除成功")
          setTimeout(function () {
            that.onUnload();
          }, 2000)
          that.onLoad()
          console.log(response);
        },
        fail: function (res) {
          prompt.loadingOff();
          prompt.toast("删除失败")
          setTimeout(function () {
            that.onUnload();
          }, 2000)
          that.setData({
            hiddensetting: true,
            delete: '',
          })
          that.onLoad();
          return;
        }
      })
  },

  Cancel: function () {
    console.log(this.data.hiddensetting);
    this.setData({
      hiddensetting: true,
      delete: '',
    })
  },

  OpenSetting: function (e) {
    this.setData({
      hiddensetting: false,
      delete: e.currentTarget.dataset.index,
    })
    
  },
  
})