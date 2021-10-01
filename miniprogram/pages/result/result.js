// pages/results/results.js
var app = getApp();
var redirect = null;
const DEFAULT_PAGE = 0;

Page({
  startPageX: 0,
  currentView: DEFAULT_PAGE,
  data: {
    startPageX: 0,
    currentView: DEFAULT_PAGE,
    totalScore: '', // 分数
    wrongList: [], // 错误的题数-乱序
    remark: ["Excellent","Good","Try Hard!", "成绩获取失败！"], // 评语
    listhidden: true,
    toView: `card_${DEFAULT_PAGE}`,
    list: ['Javascript', 'Typescript', 'Java', 'PHP', 'Go'],
    redirect: '',
    speak: '',
  },
  onLoad: function (options) {
    console.log(options);
    wx.setNavigationBarTitle({ title: options.currLec + " " + options.testId }) // 动态设置导航条标题
    
    let wrongList = JSON.parse(decodeURIComponent((options.wrongList))) ;
    console.log(wrongList);
    let totalScore = options.totalScore;
    if(totalScore != null||totalScore != "" ) {
      totalScore = Number(options.totalScore) ;
    }else {
      totalScore = "无";
    }
    if (options.speak != null || options.speak != '') {
      this.data.speak = options.speak
    }
    this.setData({
      totalScore: totalScore,
      wrongList: wrongList,
      testId: options.testId,  // 课程ID
      redirect: options.redirect,
    })
  
  },

  onShow: function () {
    wx.hideHomeButton({
      success: (res) => {},
    })
  },

  // 查看错题
  toView: function(){
    // 显示弹窗
    this.setData({
      listhidden: false
    })
  },
  // 错题弹窗
  touchStart(e) {
    this.startPageX = e.changedTouches[0].pageX;
  },

  touchEnd(e) {
    const moveX = e.changedTouches[0].pageX - this.startPageX;
    const maxPage = this.data.list.length - 1;
    if (Math.abs(moveX) >= 150){
      if (moveX > 0) {
        this.currentView = this.currentView !== 0 ? this.currentView - 1 : 0;
      } else {
        this.currentView = this.currentView !== maxPage ? this.currentView + 1 : maxPage;
      }
    }
    this.setData({
      toView: `card_${this.currentView}`
    });
  },

  Exit: function () {
    this.setData({
      listhidden: true,
    })
  },

  // 返回首页
  toIndex: function(){
    var url = '../'+this.data.redirect+'/'+this.data.redirect
    wx.switchTab({
      url: url
    })
  },

  banScroll: function() {
    console.log("禁止上下滑动");
  }
})