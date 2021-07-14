// pages/speak/speak.js
const recorderManager = wx.getRecorderManager()
var app = getApp();
//引入插件：微信同声传译
const plugin = requirePlugin('WechatSI');
Page({
  data: {
    index: 0,
    // qcontent: "How to say \"人人为己\" ？",
    recordState: false,//录音状态
    result: false,//识别结果
    // answer: 'Everybody\'s out for himself.',
    done: false,//是否成功上传并返回结果
    totalScore: 0, // 总分
    wrong: 0, // 错误的题目数量
    wrongList: [], // 错误的题目集合-乱序
    wrongListSort: [], // 错误的题目集合-正序
    collected: false,//是否收藏
    userID: '',
    width: 100, //时间条长度
    maxtime: 10, //答题时间
    color: '#4DCF32', //时间条颜色
    collection:'',//收藏夹数组
    src:'',
  },

  onLoad: function (options) {
    let testId = options.testId;
    
    wx.setNavigationBarTitle({
      title: testId
    }) // 动态设置导航条标题

    let questionList = app.globalData.oralList[testId];
    console.log(questionList);
    let array = [];
    let wronglist = JSON.parse(wx.getStorageSync('wrongorallist'));
    wronglist.sort;
    console.log(wronglist);
    for (let index = 0; index < wronglist.length; index++) {
     console.log(wronglist[index]); 
      
    }
    for (let index = 0; index < questionList.length; index++) {
     for (let f = 0; f < wronglist.length; f++) {
       if (wronglist[f] == index){
        console.log(wronglist[f]);
         console.log(index);
         array.push(questionList[index]);
         break;
       }
     }
    }

    this.setData({
      questionList: array, // 拿到答题数据
      testId: testId // 课程ID
    })

    console.log(this.data.questionList);

    let count = this.generateArray(0, this.data.questionList.length - 1); // 生成题序
    let num = (testId == '102' || testId == '301-302') ? 20 : 5; // 102/301-302 试题有20道题
    this.setData({
      shuffleIndex: this.shuffle(count).slice(0, num) // 生成随机题序 [2,0,3] 并截取num道题
    })
    this.countdown()
    if(wx.getStorageSync('collection')){
      var collection = JSON.parse(wx.getStorageSync('collection'));
    }else{
      // var collection = collectList;
    }
    this.setData({
      collection: collection,
    })
    console.log(collection);
    console.log(this.data.shuffleIndex);
    this.initRecord();
    this.countdown();
  },

  onReady: function () {
    //创建内部 audio 上下文 InnerAudioContext 对象。
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onError(function (res) {
      console.log(res);
      wx.showToast({
        title: '语音播放失败',
        icon: 'none',
      })
    })
  },

  onShow: function () {
    this.startPlay();
  },

  startPlay: function (e) {
    var that = this;
    plugin.textToSpeech({
      lang: "zh_CN",
      tts: true,
      content: this.data.questionList[this.data.shuffleIndex[this.data.index]].question ,
      success: function (res) {
        console.log(res);
        console.log("succ tts", res.filename);
        that.setData({
          src: res.filename
        })
        // 播报语音
        that.yuyinPlay();
      },
      fail: function (res) {
        console.log("fail tts", res)
      }
    });
  },

  //播放语音
  yuyinPlay: function (e) {
    if (this.data.src == '') {
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

  Collect: function () {
    console.log(this.data.collected);
    if (this.data.collected) {
      wx.showToast({
        title: '取消收藏',
        icon: 'none',
        duration: 2000,
        success: function () {
          return;
        }
      })
      this.data.collection[this.data.testId].pop();
      console.log(this.data.collection[this.data.testId]);
      this.setData({
        collected: false,
      })
      
    } else {
      wx.showToast({
        title: '收藏成功',
        icon: 'none',
        duration: 2000,
        success: function () {
          return;
        }
      })
      this.data.collection[this.data.testId].push({
        unit: this.data.testId,
        index: this.data.shuffleIndex[this.data.index],
        question: this.data.questionList[this.data.shuffleIndex[this.data.index]].question,
        answer: this.data.questionList[this.data.shuffleIndex[this.data.index]].key,
      }),
      this.setData({
        collected: true,
      })
      console.log(this.data.collection[this.data.testId]);
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
    wx.uploadFile({
      url: 'http://34.92.251.246:8091/recognize',
      filePath: filePath,
      name: "file",
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        answer: this.data.questionList[this.data.shuffleIndex[this.data.index]].key,
        // userID: 111
      },
      success: function (res) {
        console.log(res)
        var value = JSON.parse(res.data)
        if (value["state"] == "success") {
          that.setData({
            result: value["result"],
            done: true,
          })
          console.log(value["result"]);
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
              color = '#E8CE67';
              break;
            case 20:
              color = '#ff881f';
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

    if (this.data.index < this.data.shuffleIndex.length - 1) {
      
      // 渲染下一题
      this.setData({
        index: this.data.index + 1,
        isChoosed: false,
        collected: false,
        totalScore: this.data.totalScore,
        width: 100,
        color: '#4DCF32',
        recordState: false,//录音状态
        result: false,//识别结果
        done: false,//是否成功上传并返回结果
        src:'',
      })
      this.countdown();
      this.startPlay();
    } else {
      let wrongList = JSON.stringify(this.data.wrongList);
      let wrongListSort = JSON.stringify(this.data.wrongListSort);
      // let chooseValue = JSON.stringify(this.data.chooseValue);
      wx.navigateTo({
        url: '../result/result?totalScore=' + this.data.totalScore + '&wrongList=' + wrongList + '&wrongListSort=' + wrongListSort + '&testId=' + this.data.testId+ '&redirect=' + 'learning'
      })

      // 设置缓存
      var logs = wx.getStorageSync('logs') || []
      let logsList = { "date": Date.now(), "testId": this.data.testId, "score": this.data.totalScore }
      logs.unshift(logsList);
      wx.setStorageSync('logs', logs);
      let collectionList = JSON.stringify(this.data.collection);
      wx.setStorageSync('collection', collectionList);
      wx.setStorageSync('wrongorallist', wrongList);
    }
  },

  /*
   * 判断对错
   */
  ifRight: function () {
    if (!this.data.result) {
      console.log('错了');
      this.data.wrong++;
      this.data.wrongListSort.push(this.data.index);
      this.data.wrongList.push(this.data.shuffleIndex[this.data.index]);
    } else {
      this.setData({
        totalScore: this.data.totalScore + this.data.questionList[this.data.shuffleIndex[this.data.index]]['scores'] // 扣分操作
      })
    }
    console.log(this.data.wrongListSort);
    console.log(this.data.totalScore);
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