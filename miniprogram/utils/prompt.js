var  Prompt = {
  loadingOn: function() {
    wx.showLoading({
      title: 'Loading',
    })
  },

  loadingOff: function(){
    wx.hideLoading({
      success: (res) => {},
    })
  },

  toast: function(text, time){
    wx.showToast({ //弹窗提示
      title: text,
      icon: 'none',
      duration: time?time:2000,
      success: function () {
        return;
      }
    })
  }
}

module.exports = Prompt