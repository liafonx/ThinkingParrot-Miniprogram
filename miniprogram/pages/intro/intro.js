const Prompt = require("../../utils/prompt")

Page({
  data: {
  },

  onLoad: function (options) {
    wx.getSystemInfo({//获取设备屏幕真实高度
      success: (result) => {
        this.setData({
          sysheight:result.windowHeight
        })
      },
    })
  },

  onUnload: function () {
  },

  toindex: function (params) {
    wx.reLaunch({
      url: '../index/index'
    })
  }
})