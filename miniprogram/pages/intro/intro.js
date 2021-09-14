const Prompt = require("../../utils/prompt")

Page({
  data: {
  },

  onLoad: function (options) {
    Prompt.loadingOn()
    wx.getSystemInfo({//获取设备屏幕真实高度
      success: (result) => {
        this.setData({
          sysheight:result.windowHeight
        })
      },
    })
    setTimeout(function () {
      Prompt.loadingOff()
    }, 1800)
  },

  onUnload: function () {
  },

  toindex: function (params) {
    wx.reLaunch({
      url: '../index/index'
    })
  }
})