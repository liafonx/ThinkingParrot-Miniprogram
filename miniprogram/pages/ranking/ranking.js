const Prompt = require("../../utils/prompt");

var app = getApp();
var prompt = Prompt
Page({
  data: {
    rankingList: [],
    selfRanking: {
      userName: "您未登录",
      userImg: "",
      rank: "",
      index: "-",
      score: 0
    },
  },

  onUnload() {
    wx.reLaunch({
      url: '../index/index'
    })
  },

  onLoad() {
    var that = this;
    this.loadingOn()
    wx.setNavigationBarTitle({
      title: '排行榜' //修改title
    });
    var Today = (new Date()).getDate().toString();
    if (Today != wx.getStorageSync('LastDayRank')) {
      wx.setStorageSync('LastDayRank', Today);
      that.getRank()
    }
    if (wx.getStorageSync('rank') != '') {
      that.setData({
        rankingList: wx.getStorageSync('rank')
      })
    }
    if (wx.getStorageSync('userRank') != '') {
      var res = wx.getStorageSync('userRank')
      that.setData({
        selfRanking: {
          userName: res.commonUserName,
          userImg: res.imageURL,
          rank: res.level,
          index: res.rank,
          score: res.score
        },
      })
     
    }
    that.loadingOff()
  },

  getRank:function () {
    var that = this;
    wx.request({
      method: 'POST',
      header: {
        "accept": "*/*",
        "content-type": "application/json"
      },
      url: app.globalData.urlDomain + 'questionRecord/getRank/',
      // url: 'http://127.0.0.1:8000/questionRecord/getRank/',
      // data: {
      //   commonUserID: openId,
      // },
      success: function (response) {
        console.log(response);
        if(response.data.state == 'fail'){
          that.loadingOff()
          wx.showToast({ //弹窗提示
            title: '获取排行榜失败',
            icon: 'none',
            duration: 2000,
            success: function () {
              
            }
          })
          setTimeout(function () {
            that.onUnload()
          }, 2000)
          return;
        }
        console.log(response);
        that.setData({
          rankingList: response.data.result
        })
        wx.setStorageSync('rank', response.data.result)
        that.getSelfRank();
      },
      fail: function (res) {
        that.loadingOff()
        wx.showToast({ //弹窗提示
          title: '获取排行榜失败',
          icon: 'none',
          duration: 2000,
          success: function () {
            return;
          }
        })
        console.log(res);
      }
    })
  },

  getSelfRank: function(){
    var that = this;
    var openId = wx.getStorageSync('openid');
    console.log(openId);
    wx.request({
      method: 'POST',
      header: {
        "accept": "*/*",
        "content-type": "application/x-www-form-urlencoded"
      },
      url: app.globalData.urlDomain + 'questionRecord/getUserRank/',
      data: {
        commonUserID: openId,
      },
      success: function (response) {
        console.log(response);
        if(response.data.state == 'fail'){
          wx.showToast({ //弹窗提示
            title: '获取用户排名失败',
            icon: 'none',
            duration: 2000,
            success: function () {
              
            }
          })
          // setTimeout(function () {
          //   that.onUnload()
          // }, 2000)
          return;
        }
        
        console.log(response);
        if (response.data.rank < 100) {
          var index = response.data.rank
        }else{
          var index = '未上榜'
        }
        that.setData({
          selfRanking: {
            userName: response.data.commonUserName,
            userImg: response.data.imageURL,
            rank: response.data.level,
            index: index,
            score: response.data.score
          },
        })
        wx.setStorageSync('userRank', response.data)
        // that.setData({
        //   rankingList: response.data.result
        // })
        that.loadingOff()
      },
      fail: function (res) {
        that.loadingOff()
        wx.showToast({ //弹窗提示
          title: '获取用户排名失败',
          icon: 'none',
          duration: 2000,
          success: function () {
            return;
          }
        })
        console.log(res);
      }
    })
  },

  loadingOn: function() {
    wx.showLoading({
      title: 'Loading',
    })
  },

  loadingOff: function(){
    wx.hideLoading({
      success: (res) => {},
    })
  },
})