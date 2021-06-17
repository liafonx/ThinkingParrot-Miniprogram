// recording object
const recorderManager = wx.getRecorderManager();

function sendRecord(src) {
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
      page.setData({
        msg: msg
      });
    },
    fail: function (err) {
      console.log(err);
    },
  };
  wx.uploadFile(obj)
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
    msg: ""
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
      scope: 'record'
    })
  }
})