
Page({
  data: {
    currLevel : '2',
    start: "Lecture 1",
    slist: [
     { id: 1, name: "Lecture 1" },
     { id: 1, name: "Lecture 2" },
     { id: 1, name: "Lecture 3" },
     { id: 1, name: "Lecture 4" },
     { id: 1, name: "Lecture 5" },
    ],
    isstart: false,
    openimg: "/images/list/list.png",
    offimg: "/images/list/list1.png"
  },
  onLoad: function (options) {

  },
  toTestPage: function (e) {
    let testId = e.currentTarget.dataset['testid'];
    console.log(testId);
    switch (this.data.currLevel) {
      case '1':
        wx.navigateTo({
          url: '../choice/choice?testId=' + testId //跳转到答题页， 传入试题
        })
        break;
      case '2':
        
        wx.navigateTo({
          url: '../speak/speak?testId=' + testId //
        })
        break;
      default:
          console.log(this.data.currLevel);
    }
  },

  changeState: function (e) {
    var that = this;
    if(e.currentTarget.dataset.unlock) {
        that.setData({
          currLevel: e.currentTarget.dataset.level
        });
    };
  },

  opens: function (e) {
    switch (e.currentTarget.dataset.item) {
     case "1":
      if (this.data.isstart) {
       this.setData({
        isstart: false,
       });
      }
      else {
       this.setData({
        isstart: true,
       });
      }
      break;
    }
   },
   onclicks1: function (e) {
    var index = e.currentTarget.dataset.index;
    let name = this.data.slist[index].name;
    this.setData({
     isstart: false,
     isfinish: false,
     isdates: false,
     start: this.data.slist[index].name,
     finish: "目的地"
    })
   }
})