// recording object
const recorderManager = wx.getRecorderManager();

function sendRecord(src) {
  var that = this;
  var obj = {
    url: "https://3i776945c0.oicp.vip/api/recognize/",
    filePath: src,
    name: "audio",
    method: "POST",
    header: {
      'Content-Type': 'application/json'
    },
    success: function (result) {
      var data = JSON.parse(result.data);
      // msg: String for result of speech recognition
      var msg = data.result;
      // Get the current page object
      var page = getCurrentPages()[0];
      console.log(page.route);
      var check = '8520';
      // if(msg.search("milk")) {
      //   check = "You are right!"
      // } else {
      //   check = "Sorry!"
      // }
      that.setData({
        msg: msg,
        check: check,
        index: 2,
      });
    },
    fail: function (err) {
      console.log(err);
    },
  };
  wx.uploadFile(obj);
}

// Triggered when the recording ends 
recorderManager.onStop((res) => {
  // Get the file path
  sendRecord(res.tempFilePath);
})

recorderManager.onError((res) => {
  console.log("error", res);
});

Page({

  /**
   * The initial data of the page
   */
  data: {
    msg: "",
    check: "",
    index: 0,  // 题目序列
    case: 2, // 题目类型
    totalScore: 100, // 总分
    wrong: 0, // 错误的题目数量
    wrongList: [], // 错误的题目集合-乱序
    wrongListSort: [], // 错误的题目集合-正序
  },
  // Triggered when the button is pressed
  startrecorderHandel() {
    // start recording
    recorderManager.start({
      format: "mp3"
    });
  },
  // Triggered when the button is released: Send the recording
  sendrecorderHandel() {
    // Stop recording
    recorderManager.stop();
  },

  /**
   * Monitor page loading
   */
  onLoad: function (options) {
    wx.authorize({
      scope: 'test'
    });
  }
})