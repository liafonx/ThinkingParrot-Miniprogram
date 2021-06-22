var app = getApp();
Page({
  data: {
    index: 0,  // 题目序列
    chooseValue: [], // 选择的答案序列
    totalScore: 0, // 总分
    wrong: 0, // 错误的题目数量
    wrongList: [], // 错误的题目集合-乱序
    wrongListSort: [], // 错误的题目集合-正序
    choosed: '',
    answer:'',
    collected: false, //是否收藏
    isChoosed: false, //是否已答题
    width: 100, //时间条长度
    maxtime: 10, //答题时间
    color: '#4DCF32', //时间条颜色
  },
  onLoad: function (options) {
    console.log(options);
    // wx.reLaunch({
    //   url: '../learning/learning'
    // })
    wx.setNavigationBarTitle({ title: options.testId }) // 动态设置导航条标题
    
    let questionList = app.globalData.questionList[options.testId];
    console.log(questionList);
    let array = [];
    let wronglist = JSON.parse(wx.getStorageSync('wronglist'));
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
    console.log(array);
    this.setData({
      questionList: array,  // 拿到答题数据
      testId: options.testId // 课程ID
    })
    let count = this.generateArray(0, array.length-1); // 生成题序
    
    this.setData({
      shuffleIndex: this.shuffle(count)// 生成随机题序 并截取count道题
    })
    console.log(this.data.shuffleIndex);
    this.countdown()
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
  tapOption: function(e){
    console.log('checkbox发生change事件，携带value值为：', e.currentTarget.dataset['optionkey'])
    this.data.chooseValue[this.data.index] = e.currentTarget.dataset['optionkey'];
    console.log(this.data.chooseValue);
    this.setData( {
      isChoosed: true,
      answer: this.data.questionList[this.data.shuffleIndex[this.data.index]]['true'],
      isChoosed: true,
      choosed: e.currentTarget.dataset['optionkey']
    })
  },
  /*
  * 多选事件
  */
  checkboxChange:function(e){
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.data.chooseValue[this.data.index] = e.detail.value.sort();
    console.log(this.data.chooseValue);
  },
  /*
  * 退出答题 按钮
  */
  outTest: function(){
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
  nextSubmit: function(){
    // 如果没有选择
    if (this.data.chooseValue[this.data.index] == undefined || this.data.chooseValue[this.data.index].length == 0) {  
      wx.showToast({
        title: '你还没有答题哦！',
        icon: 'none',
        duration: 2000,
        success: function(){
          return;
        }
      })
      
      return;
    }

    // 判断答案是否正确
    this.ifRight();

    // 判断是不是最后一题
    if (this.data.index < this.data.shuffleIndex.length - 1) {
      
      // 渲染下一题
      this.setData({
        index: this.data.index + 1,
        choosed: '',
        answer:'',
        isChoosed: false,
        collected: false,
        totalScore: this.data.totalScore,
        width: 100,
        color: '#4DCF32',
      })
      this.countdown();
    } else {
      let wrongList = JSON.stringify(this.data.wrongList);
      let wrongListSort = JSON.stringify(this.data.wrongListSort);
      let chooseValue = JSON.stringify(this.data.chooseValue);
      wx.navigateTo({
        url: '../result/result?totalScore=' + this.data.totalScore + '&wrongList=' + wrongList + '&chooseValue=' + chooseValue + '&wrongListSort=' + wrongListSort + '&testId=' + this.data.testId+ '&redirect=' + 'wrong'
      })

      // 设置缓存
      var logs = wx.getStorageSync('logs') || []
      let logsList = { "date": Date.now(), "testId": this.data.testId, "score": this.data.totalScore }
      logs.unshift(logsList);
      wx.setStorageSync('logs', logs);
      wx.setStorageSync('wronglist', wrongList);
    }
  },
  /*
  * 错题处理
  */
  ifRight: function(){
    var trueValue = this.data.questionList[this.data.shuffleIndex[this.data.index]]['true'];
    var chooseVal = this.data.chooseValue[this.data.index];
    console.log('选择了' + chooseVal + '答案是' + trueValue);
    if (chooseVal.toString() != trueValue.toString()) {
      console.log('错了');
      this.data.wrong++;
      this.data.wrongListSort.push(this.data.index);
      this.data.wrongList.push(this.data.shuffleIndex[this.data.index]);
    }else {
      this.setData({
        totalScore: this.data.totalScore + this.data.questionList[this.data.shuffleIndex[this.data.index]]['scores'] - 2  // 扣分操作
      })
      app.globalData.wrongDone++;
      console.log(app.globalData.questionDone);
    }
    console.log(this.data.wrongListSort);
    console.log(this.data.totalScore);
  },

  Collect: function() {
    console.log(this.data.collected);
    if(this.data.collected) {
      wx.showToast({
        title: '取消收藏',
        icon: 'none',
        duration: 2000,
        success: function(){
          return;
        }
      })
      this.setData({
        collected: false,
      })
    }else{
      wx.showToast({
        title: '收藏成功',
        icon: 'none',
        duration: 2000,
        success: function(){
          return;
        }
      })
      this.setData({
        collected: true,
      })
    }
    
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
              answer: this.data.questionList[this.data.shuffleIndex[this.data.index]]['true'],
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
  generateArray: function(start, end) {
    return Array.from(new Array(end + 1).keys()).slice(start)
  }
})