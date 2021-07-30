

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
      wx.request({
        method: 'POST',
        header: {
          "accept": "*/*",
          "content-type": "application/json"
        },
        url: 'http://34.92.251.246:8091/questionRecord/getRankWithoutLevel/',
        // data: {
        //   commonUserID: openId,
        // },
        success: function (response) {
          console.log(response);
          if(response.data.state == 'fail'){
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
          that.loadingOff()
          console.log(response);
          that.setData({
            rankingList: response.data.result
          })
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
      url: 'http://34.92.251.246:8091/questionRecord/getUserRank/',
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
          setTimeout(function () {
            that.onUnload()
          }, 2000)
          return;
        }
        that.loadingOff()
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
        // that.setData({
        //   rankingList: response.data.result
        // })
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