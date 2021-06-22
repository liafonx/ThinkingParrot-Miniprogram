// pages/speak/speak.js
const recorderManager = wx.getRecorderManager()

Page({
  data: {
    qnum: 1,
    qcontent: "How to say \"人人为己\" ？",
    recordState: false,
    result: false,
    answer: 'Everybody\'s out for himself.',
    done: false,
    collected: false,
    userID: '',
    width: 100, //时间条长度
    maxtime: 20, //答题时间
    color: '#4DCF32', //时间条颜色
  },

  onLoad: function (options) {
    this.initRecord();
    this.countdown();
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
      this.setData({
        collected: true,
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
    wx.uploadFile({
      url: 'http://34.92.251.246:8091/recognize',
      filePath: filePath,
      name: "file",
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        qnum: 1,
        userID: 111
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
    wx.navigateTo({
      url: '../speak/speak'
    })
  }
})