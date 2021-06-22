var app = getApp();
Page({
  data: {
    index: 0, // 题目序列
    chooseValue: [], // 选择的答案序列
    totalScore: 0, // 总分
    wrong: 0, // 错误的题目数量
    wrongList: [], // 错误的题目集合-乱序
    wrongListSort: [], // 错误的题目集合-正序
    choosed: '',
    answer: '',
    isChoosed: false,
    widtLeft: 100,
    widthRight:10,
    widthRightBack: 90,
    maxtime: 10,
  },
  onLoad: function (options) {
    console.log(options);
    // wx.reLaunch({
    //   url: '../learning/learning'
    // })
    wx.setNavigationBarTitle({
      title: options.testId
    }) // 动态设置导航条标题

    this.setData({
      questionList: app.globalData.questionList[options.testId], // 拿到答题数据
      testId: options.testId // 课程ID
    })
    console.log(this.data.questionList);

    let count = this.generateArray(0, this.data.questionList.length - 1); // 生成题序
    let num = options.testId == '102' || options.testId == '301-302' ? 20 : 10; // 102/301-302 试题有20道题
    this.setData({
      shuffleIndex: this.shuffle(count).slice(0, num) // 生成随机题序 [2,0,3] 并截取num道题
    })
    this.countdownLeft()
    this.countdownRight()
  },

  onShow: function () {
    this.countdown;
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
      answer: this.data.questionList[this.data.shuffleIndex[this.data.index]]['true'],
      isChoosed: true,
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
            url: '../index/index'
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
    // 如果没有选择
    if (this.data.chooseValue[this.data.index] == undefined || this.data.chooseValue[this.data.index].length == 0) {
      wx.showToast({
        title: '你还没有答题哦！',
        icon: 'none',
        duration: 2000,
        success: function () {
          return;
        }
      })

      return;
    }

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
        collected: false,
        totalScore: this.data.totalScore,
      })
    } else {
      let wrongList = JSON.stringify(this.data.wrongList);
      let wrongListSort = JSON.stringify(this.data.wrongListSort);
      let chooseValue = JSON.stringify(this.data.chooseValue);
      wx.navigateTo({
        url: '../result/result?totalScore=' + this.data.totalScore + '&wrongList=' + wrongList + '&chooseValue=' + chooseValue + '&wrongListSort=' + wrongListSort + '&testId=' + this.data.testId
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
      wx.setStorageSync('wronglist', wrongList);
    }
  },
  /*
   * 错题处理
   */
  ifRight: function () {
    var trueValue = this.data.questionList[this.data.shuffleIndex[this.data.index]]['true'];
    var chooseVal = this.data.chooseValue[this.data.index];
    console.log('选择了' + chooseVal + '答案是' + trueValue);
    if (chooseVal.toString() != trueValue.toString()) {
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
  /**
   * 进度条动画
   */
  countdownLeft: function () {
    const requestAnimationFrame = callback => {
        return setTimeout(callback, 1000 / 60);
      },
      cancelAnimationFrame = id => {
        clearTimeout(id);
      };

    this.getSystemInfo().then(v => {
      let maxtime = this.data.maxtime,
        width = this.data.widthRight,
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
            // t = parseInt((this.data.maxtime) * schedule_1) + 1;
          _ts.setData({
            widthRight: width,
            // t: t
          });
          if (schedule <= 0) {
            cancelAnimationFrame(temp);
            _ts.setData({
              widthRight: width,
              // t: 0
            });
            return;
          } else {
            animate();
          };
        })
      })();

    });
  },

  countdownRight: function () {
    const requestAnimationFrame = callback => {
        return setTimeout(callback, 1000 / 60);
      },
      cancelAnimationFrame = id => {
        clearTimeout(id);
      };

    this.getSystemInfo().then(v => {
      let maxtime = this.data.maxtime,
        width = this.data.widthRight,
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
            // t = parseInt((this.data.maxtime) * schedule_1) + 1;
          _ts.setData({
            widthRight: width,
            // t: t
          });
          if (schedule <= 0) {
            cancelAnimationFrame(temp);
            _ts.setData({
              widthRight: width,
              // t: 0
            });
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