
Page({
  data: {
    currLevel : 2,
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
})