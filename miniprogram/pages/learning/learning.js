const Prompt = require("../../utils/prompt");

var app = getApp();
var prompt = Prompt
Page({
  data: {
    currLevel: '1',
    currLec: "Lecture  1",
    history: {
      // "Level1": {"whetherDone":true},
      // "Level2": {"whetherLock":true},
      // "Level3": {"whetherLock":true},
      // "Level4": {"whetherLock":true},
      // "Level5": {"whetherLock":true},
      // "Level6": {"whetherLock":true}
    },
    request: false,
    slist: [{
        name: "Lecture  1"
      },
      {
        name: "Lecture  2"
      },
    ],
    isstart: false,
    openimg: "/images/list/list.png",
    offimg: "/images/list/list1.png",
    lastPage: '',
    show: 0,
    isTiptrue: true,
    guideIndex:0,
    guiderContent: [],
    intro: {
      "level1": ["Analyze the major trends driving the rise of deep learning, and give examples of where and how it is applied today.", "Level Introduction2", "Level Introduction3"],
      "level2": ["Level2 Introduction1", "Level Introduction2", "Level Introduction3"],
      "level3": ["Level3 Introduction1", "Level Introduction2", "Level Introduction3"],
      "level4": ["Level4 Introduction1", "Level Introduction2", "Level Introduction3"],
      "level5": ["Level5 Introduction1", "Level Introduction2", "Level Introduction3"],
      "level6": ["Level6 Introduction1", "Level Introduction2", "Level Introduction3"],
    }
  },

  onLoad: function (options) {
    var that = this
    this.data.lastPage = options
    console.log(options['exitState']);
    console.log(this.data.currLec);
    let firstOpen = wx.getStorageSync("loadOpen")
    console.log("是否首次打开本页面==",firstOpen)
    if (firstOpen == undefined || firstOpen == '') { //根据缓存周期决定是否显示新手引导
      this.setData({
        guideIndex:1,
      });
      this.setData({
        isTiptrue: true,
        guiderContent: that.data.intro["level"+that.data.guideIndex],
      })

    } else {
      this.setData({
        isTiptrue: false,
      })
    }
  },

  onShow: function () {
    console.log(wx.getStorageSync('answerprompt'));
    if(!this.data.show && wx.getStorageSync('answerprompt') == 1){
      let that = this;
      this.setData({
        show: 1
      })
      wx.setStorageSync('answerprompt', 0)
      setTimeout(function () {
        that.setData({
          show: 0
        })
      }, 2000)
    }
    var that = this
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
    prompt.loadingOn()
    wx.request({
      method: 'POST',
      header: {
        "accept": "*/*",
        "content-type": "application/x-www-form-urlencoded"
      },
      url: 'https://aitutor.uic.edu.cn/questionRecord/GetLectures/',
      success: function (response) {
        console.log(response);
        prompt.loadingOff();
        if (response.data.state != 'fail' && response.data.lectures.length > 0) {
          that.setData({
            slist:response.data.lectures,
          })
          console.log(that.data.slist);
        } else {
          wx.showToast({
            title: '获取单元失败',
            icon: 'none',
            duration: 2000,
            success: function () {
              return;
            }
          })
          return
        }
      },
      fail: function (res) {
        console.log(res);
        prompt.loadingOff();
        wx.showToast({
          title: '获取单元失败',
          icon: 'none',
          duration: 2000,
          success: function () {
            return;
          }
        })
        return
      }
    })
    console.log(this.data.currLec);
    prompt.loadingOn();
    this.updateHistory(this.data.currLevel, this.data.currLec)
  },

  updateHistory: function (level, lecture) {
    var that = this;
    var url = 'https://aitutor.uic.edu.cn/questionRecord/getHistoryNum/';
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
        console.log(response);
        prompt.loadingOff();
        if (response.data.state != 'fail') {
          console.log(response);
          that.setData({
            history: response.data.allDone,
            request: true
          })
          console.log(that.data.history);
        } else {
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
          url: '../concept/concept?testId=' + testId + '&currLec=' + this.data.currLec + "&rederict=learning" //跳转到答题页， 传入试题 //跳转到答题页， 传入试题
        })
        break;
      case '2':
        wx.navigateTo({
          url: '../choice/choice?testId=' + testId + '&currLec=' + this.data.currLec + "&redirect=learning" //跳转到答题页， 传入试题
        })
        break;
      case '3':
        wx.navigateTo({
          url: '../choice/choice?testId=' + testId + '&currLec=' + this.data.currLec + "&redirect=learning" //跳转到答题页， 传入试题
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
    prompt.loadingOn()
    this.updateHistory(this.data.currLevel, this.data.currLec)
  },

  closeThis(e){
    wx.setStorage({
      key: 'loadOpen',
      data: 'OpenTwo'
    })
    this.setData({
      isTiptrue:false
    })
  },

  guider(e){
    var that = this
    console.log("TAP!!");
    this.setData({
      guideIndex: that.data.guideIndex + 1,
    })
    this.setData({
      guiderContent: that.data.intro["level"+that.data.guideIndex]
    })
    console.log(that.data.guideIndex);
  },
})