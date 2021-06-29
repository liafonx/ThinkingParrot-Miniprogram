// miniprogram/pages/collection/collection.js
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
    if(wx.getStorageSync('collection')){
      var collection = JSON.parse(wx.getStorageSync('collection'));
      console.log(collection);
     
      this.setData({
        collection: collection,
        choosed: this.checkEmpty(collection),
      });
    }else{
      this.setData({
        choosed: 0,
      })
    }
    
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