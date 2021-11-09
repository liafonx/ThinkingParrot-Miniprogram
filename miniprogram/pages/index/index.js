const Prompt = require("../../utils/prompt");

// miniprogram/pages/index/index.js
var app = getApp();
var prompt = Prompt

Page({
  /**
   * 页面的初始数据
   */
  data: {
    rank: '打卡',
    ifLoaded: false,
    checked: false,
    firstTime: 0,
    toNext: 0,
    percent: 0,
    score: 0,
    checked: false,
    taskfinished: false,
    wrongfinished: false,
    hiddensetting: true,
    numLearnDone: 0,
    numWrongDone: 0,
    learnNum: 10,
    wrongNum: 10,
    learnSetNum: 0,
    wrongSetNum: 0,
    minusStatusLearn: 'disabled',
    minusStatusWrong: 'disabled',
    flag: true,
  },

  bindMinusLearn: function () {
    var learnSetNum = this.data.learnSetNum;
    // 如果大于1时，才可以减  
    if (learnSetNum > 10) {
      learnSetNum -= 10;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatusLearn = learnSetNum <= 10 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      learnSetNum: learnSetNum,
      minusStatusLearn: minusStatusLearn
    });
  },
  /* 点击加号 */
  bindPlusLearn: function () {
    var learnSetNum = this.data.learnSetNum;
    // 不作过多考虑自增1  
    learnSetNum += 10;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatusLearn = learnSetNum < 10 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      learnSetNum: learnSetNum,
      minusStatusLearn: minusStatusLearn
    });
  },

  bindMinusWrong: function () {
    var wrongSetNum = this.data.wrongSetNum;
    // 如果大于1时，才可以减  
    if (wrongSetNum > 10) {
      wrongSetNum -= 10;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatusWrong = wrongSetNum <= 10 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      wrongSetNum: wrongSetNum,
      minusStatusWrong: minusStatusWrong
    });
  },
  /* 点击加号 */
  bindPlusWrong: function () {
    var wrongSetNum = this.data.wrongSetNum;
    // 不作过多考虑自增1  
    wrongSetNum += 10;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatusWrong = wrongSetNum < 10 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      wrongSetNum: wrongSetNum,
      minusStatusWrong: minusStatusWrong
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.learnNum);
    if(wx.getStorageSync('indexInfo') != ''){
      var info = wx.getStorageSync('indexInfo')
      this.setData({
        checked: true,
        rank: info.rank,
        days: info.days
      })
    }
    this.getSelfRank();
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
    console.log(app.globalData.questionDone);
    console.log("wx.getStorageSync('learnNum')", wx.getStorageSync('learnNum'));
    if(wx.getStorageSync('learnNum') != ''){
      console.log("enter");
      that.setData({
        learnNum: wx.getStorageSync('learnNum')
      })
    }
    if (wx.getStorageSync('wrongNum') != '') {
      that.setData({
        wrongNum: wx.getStorageSync('wrongNum')
      })
    }
    var numLearnDone = app.globalData.questionDone;
    var numWrongDone = app.globalData.wrongDone;
    if (this.data.learnNum <= numLearnDone) {
      this.setData({
        taskfinished: true,
      })
    }
    console.log(app.globalData.questionDone);
    
    if (this.data.wrongNum <= numWrongDone) {
      this.setData({
        wrongfinished: true,
      })
    }
    this.setData({
      numLearnDone: numLearnDone,
      numWrongDone: numWrongDone,
    })

    //签到
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


  onBindTap: function () {
    prompt.loadingOn()
    var that = this;
    var url = 'https://aitutor.uic.edu.cn/questionRecord/signAddScore/';
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
        console.log(response);
        prompt.loadingOff();
        if(response.data.status != 'fail'){
          if (response.data.checked) {
            console.log("ttt");
            prompt.toast('今天已经打过卡啦！')
            that.setData({
              checked: true,
            })
          } else {
            that.setData({
              score: response.data.score,
              rank: response.data.level,
              days: response.data.days,
              bonus:  response.data.bonus,
              checked: true,
            })
            var info = {'rank': response.data.level, 'days': response.data.days}
            wx.setStorageSync('indexInfo', info)
            if (that.data.bonus == 0) {
              prompt.toast('打卡成功！积分+5')
            } else {
              prompt.toast('获得连续签到'+that.data.days / 7 +'周奖励！\r\n积分+'+ parseInt(that.data.bonus), 5000)
            }
          }
          that.onShow();
        }else {
          wx.showToast({
            title: '打卡失败',
            icon: 'none',
            duration: 2000,
            success: function () {
              return;
            }
          })
        }
        
      },
      fail: function (res) {
        prompt.loadingOff()
        wx.showToast({
          title: '打卡失败',
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

  Check: function () {
    console.log(this.data.checked);
    this.setData({
      checked: true,
    })
  },

  Confirm: function () {
    
    var learnNum = this.data.learnSetNum;
    var wrongNum = this.data.wrongSetNum;
    console.log("Confirm", learnNum);
    wx.setStorageSync('learnNum', learnNum);
    wx.setStorageSync('wrongNum', wrongNum);
    if (learnNum > app.globalData.questionDone) {
      this.setData({
        taskfinished: false,
      })
    }else{
      this.setData({
        taskfinished: true,
      })
    }
    if (wrongNum > app.globalData.wrongDone) {
      this.setData({
        wrongfinished: false,
      })
    } else {
      this.setData({
        wrongfinished: true,
      })
    }
    this.setData({
      learnNum: learnNum,
      wrongNum: wrongNum,
      hiddensetting: true,
    })
  },

  Cancel: function () {
    console.log(this.data.hiddensetting);
    this.setData({
      hiddensetting: true,
    })
  },

  OpenSetting: function () {
    var wrongSetNum = this.data.wrongNum;
    var learnSetNum = this.data.learnNum;
    this.setData({
      hiddensetting: false,
      wrongSetNum: wrongSetNum,
      learnSetNum: learnSetNum,
    })
  },

  OpenRank: function(){
    wx.navigateTo({
      url: '../ranking/ranking' 
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
      url: 'https://aitutor.uic.edu.cn/questionRecord/getUserRank/',
      data: {
        commonUserID: openId,
      },
      success: function (response) {
        console.log(response);
        if(response.data.error == 'CommonUser matching query does not exist.') {
          prompt.toast("您未登录，请先登录！")
          wx.navigateTo({
            url: '../login/login',
          })
        }else if(response.data.state == 'fail'){
          prompt.toast("积分获取失败！")
          return;
        }
        that.setData({
            toNext: response.data.toNext,
            score: response.data.score,
            percent: response.data.percent,
            checked: response.data.checked,
            rank: response.data.level,
            days: response.data.days,
        })
        // that.setData({
        //   rankingList: response.data.result
        // })
      },
      fail: function (res) {
      }
    })
  },

  ToIntro: function (params) {
    wx.navigateTo({
      url: '../intro/intro',
    })
  }
})