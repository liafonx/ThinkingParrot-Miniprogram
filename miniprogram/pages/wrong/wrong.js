// pages/learning.js
const Prompt = require("../../utils/prompt");
var prompt = Prompt
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
   * 
   */
  onLoad: function (options) {
    this.data.lastPage = options
    console.log(options['exitState']);
    console.log(this.data.currLec);
  },

  getData: function () {
    var that = this;
    var url = 'https://aitutor.uic.edu.cn/questionRecord/getWrongNum/';
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
        prompt.loadingOff();
        console.log(response);
        that.setData({
          wronglistnumber: response.data.wrongQuestionNum,
          worongtotalnumber: response.data.wrongQuestionNum['total']
        })
      },
      fail: function (res) {
        console.log(res);
        prompt.loadingOff();
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
    var that = this;
    if(this.data.currLec != undefined && JSON.stringify(this.data.currLec) != '{}') {
      console.log("enterIf", this.data.currLec);
      if(this.data.currLec['exitState'] == 'unfinshed'){
        console.log("enter");
        Prompt.toast("未完成所有题目，已答题目将不被记录！")
        setTimeout(function () {
          prompt.loadingOn();
          that.getData()
        }, 2000)
      }
    }else{
      console.log("else");
      Prompt.loadingOn();
      this.getData()
    }
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
          url: '../choice/choice?testId=Level' + testId + "&state=wrong" + "&currLec=改错"+ "&redirect=wrong" //跳转到答题页， 传入试题
        })
        break;
      case '3':
        wx.navigateTo({
          url: '../choice/choice?testId=Level' + testId + "&state=wrong" + "&currLec=改错"+ "&redirect=wrong" //跳转到答题页， 传入试题
        })
        break;
      case '4':
        wx.navigateTo({
          url: '../speak/speak?testId=Level' + testId + "&state=wrong" + "&currLec=改错"+ "&redirect=wrong" //
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
  },

  switchLevel: function (e) {
    for(var i = 2; i <= 4; i++){
      console.log('Level'+i.toString());
      if(this.data.wronglistnumber['Level'+i.toString()]['wrongNum'] != 0) {
          break;
      }
    }
    
    e.currentTarget.dataset['testid'] = i.toString();
    console.log(e.currentTarget.dataset['testid']);
    this.toTestPage(e);
  }
})