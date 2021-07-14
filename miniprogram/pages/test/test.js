// pages/user/user.js
Page({
  data: {
    openid: ''
  },
  // 获取用户openid
  getOpenid: function () {
    let that = this; //获取openid不需要授权
    wx.login({
      success: function (res) { //请求自己后台获取用户openid
        var code = res.code;
        var userinfo = 'hhh';
        var iv = ''
        wx.getUserInfo({
         success: function(res) {
            userinfo = res.encryptedData;
            iv = res.iv;
            wx.request({
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              url: 'http://127.0.0.1:8000/api/recognize/',
              data: {
                appid: 'wxd27ea3eb3d649f0d',
                secret: 'da1e11486e57ebb44c7753180e3285a5',
                code: code,
                userinfo: userinfo,
                iv: iv,
              },
              success: function (response) {
                var openid = response.data.openid;
                console.log('请求获取openid:' + openid); //可以把openid存到本地，方便以后调用
                wx.setStorageSync('openid', openid);
                that.setData({
                  openid: "获取到的openid：" + openid
                })
              },
              fail: function (res) {
                console.log(res);
              }
            })
         },
         fail(e){
           console.log(e);
         }
        })
        console.log(iv);
      }
    })
  },
})