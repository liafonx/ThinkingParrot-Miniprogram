// miniprogram/pages/login/login.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    wx.hideHomeButton({
      success: (res) => {},
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

  // onUnload: function () {
  //   wx.reLaunch({
  //     url: '../intro/intro'
  //   })
  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    var picture = '';
    var nickName = '';
    wx.getUserProfile({
      desc: '获取你的昵称、头像', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res.userInfo.avatarUrl);
        picture = res.userInfo.avatarUrl
        nickName = res.userInfo.nickName
        // this.setData({
        //   userInfo: res.userInfo,
        //   hasUserInfo: true,
        //   picture: res.userInfo.avatarUrl,
        //   nickName: res.userInfo.nickName
        // })
        wx.setStorageSync('userInfo', res.userInfo)
        wx.showToast({
          title: '获取用户信息成功',
          icon: 'none',
          duration: 2000,
          success: function () {
            return;
          }
        })
        this.Login(picture,nickName);
        
      },
      fail:function(err){
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none',
          duration: 2000,
          success: function () {
            return;
          }
        })
     }
    });
    
  },
  Login: function(picture, nickName){
    var that = this
    wx.login({
      success: function (res) { //请求自己后台获取用户openid
        var code = res.code;
        console.log('code: ',code);
        var userinfo = 'hhh';
        var iv = ''
        wx.getUserInfo({
         success: function(res) {
            userinfo = res.encryptedData;
            iv = res.iv;
            console.log('code: ',code, '\niv: ',iv, '\ninfo: ',userinfo);
            console.log(picture);
            wx.request({
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              url: 'https://aitutor.uic.edu.cn/questionRecord/userinfo',
              data: {
                appid: 'wxd27ea3eb3d649f0d',
                secret: 'da1e11486e57ebb44c7753180e3285a5',
                code: code,
                userinfo: userinfo,
                iv: iv,
                name: nickName,
                photo: picture,
              },
              success: function (response) {
                if(response.data.state == 'fail'){
                  wx.showToast({ //弹窗提示
                    title: '登录失败，请重试',
                    icon: 'none',
                    duration: 2000,
                    success: function () {
                      
                    }
                  })
                  return;
                }
                console.log(response);
                var openid = response.data.OpenID;
                console.log('请求获取openid:' + openid); //可以把openid存到本地，方便以后调用
                wx.setStorageSync('openid', openid);
                app.globalData.openId = openid;
                // that.setData({
                //   openid: "获取到的openid：" + openid
                // })
                // that.onUnload()
                wx.reLaunch({
                  url: '../intro/intro'
                })
              },
              fail: function (res) {
                console.log(res);
              }
            })
         },
         fail(e){
           console.log(e);
           wx.showToast({ //弹窗提示
            title: '登录失败，请重试',
            icon: 'none',
            duration: 2000,
            success: function () {
              
            }
          })
          return;
         }
        })
        console.log(iv);
      }
    })
  }
})

