//app.js
var jsonList = require('data/json.js');
var oralList = require('data/oral.js');

App({
  globalData: {
    questionList: jsonList.questionList,
    oralList: oralList.oralList,
    questionDone: 0,
    wrongDone: 0,
    openId: '',
  },
  onLaunch: function () {
    let that = this; //获取openid不需要授权
    var Today = (new Date()).getDate().toString();
    // wx.setStorageSync('answerprompt', 0)
    // wx.setStorageSync('wrongprompt', 0)
    console.log(Today);
    console.log(wx.getStorageSync('LastDay'));
    if (Today != wx.getStorageSync('LastDay')) {
      wx.setStorageSync('LastDay', Today);
      wx.setStorageSync('questionDone', 0)
      wx.setStorageSync('indexInfo', '')
      wx.setStorageSync('wrongDone', 0)
      wx.setStorageSync('answerprompt', 1)
      wx.setStorageSync('wrongprompt', 1)
    }
    if (wx.getStorageSync('questionDone') != '') {
      this.globalData.questionDone = wx.getStorageSync('questionDone')
      
    }
    if (wx.getStorageSync('wrongDone') != '') {
      this.globalData.wrongDone = wx.getStorageSync('wrongDone')
    }
    console.log("questionDone", this.globalData.questionDone);
    console.log("wrongDone", this.globalData.wrongDone);
    if (!wx.getStorageSync('openid')) {
      //延迟执行，可能小程序页面未注册完，导致无法跳转
      setTimeout(function () {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }, 500)
    } else {
      this.globalData.openId = wx.getStorageSync('openid'),
        console.log("wx.getStorageSync('openid')", this.globalData.openId);
    }
  },
})