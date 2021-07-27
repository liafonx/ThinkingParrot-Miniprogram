Page({
  data: {
    currLevel: '1',
    currLec: "Lecture  2",
    slist: [{
        id: 1,
        name: "Lecture  1"
      },
      {
        id: 1,
        name: "Lecture  2"
      },
      {
        id: 1,
        name: "Lecture  3"
      },
      {
        id: 1,
        name: "Lecture  4"
      },
      {
        id: 1,
        name: "Lecture  5"
      },
      {
        id: 1,
        name: "Lecture  6"
      },
      {
        id: 1,
        name: "Lecture  7"
      },
      {
        id: 1,
        name: "Lecture  8"
      },
      {
        id: 1,
        name: "Lecture  9"
      },
      {
        id: 1,
        name: "Lecture  10"
      },
      {
        id: 1,
        name: "Lecture  11"
      },
    ],
    isstart: false,
    openimg: "/images/list/list.png",
    offimg: "/images/list/list1.png"
  },

  onLoad: function (options) {
    if (wx.getStorageSync('currLevel')) {
      this.setData({
        currLevel: wx.getStorageSync('currLevel'),
      })
    }
    if (wx.getStorageSync('currLec')) {
      this.setData({
        currLec: wx.getStorageSync('currLec'),
      })
    }
    console.log(this.data.currLec);
  },


  toTestPage: function (e) {
    let testId = e.currentTarget.dataset['testid'];
    console.log(testId);
    switch (this.data.currLevel) {
      case '1':
        wx.navigateTo({
          url: '' + testId //跳转到答题页， 传入试题
        })
        break;
      case '2':
        wx.navigateTo({
          url: '../choice/choice?testId=' + testId + '&currLec=' + this.data.currLec //跳转到答题页， 传入试题
        })
        break;
      case '3':
        wx.navigateTo({
          url: '../choice/choice?testId=' + testId + '&currLec=' + this.data.currLec //跳转到答题页， 传入试题
        })
        break;
      case '4':
        wx.navigateTo({
          url: '../speak/speak?testId=' + testId + '&currLec=' + this.data.currLec //
        })
        break;
      default:
        console.log(this.data.currLevel);
    }
  },

  changeState: function (e) {
    var that = this;
    if (e.currentTarget.dataset.unlock) {
      that.setData({
        currLevel: e.currentTarget.dataset.level
      });
    };
  },

  opens: function (e) {
    if (this.data.isstart) {
      this.setData({
        isstart: false,
      });
    } else {
      this.setData({
        isstart: true,
      });
    }
  },
  onclicks1: function (e) {
    var index = e.currentTarget.dataset.index;
    let name = this.data.slist[index].name;
    this.setData({
      isstart: false,
      currLec: name,
    })
  }
})