// pages/results/results.js
var app = getApp();
var redirect = null;
Page({
  data: {
    totalScore: null, // 分数
    wrongList: [], // 错误的题数-乱序
    wrongListSort: [],  // 错误的题数-正序
    chooseValue: [], // 选择的答案
    remark: ["Excellent","Good","Try Hard!"], // 评语
    modalShow: false
  },
  onLoad: function (options) {
    console.log(options);
    wx.setNavigationBarTitle({ title: options.testId }) // 动态设置导航条标题
    
    let wrongList = JSON.parse(options.wrongList);
    let wrongListSort = JSON.parse(options.wrongListSort);
    let chooseValue = ''
    if(options.testId == 'unit1') {
      let chooseValue = JSON.parse(options.chooseValue);
    }
    let totalScore = options.totalScore;
    if(options.redirect){
      redirect = options.redirect;
    }
    if(totalScore != null||totalScore != "" ) {
      totalScore = Number(options.totalScore) ;
    }else {
      totalScore = "无";
    }
    this.setData({
      totalScore: totalScore,
      wrongList: wrongList,
      wrongListSort: wrongListSort,
      chooseValue: chooseValue,
      questionList: app.globalData.questionList[options.testId],  // 拿到答题数据
      testId: options.testId  // 课程ID
    })
    console.log(this.data.chooseValue);
  },
  // 查看错题
  toView: function(){
    // 显示弹窗
    this.setData({
      modalShow: true
    })
  },
  // 返回首页
  toIndex: function(){
    var url = '../learning/learning'
    if(redirect){
      var url = '../wrong/wrong'
    }
    wx.switchTab({
      url: url
    })
  }
})