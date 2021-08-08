Page({
  data: {
    popup: true
  },
  /* 隐藏弹窗 */
  hidePopup(flag = true) {
    this.setData({
        "popup": flag
    });
  },
  /* 显示弹窗 */
  showPopup() {
    this.hidePopup(false);
  }
})