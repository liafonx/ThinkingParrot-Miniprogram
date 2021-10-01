// pages/speak/speak.js
const recorderManager = wx.getRecorderManager()
var app = getApp();
const base64 = require('../../utils/base64.js')


Page({
  data: {
    index: 0,
    shuffleIndex: [],
    questionList:[],
    recordState: false, //录音状态
    result: false, //识别结果
    answer: '',
    done: false, //是否成功上传并返回结果
    totalScore: 0, // 总分
    wrong: 0, // 错误的题目数量
    wrongList: [], // 错误的题目集合-乱序
    wrongListID: [], // 错误的题目集合-乱序
    rightListID: [], // 错误的题目集合-正序
    collected: false, //是否收藏
    userID: '',
    width: 100, //时间条长度
    maxtime: 20, //答题时间
    color: '#46c557', //时间条颜色
    src: '',
    testId: '',
    currLec: '',
    redirect: ''
  },

  onLoad: function (options) {
    let testId = options.testId;
    let currLec = options.currLec;
    wx.setNavigationBarTitle({
      title: testId
    }) // 动态设置导航条标题
    console.log(testId, currLec);
    this.setData({
      questionList: app.globalData.oralList[testId], // 拿到答题数据
      testId: testId, // 课程ID
      currLec: currLec,
      redirect: options.redirect
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
      url: 'https://aitutor.uic.edu.cn/questionRecord/getNewQuestion/',
      data: {
        commonUserID: app.globalData.openId,
        level: level,
        lecture: lecture
      },
      success: function (response) {

        var questionList = response.data.question;
        console.log(questionList);
        if (response.data.question　== undefined || !questionList || response.data.question.length == 0) {
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
          return
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
        
        that.countdown();
        that.initRecord();
        console.log(that.data.questionList);
        console.log(that.data.shuffleIndex);

        that.startPlay();
        return
      },
      fail: function (res) {
        console.log(res);
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
        return
      }
    })
  },

  onUnload: function () {
    var page = this.data.redirect
    wx.reLaunch({
      url: '../'+page+'/'+page
    })
  },

  onReady: function () {
    
  },

  onShow: function () {
    // this.startPlay();
  },

  startPlay: function (e) {
    var that = this;
    var question = this.data.questionList[this.data.shuffleIndex[this.data.index]].question.question
    console.log(that.data.questionList[that.data.shuffleIndex[that.data.index]].example);
    wx.downloadFile({
      method: 'POST',
      header: { "accept": "multipart/form-data","content-type": "application/x-www-form-urlencoded" },
      url: 'https://aitutor.uic.edu.cn/questionRecord/textToSpeechEN_CN/?text=' + that.audioText(question),
      // data: {
      //   text: 'Setting data field "questionList" to undefined is invalid.'
      // },
      success(res){
          console.log('download res:', res);
          if (res.statusCode === 200) {
                  var voice = res.tempFilePath;
                  console.log('voice:', voice);
                  that.data.src = voice;   //替换掉playVoice那段 
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

  audioText: function(question) {
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
        url: 'https://aitutor.uic.edu.cn/questionRecord/toCancelCollect/',
        data: {
          commonUserID: app.globalData.openId,
          questionID: question.question.questionID,
          level: 'Level4',
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
        url: 'https://aitutor.uic.edu.cn/questionRecord/toCollect/',
        data: {
          commonUserID: app.globalData.openId,
          questionID: question.question.questionID,
          level: 'Level4',
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

  initRecord() {
    let that = this;
    recorderManager.onError((res) => {
      console.log("error", res)
    })
    recorderManager.onStart(() => {
      console.log('recorder start')
    })
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      that.upload(res.tempFilePath)
      // that.setData({
      //   result: "The answer is: Everybody's out for himself."
      // })
    })
  },

  upload(filePath) {
    let that = this
    var question = this.data.questionList[this.data.shuffleIndex[this.data.index]]
    console.log(question.question.questionID);
    console.log(app.globalData.openId);
    wx.uploadFile({
      // url: 'https://aitutor.uic.edu.cn/questionRecord/judgeAnswer',
      url: 'http://34.92.251.246:8091/questionRecord/judgeAnswer/',
      filePath: filePath,
      name: "file",
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        commonUserID: app.globalData.openId,
        questionID: question.question.questionID,
        level: 'Level4',
      },
      success: function (res) {
        console.log(res);
        if (res.data.substring(0,1) != '<') {
          if(JSON.parse(res.data).state == "success") {
            that.setData({
              result: JSON.parse(res.data).result,
              done: true,
            })
            console.log(JSON.parse(res.data).result);
          }else{
            that.setData({
              done: false
            });
            wx.showToast({ //弹窗提示
              title: '答题失败，请重试！',
              icon: 'none',
              duration: 2000,
              success: function () {
                return;
              }
            })
          }
        } else {
          that.setData({
            done: false
          });
          wx.showToast({ //弹窗提示
            title: '答题失败，请重试！',
            icon: 'none',
            duration: 2000,
            success: function () {
              return;
            }
          })
        }
      },
      fail: function (res) {
        console.log(res);
        that.setData({
          done: false
        });
        wx.showToast({ //弹窗提示
          title: '答题失败，请重试！',
          icon: 'none',
          duration: 2000,
          success: function () {
            return;
          }
        })
      }
    })
  },

  // start recording
  start() {
    wx.showLoading({
      title: 'Recording',
    })
    this.setData({
      recordState: true
    })
    const options = {
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
      frameSize: 50
    }
    recorderManager.start(options)
  },

  // end recording
  end() {
    wx.hideLoading({
        success: (res) => {},
      }),
      this.setData({
        recordState: false
      })
    recorderManager.stop()
  },

  /**
   * 时间条动画
   */
  getSystemInfo: function () {
    return new Promise((a, b) => {
      wx.getSystemInfo({
        success: function (res) {
          a(res)
        },
        fail: function (res) {
          b(res)
        }
      })
    })
  },

  countdown: function () {
    const requestAnimationFrame = callback => {
        return setTimeout(callback, 1000 / 60);
      },
      cancelAnimationFrame = id => {
        clearTimeout(id);
      };

    this.getSystemInfo().then(v => {
      let maxtime = this.data.maxtime,
        width = this.data.width,
        sTime = +new Date,
        _ts = this,
        temp,
        animate;
      (animate = () => {
        temp = requestAnimationFrame(() => {
          let time = maxtime * 1000,
            currentTime = +new Date,
            schedule = 1 - (currentTime - sTime) / time,
            schedule_1 = schedule <= 0 ? 0 : schedule,
            width = parseInt(schedule_1 * 100);
          var color = this.data.color;
          //根据时间改变进度条颜色
          switch (width) {
            case 60:
              color = '#E9C66C';
              break;
            case 20:
              color = '#E76E51';
            default:
              break;
          }
          // t = parseInt((this.data.maxtime) * schedule_1) + 1;
          _ts.setData({
            width: width,
            color: color,
            // t: t
          });
          if (this.data.done) { //如果已经选择：停止动画
            cancelAnimationFrame(temp);
            return;
          }
          if (schedule <= 0) { //时间到
            cancelAnimationFrame(temp);
            //直接显示正确答案并不允许作答
            _ts.setData({
              width: 0,
              color: '#f73636',
              done: true,
              result: false,
            });
            _ts.end()
            return;
          } else {
            animate();
          };
        })
      })();
    });
  },

  nextQuestion: function () {
    // wx.navigateTo({
    //   url: '../speak/speak'
    // })
    // 判断是不是最后一题
    this.ifRight();
    var that = this;
    if (this.data.index < this.data.shuffleIndex.length - 1) {

      // 渲染下一题
      this.setData({
        index: this.data.index + 1,
        isChoosed: false,
        collected: this.data.questionList[this.data.shuffleIndex[this.data.index+1]].question.whetherCollect,
        totalScore: this.data.totalScore,
        width: 100,
        color: '#4DCF32',
        recordState: false, //录音状态
        result: false, //识别结果
        done: false, //是否成功上传并返回结果
        src: '',
      })
      this.countdown();
      this.startPlay();
    } else {
      var url = 'https://aitutor.uic.edu.cn/questionRecord/recordAnswer/'
      var score = that.data.totalScore*0.2
      if(that.data.state) {
        var url = "https://aitutor.uic.edu.cn/questionRecord/correctAnswer/"
        var score = that.data.totalScore*0.1
      }
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
          that.loadingOff();
          console.log(response);
          // that.setData({
          //   rankingList: response.data.result
          // })
        },
        fail: function (res) {
          that.loadingOff();
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
      let wrongList = JSON.stringify(this.data.wrongList);
      wx.setStorageSync('questionDone', app.globalData.questionDone)
      wx.setStorageSync('wrongDone', app.globalData.wrongDone)
      // let chooseValue = JSON.stringify(this.data.chooseValue);
      wx.navigateTo({
        url: '../result/result?totalScore=' + this.data.totalScore  +  '&testId=' + this.data.testId + "&currLec=" + this.data.currLec + '&wrongList=' + encodeURIComponent(wrongList) + '&redirect=' + this.data.redirect + "&speak=ture"
      })

      // 设置缓存
      var logs = wx.getStorageSync('logs') || []
      let logsList = {
        "date": Date.now(),
        "testId": this.data.testId,
        "score": this.data.totalScore
      }
      logs.unshift(logsList);
      wx.setStorageSync('logs', logs);
    }
  },

  /*
   * 判断对错
   */
  ifRight: function () {
    var question = this.data.questionList[this.data.shuffleIndex[this.data.index]].question;
    if (!this.data.result) {
      console.log('错了');
      var wrongQuestion = {
        "questionText" : question.question,
        "answer": this.data.questionList[this.data.shuffleIndex[this.data.index]].example
      }
      this.data.wrong++;
      this.data.wrongList.push(wrongQuestion);
      this.data.wrongListID.push(question.questionID);
      console.log(this.data.wrongList);
      console.log(this.data.wrongListID);
    } else {
      this.setData({
        totalScore: this.data.totalScore + 10 // 加分操作
      })
      this.data.rightListID.push(question.questionID);
    }
    console.log(this.data.totalScore);
  },

  /**
   * 生成一个从 start 到 end 的连续数组
   * @param start
   * @param end
   */
  generateArray: function (start, end) {
    return Array.from(new Array(end + 1).keys()).slice(start)
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