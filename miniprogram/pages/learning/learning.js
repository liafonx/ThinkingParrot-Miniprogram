const Prompt = require("../../utils/prompt");

var app = getApp();
var prompt = Prompt
Page({
  data: {
    currLevel: '1',
    currLec: "Lecture  1",
    history:{
      // "Level1": {"whetherDone":true},
      // "Level2": {"whetherLock":true},
      // "Level3": {"whetherLock":true},
      // "Level4": {"whetherLock":true},
      // "Level5": {"whetherLock":true},
      // "Level6": {"whetherLock":true}
    },
    request: false,
    slist: [{
        id: 1,
        name: "Lecture  1"
      },
      {
        id: 1,
        name: "Lecture  2"
      },
      {
        id: 1,
        name: "Lecture  3"
      },
      {
        id: 1,
        name: "Lecture  4"
      },
      {
        id: 1,
        name: "Lecture  5"
      },
      {
        id: 1,
        name: "Lecture  6"
      },
      {
        id: 1,
        name: "Lecture  7"
      },
      {
        id: 1,
        name: "Lecture  8"
      },
      {
        id: 1,
        name: "Lecture  9"
      },
      {
        id: 1,
        name: "Lecture  10"
      },
      {
        id: 1,
        name: "Lecture  11"
      },
    ],
    isstart: false,
    openimg: "/images/list/list.png",
    offimg: "/images/list/list1.png"
  },

  onLoad: function (options) {
    prompt.loadingOn();
    if (wx.getStorageSync('currLevel')) {
      this.setData({
        currLevel: wx.getStorageSync('currLevel'),
      })
    }
    if (wx.getStorageSync('currLec')) {
      this.setData({
        currLec: wx.getStorageSync('currLec'),
      })
    }
    console.log(this.data.currLec);
  },

  onShow: function () {
    console.log(this.data.currLec);
    this.updateHistory(this.data.currLevel, this.data.currLec)
  },

  updateHistory: function(level, lecture) {
    var that = this;
      var url = 'http://34.92.251.246:8091/questionRecord/getHistoryNum/';
      wx.request({
        method: 'POST',
        header: {
          "accept": "*/*",
          "content-type": "application/x-www-form-urlencoded"
        },
        url: url,
        data: {
          commonUserID: app.globalData.openId,
          lecture: lecture,
        },
        success: function (response) {
          prompt.loadingOff();
          if(response.data.state != 'fail') {
            console.log(response);
          that.setData({
            history: response.data.allDone,
            request: true
          })
          console.log(that.data.history);
          }else{
            var history = {
              "Level1": {
                'whetherLock': true,
              },
              "Level2": {
                'whetherLock': true,
              },
              "Level3": {
                'whetherLock': true,
              },
              "Level4": {
                'whetherLock': true,
              },
              "Level5": {
                'whetherLock': true,
              },
              "Level6": {
                'whetherLock': true,
              }
            }
            that.setData({
              history: history,
              request: false
            })
            wx.showToast({
              title: '获取历史失败',
              icon: 'none',
              duration: 2000,
              success: function () {
                return;
              }
            })
            setTimeout(function () {
              that.onUnload();
            }, 2000)
            return
          }
        },
        fail: function (res) {
          console.log(res);
          prompt.loadingOff();
          wx.showToast({
            title: '获取历史失败',
            icon: 'none',
            duration: 2000,
            success: function () {
              return;
            }
          })
          setTimeout(function () {
            that.onUnload();
          }, 2000)
          return
        }
      })
  },


  toTestPage: function (e) {
    let testId = e.currentTarget.dataset['testid'];
    console.log(testId);
    switch (this.data.currLevel) {
      case '1':
        wx.navigateTo({
          url: '../concept/concept?testId=' + testId + '&currLec=' + this.data.currLec + "&rederict=learning"  //跳转到答题页， 传入试题 //跳转到答题页， 传入试题
        })
        break;
      case '2':
        wx.navigateTo({
          url: '../choice/choice?testId=' + testId + '&currLec=' + this.data.currLec + "&redirect=learning"//跳转到答题页， 传入试题
        })
        break;
      case '3':
        wx.navigateTo({
          url: '../choice/choice?testId=' + testId + '&currLec=' + this.data.currLec + "&redirect=learning"//跳转到答题页， 传入试题
        })
        break;
      case '4':
        wx.navigateTo({
          url: '../speak/speak?testId=' + testId + '&currLec=' + this.data.currLec + "&redirect=learning" //
        })
        break;
      default:
        console.log(this.data.currLevel);
    }
  },

  changeState: function (e) {
    var that = this;
      that.setData({
        currLevel: e.currentTarget.dataset.level
      });
      wx.setStorageSync('currLevel', e.currentTarget.dataset.level)
  },

  opens: function (e) {
    if (this.data.isstart) {
      this.setData({
        isstart: false,
      });
    } else {
      this.setData({
        isstart: true,
      });
    }
  },
  onclicks1: function (e) {
    var index = e.currentTarget.dataset.index;
    let name = this.data.slist[index].name;
    this.setData({
      isstart: false,
      currLec: name,
    })
    wx.setStorageSync('currLec', name)
    console.log(this.data.currLec);
    this.updateHistory(this.data.currLevel, this.data.currLec)
   
  }
})