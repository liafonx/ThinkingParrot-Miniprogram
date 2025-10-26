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
    iflogin: '',
    urlDomain: 'https://aitutor.uic.edu.cn/tp/',
    // urlDomain: 'http://127.0.0.1:8000/',
    //  urlDomain: 'http://34.92.251.246:8097/',
    /*
    Good afternoon
    Do you want to have some tea
    Do you want to hang out with me?
    Are you uncomfortable?
    Do you get a headache
    You need to sleep for a while
    You need to take care of yourself
    I'm looking forward to
    Are you free this weekend
    Do you want to watch movies
    How about Saturday afternoon
    See you in this Saturday
    bye.  
    */
 
  },
  onLaunch: function () {
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
      // setTimeout(function () {
      //   wx.redirectTo({
      //     url: '/pages/login/login',
      //   })
      // }, 500)
      this.globalData.iflogin = false
      console.log("iflogin", this.globalData.iflogin);
    } else {
      this.globalData.iflogin = true
      console.log("iflogin", this.globalData.iflogin);
      this.globalData.openId = wx.getStorageSync('openid'),
        console.log("wx.getStorageSync('openid')", this.globalData.openId);
    }
  },

  checkDomain: function (params) {
    let that = this
    let a = new Promise((resolve, reject) => {
      console.log("第一个方法，下面示例wx.request")
      wx.request({
        url: that.globalData.urlDomain,
        // url: 'http://127.0.0.1:8000',
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          //这里就相当于return了 因为Promise是new的一个方法 需要返回
          //具体用resolve还是reject 其实都一样的 自己能判断出来执行开始之后要怎么写就可以了
          console.log('操作成功', res);
          reject("success");
        },
        fail: function (err) {
          console.log('操作失败', err);
          reject("fail");
        }
      })
    });
    //a方法结束
    //b方法很简单 设置一个setTimeOut 
    let b = new Promise((resolve, reject) => {
      //reject:返回失败 5000:延迟5秒执行 '页面丢失了，请重新进入':返回的数据
      setTimeout(function(){reject('fail')}, 300, '页面丢失了，请重新进入')
    })
    //b方法结
    //这里调用a,b俩方法 上面的new a和b只是创建了 此处和上面并没有执行 
    //这里可以简写  a,b也可以有c（多个函数同时运行Promise.race([a,b,c])，不管有几个，只执行最快的一个）
    return new Promise((resolve, reject) => {
      Promise.race([a, b]).then(
        console.log('aa'),
        //这里返回resolve就进入success 可以根据返回值判断执行完正常的代码如何继续下一步
        success => {
          //这里可以加一个判断
          //if(success == '操作成功'){...}else if(success == '操作失败'){...}
          console.log(success);
          if (success === 'fail') {
            //that.globalData.urlDomain = "https://thinking-parrot-1801571-1300730606.ap-shanghai.run.tcloudbase.com/"
          }
          resolve(that.globalData.urlDomain)
        },
        //这里返回reject就进入err 可以根据返回值判断执行完正常的代码如何继续下一步
        err => {
          console.log(err);
          reject(err)
        }
      ).catch(err => {
        console.log(err);
      })
    })
    //这里开始执行 .then就是开始执行aa aa为Promise.race([a,b]) 把a和b放一起运行了
    
  }
})
//that.globalData.urlDomain = "https://thinking-parrot-1801571-1300730606.ap-shanghai.run.tcloudbase.com/"