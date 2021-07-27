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
    if (!wx.getStorageSync('openid')) {
      //延迟执行，可能小程序页面未注册完，导致无法跳转
      setTimeout(function () {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }, 500)
    } else {
      this.globalData.openId = wx.getStorageSync('openid'),
      console.log(wx.getStorageSync('openid'));
    }
  },
})