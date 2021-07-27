// miniprogram/pages/collection/collection.js
var collectList = {
  "LECT1": [
    {
    unit: 'lecture1',
    id: 5,
    example: "Everyone is out for himself.",
    translation: "人人为己",
    meaning: '',
  },
  {
    unit: 'lecture1',
    index: 6,
    question: "赚钱",
    answer: "In the black",
  }
  ],
  "lecture2": [],
  "LECT3":[ {
    unit: 'lecture3',
    index: 5,
    question: "人人为己",
    answer: "Everyone is out for himself.",
  },
  {
    unit: 'lecture3',
    index: 6,
    question: "赚钱",
    answer: "In the black",
  }],
  "lecture4":[],
  "lecture5":[],
  "LECT6":[ {
    unit: 'lecture6',
    index: 5,
    question: "人人为己",
    answer: "Everyone is out for himself.",
  },
  {
    unit: 'lecture6',
    index: 6,
    question: "赚钱",
    answer: "In the black",
  }],
  "lecture7":[],
}


Page({
  /**
   * 页面的初始数据
   */
  data: {
   collection: '',
   choosed: '',
   hiddensetting: true,
   delete:'',
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var openId = wx.getStorageSync('openid');
    console.log(openId);
    wx.request({
      method: 'POST',
      header: {
        "accept": "*/*",
        "content-type": "application/x-www-form-urlencoded"
      },
      url: 'http://34.92.251.246:8091/questionRecord/getNotesCollection/',
      data: {
        commonUserID: openId,
      },
      success: function (response) {
        console.log(response);
        that.setData({
          collection: collectList,
          choosed: 3,
        })
        // that.setData({
        //   rankingList: response.data.result
        // })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },

  checkEmpty: function (collection) {
    var units = 7;
    var choosed = 0;
      for (let index = 1; index <= units; index++) {
        console.log('unit'+index);
        if(collection['unit'+index].length > 0){
          choosed = 'unit'+index;
          break;
        }
      }
      return choosed;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(this.data.collection['unit1']);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  ChangeUnit: function (e) {
    this.setData({
      choosed: e.currentTarget.dataset.unit,
    })
  },

  Confirm: function () {
    var index = this.data.delete;
    console.log(index);
    var collection = this.data.collection;
    collection[this.data.choosed].splice(index, 1);
    this.setData({
      hiddensetting: true,
      choosed: this.checkEmpty(collection),
      collection: collection,
      delete: '',
    })
    wx.setStorageSync('collection', JSON.stringify(collection));
    this.onLoad();
  },

  Cancel: function () {
    console.log(this.data.hiddensetting);
    this.setData({
      hiddensetting: true,
      delete: '',
    })
  },

  OpenSetting: function (e) {
    this.setData({
      hiddensetting: false,
      delete: e.currentTarget.dataset.index,
    })
    
  },
  
})