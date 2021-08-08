// pages/speak/speak.js
const recorderManager = wx.getRecorderManager()
var app = getApp();
const base64 = require('../../utils/base64.js')
const Prompt = require("../../utils/prompt");
var prompt = Prompt

Page({
  data: {
    index: 0,
    shuffleIndex: [],
    questionList: [],
    rightListID: [],
    wrongListID: [],
    answer: '',
    collected: false, //是否收藏
    userID: '',
    src: '',
    testId: '',
    currLec: '',
    redirect:'',
  },

  onLoad: function (options) {
    prompt.loadingOn()
    let testId = options.testId;
    let currLec = options.currLec;
    wx.setNavigationBarTitle({
      title: testId
    }) // 动态设置导航条标题
    console.log(testId, currLec);
    this.setData({
      testId: testId, // 课程ID
      currLec: currLec
    })
    //创建内部 audio 上下文 InnerAudioContext 对象。
    this.innerAudioContext = wx.createInnerAudioContext(true);
    this.innerAudioContext.onError(function (res) {
      console.log(res);
      wx.showToast({
        title: '语音播放失败',
        icon: 'none',
        duration: 2000,
        success: function () {
          return;
        }
      })
    })
    this.getQuestion(testId, currLec);

  },

  getQuestion(level, lecture) {
    var that = this;
    wx.request({
      method: 'POST',
      header: {
        "accept": "*/*",
        "content-type": "application/x-www-form-urlencoded"
      },
      url: 'http://34.92.251.246:8091/questionRecord/getNewQuestion/',
      data: {
        commonUserID: app.globalData.openId,
        level: level,
        lecture: lecture
      },
      success: function (response) {
        prompt.loadingOff();
        var questionList = response.data.question;
        console.log(questionList);
        if (!questionList) {
          wx.showToast({
            title: '获取题目失败',
            icon: 'none',
            duration: 2000,
            success: function () {
              return;
            }
          })
          setTimeout(function () {
            that.onUnload();
          }, 2000)
        }else if(response.data.question.length == 0) {
          wx.showToast({
            title: '题目已经答完啦！',
            icon: 'none',
            duration: 2000,
            success: function () {
              return;
            }
          })
          setTimeout(function () {
            that.onUnload();
          }, 2000)
        }
        that.setData({
          questionList: questionList, // 拿到答题数据
          testId: level // 课程ID
        })
        let count = that.generateArray(0, that.data.questionList.length - 1); // 生成题序
        // let num = 10; // 102/301-302 试题有20道题
        that.setData({
          shuffleIndex: that.shuffle(count), // 生成随机题序 [2,0,3] 并截取num道题
        })
        that.data.collected = that.data.questionList[that.data.shuffleIndex[that.data.index]].question.whetherCollect
        console.log(that.data.questionList[that.data.shuffleIndex[that.data.index]].question.subConcept);
        console.log(that.data.shuffleIndex);

        that.startPlay();
        return
      },
      fail: function (res) {
        prompt.loadingOff();
        console.log(res);
        wx.showToast({
          title: '获取题目失败',
          icon: 'none',
          duration: 2000,
          success: function () {
            return;
          }
        })
        // setTimeout(function () {
        //   that.onUnload();
        // }, 2000)
        return
      }
    })
  },

  onUnload: function () {
    wx.reLaunch({
      url: '../learning/learning'
    })
  },

  onReady: function () {

  },

  onUnload: function () {
    wx.reLaunch({
      url: '../learning/learning'
    })
  },

  onShow: function () {
    console.log('test');
    // this.startPlay();
  },

  startPlay: function (e) {
    var that = this;
    var question = this.data.questionList[this.data.shuffleIndex[this.data.index]].question.question
    wx.downloadFile({
      method: 'POST',
      header: {
        "accept": "multipart/form-data",
        "content-type": "application/x-www-form-urlencoded"
      },
      url: 'http://34.92.251.246:8091/questionRecord/textToSpeechEN/?text=' + question + "&name=3",
      // data: {
      //   text: 'Setting data field "questionList" to undefined is invalid.'
      // },
      success(res) {
        console.log('download res:', res);
        if (res.statusCode === 200) {
          var voice = res.tempFilePath;
          console.log('voice:', voice);
          that.data.src = voice; //替换掉playVoice那段 
          that.yuyinPlay();
        } else {
          wx.showToast({
            title: 'something wrong!',
          })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },

  //播放语音
  yuyinPlay: function (e) {
    if (this.data.src == '') {
      wx.showToast({
        title: '语音播放失败',
        icon: 'none',
        duration: 2000,
        success: function () {
          return;
        }
      })
      return;
    }
    this.innerAudioContext.src = this.data.src //设置音频地址
    this.innerAudioContext.play(); //播放音频
  },

  audioText: function (question) {
    var text = question.split('"')
    console.log(text);
    text[0] = "<speak>" + text[0]
    text[1] = "<break time=\"250ms\"/><voice name=\"cmn-CN-Wavenet-A\">" + text[1] + "</voice>"
    text[2] = "</speak>"
    console.log(text[0]);
    text = text.join("")
    console.log(text);
    return text;
  },

  /*
   * 数组乱序/洗牌
   */
  shuffle: function (arr) {
    let i = arr.length;
    while (i) {
      let j = Math.floor(Math.random() * i--);
      [arr[j], arr[i]] = [arr[i], arr[j]];
    }
    return arr;
  },

  Collect: function () {
    var that = this;
    var question = this.data.questionList[this.data.shuffleIndex[this.data.index]]
    console.log(question.question.questionID);
    if (this.data.collected) {
      wx.request({
        method: 'POST',
        header: {
          "accept": "*/*",
          "content-type": "application/x-www-form-urlencoded"
        },
        url: 'http://34.92.251.246:8091/questionRecord/toCancelCollect/',
        data: {
          commonUserID: app.globalData.openId,
          questionID: question.question.questionID,
          level: 'Level1',
        },
        success: function (response) {
          console.log(response);
          wx.showToast({
            title: '取消收藏',
            icon: 'none',
            duration: 2000,
            success: function () {
              return;
            }
          })
          that.setData({
            collected: false,
          })
          // that.setData({
          //   rankingList: response.data.result
          // })
        },
        fail: function (res) {
          wx.showToast({
            title: '取消收藏失败',
            icon: 'none',
            duration: 2000,
            success: function () {
              return;
            }
          })
          console.log(res);
        }
      })

    } else {
      wx.request({
        method: 'POST',
        header: {
          "accept": "*/*",
          "content-type": "application/x-www-form-urlencoded"
        },
        url: 'http://34.92.251.246:8091/questionRecord/toCollect/',
        data: {
          commonUserID: app.globalData.openId,
          questionID: question.question.questionID,
          level: 'Level1',
        },
        success: function (response) {
          console.log(response);
          wx.showToast({
            title: '收藏成功',
            icon: 'none',
            duration: 2000,
            success: function () {
              return;
            }
          })
          that.setData({
            collected: true,
          })
          // that.setData({
          //   rankingList: response.data.result
          // })
        },
        fail: function (res) {
          wx.showToast({
            title: '收藏失败',
            icon: 'none',
            duration: 2000,
            success: function () {
              return;
            }
          })
          console.log(res);
        }
      })
    }

  },

  nextQuestion: function () {
    // wx.navigateTo({
    //   url: '../speak/speak'
    // })
    var that = this;
    var question = this.data.questionList[this.data.shuffleIndex[this.data.index]].question;
    this.data.rightListID.push(question.questionID);
    console.log(this.data.rightListID);
    if (this.data.index < this.data.shuffleIndex.length - 1) {

      // 渲染下一题
      this.setData({
        index: this.data.index + 1,
        isChoosed: false,
        collected: this.data.questionList[this.data.shuffleIndex[this.data.index + 1]].question.whetherCollect,
        width: 100,
        color: '#e6ce9a',
        src: '',
      })
      this.startPlay();
    } else {
      that.confirm()
    }
  },

  confirm: function () {
    var that = this;
    var url = 'http://34.92.251.246:8091/questionRecord/recordAnswer/'
    var score = 100 * 0.2
    wx.request({
      method: 'POST',
      header: {
        "accept": "*/*",
        "content-type": "application/x-www-form-urlencoded"
      },
      url: url,
      data: {
        commonUserID: app.globalData.openId,
        level: that.data.testId,
        wrong: JSON.stringify(that.data.wrongListID),
        right: JSON.stringify(that.data.rightListID),
        score: score
      },
      success: function (response) {
        console.log(response);
        // that.setData({
        //   rankingList: response.data.result
        // })
        if(response.data.state == 'fail'){
          wx.showToast({
            title: '上传答题记录失败',
            icon: 'none',
            duration: 2000,
            success: function () {
              return;
            }
          })
          console.log(res);
        }else{
          wx.showToast({
            title: '积分+20！',
            icon: 'none',
            duration: 1500,
            success: function () {
              return;
            }
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '上传答题记录失败',
          icon: 'none',
          duration: 2000,
          success: function () {
            return;
          }
        })
        console.log(res);
      }
    })

    wx.showModal({
      title: '提示',
      content: '是否再来一轮?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.navigateTo({
            url: '../concept/concept?testId=' + that.data.testId + '&currLec=' + that.data.currLec,
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
          that.onUnload();
        }
      }
    })

  },

  /**
   * 生成一个从 start 到 end 的连续数组
   * @param start
   * @param end
   */
  generateArray: function (start, end) {
    return Array.from(new Array(end + 1).keys()).slice(start)
  }
})