var app = getApp();
Page({
	data: {
		avatarAuto: 'assets/bird2.png', // 系统头像
		avatarUser: 'assets/logo-duoguyu.jpg', // 用户头像
		isAnimation: true, // 是否开启动画
		viewHeight: 0, // 设置srcoll-view的高度
		canSend: false, // 是否可发送
		chatDataArray: [], // 对话内容
		useMsg: '', // 用户输入框内的信息
		toView: 'toFooter', // 定位到底部，用于处理消息容器滑动到最底部
		serviceMsg: 'Hi, welcome to Thinking Parrot chatbot! Do you want to have a quick chat?', // 客服对话信息
		redirect: ''
	},

	// 监听 滑动事件
	scroll(e) {
		console.log(e)
	},

	// 处理 滑动到底部 动效
	tapMove() {
		this.setData({ toView: 'toFooter' });
	},

	// 监听 底部输入框
	bindInputValue: function (e) {
		const useMsg = e.detail.value;
		if (useMsg.length !== 0) {
			this.setData({ useMsg, canSend: true });
		} else {
			this.setData({ canSend: false });
		}
	},

	// 发送聊天信息 
	formSubmit: function (e) {
		const that = this, canSend = that.data.canSend;
		if (canSend) {
			let useMsg = that.data.useMsg, serviceMsg = that.data.serviceMsg, chatDataArray = that.data.chatDataArray, waitting = '...';
			let chatData = { serviceMsg: waitting, useMsg }, oldChatDataArray = chatDataArray.concat(chatData);
			that.setData({ useMsg: '', canSend: false, chatDataArray: oldChatDataArray });
			that.tapMove(); // 执行第一次滑动 定位到底部
			// 接入图灵机器人
			// 更多 图灵机器人 Api接口说明，详见文档 -> https://www.kancloud.cn/turing/www-tuling123-com/718227
			let params = {
				"reqType": 0,
				"perception": { "inputText": { "text": useMsg } },
				"userInfo": {
					"apiKey": "",  // 此处填入图灵机器人申请的ApiKey，如不填写会提示你：apiKey格式不合法！
					"userId": "duoguyu.com"  // 此处为用户的唯一标识符，openId或userId
				}
      };
      console.log("User:" + useMsg)
			wx.request({
        method: 'POST',
        header: {
          "accept": "*/*",
          "content-type": "application/x-www-form-urlencoded"
        },
        url: app.globalData.urlDomain + 'ChatbotGetMessage/',
        data: {
          message: useMsg,
          // message: "hello"
        },
				success: function (res) {
          let serviceMsg = "Sorry, there is typo in your words. I don't understand what are you saying..."
          if (res.data.response) {
            serviceMsg = res.data.response  // 得到图灵接口返回的文本信
          }
					// 延迟1s 回复
					  setTimeout(() => {
						// 修饰动画 - 正在回复中 变回原值
						const i = oldChatDataArray.length - 1;
						oldChatDataArray[i].serviceMsg = serviceMsg;
						that.setData({ chatDataArray: oldChatDataArray });
						that.tapMove(); // 执行第二次滑动 定位到底部
					  }, 1000);
				},
				fail: function () {
					// fail  
				},
				complete: function () {
					// complete  
				}
			});
		} else {
			console.log('当前还不能发送');
		}

	},

	// 处理 设备可显示高度
	getBtnHeight: function () {
		const that = this, query = wx.createSelectorQuery();
		query.select('#footerBtnGroup').boundingClientRect();
		query.selectViewport().scrollOffset();
		query.exec(function (res) {
			const _h = res[0].height * 2 - 15;
			let windowHeight = wx.getSystemInfoSync().windowHeight;
			let windowWidth = wx.getSystemInfoSync().windowWidth;
			const viewHeight = parseInt(750 * windowHeight / windowWidth - _h);
			that.setData({ viewHeight });
			that.tapMove();
		});
	},

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		const that = this;
		that.getBtnHeight();  // 处理 设备可显示高度

	},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
	onReady: function () {
		this.animation = wx.createAnimation(); // 创建动画。

	},

	onUnload: function () {
    var page = this.data.redirect
    wx.reLaunch({
      url: '../'+page+'/'+page
    })
  },

})