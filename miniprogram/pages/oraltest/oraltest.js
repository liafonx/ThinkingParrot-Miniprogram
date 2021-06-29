//index.js
//获取应用实例
const app = getApp()

//引入插件：微信同声传译
const plugin = requirePlugin('WechatSI');

Page({
  data: {
    src: '', //路径
  },
  // 文字转语音
  start: function (e) {
    var that = this;
    plugin.textToSpeech({
      lang: "zh_CN",
      tts: true,
      content: "How to say \"人人为己\"?" ,
      success: function (res) {
        console.log(res);
        console.log("succ tts", res.filename);
        that.setData({
          src: res.filename
        })
        // 播报语音
        that.yuyinPlay();
      },
      fail: function (res) {
        console.log("fail tts", res)
      }
    });
  },

  //播放语音
  yuyinPlay: function (e) {
    if (this.data.src == '') {
      console.log("暂无语音");
      return;
    }
    this.innerAudioContext.src = this.data.src //设置音频地址
    this.innerAudioContext.play(); //播放音频
  },

  // 结束语音
  end: function (e) {
    this.innerAudioContext.pause(); //暂停音频
  },
  
  onReady: function () {
    //创建内部 audio 上下文 InnerAudioContext 对象。
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onError(function (res) {
      console.log(res);
      wx.showToast({
        title: '语音播放失败',
        icon: 'none',
      })
    })
  }
})