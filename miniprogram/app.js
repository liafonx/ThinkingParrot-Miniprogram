//app.js
var jsonList = require('data/json.js');
var oralList = require('data/oral.js')

App({
  globalData: {
    questionList: jsonList.questionList,
    oralList: oralList.oralList,
    questionDone: 0,
    wrongDone: 0,
  }
})
