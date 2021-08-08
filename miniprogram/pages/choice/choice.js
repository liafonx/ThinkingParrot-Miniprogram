const Prompt = require("../../utils/prompt");

var app = getApp();
var prompt = Prompt
Page({
  data: {
    questionList: [],
    index: 0, // 题目序列
    chooseValue: [], // 选择的答案序列
    totalScore: 0, // 总分
    wrong: 0, // 错误的题目数量
    wrongListID: [], // 错误的题目集合-乱序
    rightListID: [],
    wrongList: [], // 错误的题目集合-正序
    choosed: '', //选择的答案
    answer: '', //答案
    collected: false, //是否收藏
    isChoosed: false, //是否已答题
    width: 100, //时间条长度
    maxtime: 10, //答题时间
    color: '#46c557', //时间条颜色
    collection: '',
    src: '', //语音路径
    currLec: '',
    testId: '',
    state: '',
    redirect: ''
  },
  onLoad: function (options) {
    var that = this;
    let testId = options.testId;
    let currLec = options.currLec;
    console.log(options.state);
    wx.setNavigationBarTitle({
      title: options.currLec + " " +testId,
      
    }) // 动态设置导航条标题
    this.setData({
      testId: testId,
      currLec: currLec,
      state: options.state,
      redirect: options.redirect
    })
    //创建内部 audio 上下文 InnerAudioContext 对象。
    this.innerAudioContext = wx.createInnerAudioContext(true);
    this.innerAudioContext.onError(function (res) {
      console.log(res);
      wx.showToast({
        title: '语音播放失败',
        icon: 'none',
      })
    })
    this.getQuestion(testId, currLec);
  },

  getQuestion(level, lecture) {
    var that = this
    prompt.loadingOn();
    var that = this;
    var url = 'http://34.92.251.246:8091/questionRecord/getNewQuestion/';
    if (this.data.state) {
      url = 'http://34.92.251.246:8091/questionRecord/getWrongQuestion/'
    }
    console.log(url);
    wx.request({
      method: 'POST',
      header: {
        "accept": "*/*",
        "content-type": "application/x-www-form-urlencoded"
      },
      url: url,
      data: {
        commonUserID: app.globalData.openId,
        level: level,
        lecture: lecture
      },
      success: function (response) {
        console.log(response);
        prompt.loadingOff();
        if (that.data.state) {
          var questionList = response.data.wrongQuestion
          var length = response.data.wrongQuestion.length
        }else{
          var questionList = response.data.question;
          var length = response.data.question.length
        }
        console.log(questionList);
        if (!questionList || length == 0) {
          prompt.toast('获取题目失败');
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
          shuffleIndex: that.shuffle(count) // 生成随机题序 [2,0,3] 并截取num道题
        })
        that.data.collected = that.data.questionList[that.data.shuffleIndex[that.data.index]].question.whetherCollect
        that.countdown()
        console.log(that.data.questionList);
        console.log(that.data.shuffleIndex);
        that.startPlay();
      },
      fail: function (res) {
        console.log(res);
        prompt.loadingOff();
        prompt.toast('获取题目失败');
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

  onShow: function () {},

  startPlay: function (e) {
    var that = this;
    var question = this.data.questionList[this.data.shuffleIndex[this.data.index]].question.question
    if(this.data.testId == "Level2") {
      var name = 1
    }else{
      var name = 2
    }
    wx.downloadFile({
      method: 'POST',
      header: { "accept": "multipart/form-data","content-type": "application/x-www-form-urlencoded" },
      url: 'http://34.92.251.246:8091/questionRecord/textToSpeechEN/?text=' + question + "&name=" + name,
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
                  title: '语音播放失败',
                  icon: none,
              })
          }
      },
      fail: function (res) {
        wx.showToast({
          title: '语音播放失败',
          icon: none
      })
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
        success: function () {
          return;
        }
      })
      console.log("暂无语音");
      return;
    }
    this.innerAudioContext.src = this.data.src //设置音频地址
    this.innerAudioContext.play(); //播放音频
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
  /*
   * 单选事件
   */
  tapOption: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.currentTarget.dataset['optionkey'])
    this.data.chooseValue[this.data.index] = e.currentTarget.dataset['optionkey'];
    console.log(this.data.chooseValue);
    this.setData({
      isChoosed: true,
      answer: this.data.questionList[this.data.shuffleIndex[this.data.index]].question['true'],
      choosed: e.currentTarget.dataset['optionkey']
    })
  },
  /*
   * 多选事件
   */
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.data.chooseValue[this.data.index] = e.detail.value.sort();
    console.log(this.data.chooseValue);
  },
  /*
   * 退出答题 按钮
   */
  outTest: function () {
    wx.showModal({
      title: '提示',
      content: '你真的要退出答题吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.switchTab({
            url: '../learning/learning'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /*
   * 下一题/提交 按钮
   */
  nextSubmit: function () {
    var that = this;
    // 如果没有选择
    if (this.data.chooseValue[this.data.index] == undefined) {
      wx.showToast({ //弹窗提示
        title: '你还没有答题哦！',
        icon: 'none',
        duration: 2000,
        success: function () {
          return;
        }
      })

      return;
    }
    //已做题目+1
    app.globalData.questionDone++;
    console.log(app.globalData.questionDone);

    // 判断答案是否正确
    this.ifRight();

    // 判断是不是最后一题
    if (this.data.index < this.data.shuffleIndex.length - 1) {

      // 渲染下一题
      this.setData({
        index: this.data.index + 1,
        choosed: '',
        answer: '',
        isChoosed: false,
        collected: that.data.questionList[that.data.shuffleIndex[that.data.index+1]].question.whetherCollect,
        totalScore: this.data.totalScore,
        width: 100,
        color: '#46c557',
        src: '', //语音路径
      })
      this.countdown();
      this.startPlay();
    } else {
      console.log(that.data.wrongListID);
      console.log(that.data.rightListID);
      var url = 'http://34.92.251.246:8091/questionRecord/recordAnswer/'
      var score = that.data.totalScore*0.2
      if(that.data.state) {
        var url = "http://34.92.251.246:8091/questionRecord/correctAnswer/"
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
      console.log(((100 / this.data.questionList.length) * this.data.wrongList.length).toFixed(0));
      var score = 100 - ((100 / this.data.questionList.length) * this.data.wrongList.length).toFixed(0)
      console.log("currLec", this.data.currLec);
      wx.navigateTo({
        url: '../result/result?totalScore=' + score  +  '&testId=' + this.data.testId + "&currLec=" + this.data.currLec + '&wrongList=' + encodeURIComponent(wrongList) + "&redirect=" + this.data.redirect
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
    var trueValue = question['true'];
    var chooseVal = this.data.chooseValue[this.data.index];
    console.log(question);
    console.log('选择了' + chooseVal + '答案是' + trueValue);
    if (chooseVal.toString() != trueValue.toString()) {
      console.log('错了');
      var wrongQuestion = {
        "questionText" : question.question,
        "userAnswer": question.options[chooseVal],
        "answer": question.options[trueValue]
      }
      this.data.wrong++;
      this.data.wrongList.push(wrongQuestion);
      this.data.wrongListID.push(question.questionID);
    } else {
      this.setData({
        totalScore: this.data.totalScore + 10 // 加分操作
      })
      this.data.rightListID.push(question.questionID);
    }
    console.log(this.data.wrongList);
    console.log(this.data.totalScore);
  },

  //收藏
  Collect: function () {
    this.loadingOn();
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
          level: that.data.testId,
        },
        success: function (response) {
          that.loadingOff();
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
          that.loadingOff();
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
          level: that.data.testId,
        },
        success: function (response) {
          that.loadingOff();
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
          that.loadingOff();
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
          if (this.data.isChoosed) { //如果已经选择：停止动画
            cancelAnimationFrame(temp);
            return;
          }
          if (schedule <= 0) { //时间到
            cancelAnimationFrame(temp);
            //直接显示正确答案并不允许作答
            _ts.setData({
              width: 0,
              color: '#f73636',
              isChoosed: true,
              answer: this.data.questionList[this.data.shuffleIndex[this.data.index]].question['true']
              // t: 0
            });
            //默认选择F
            this.data.chooseValue[this.data.index] = 'F';
            return;
          } else {
            animate();
          };
        })
      })();
    });
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