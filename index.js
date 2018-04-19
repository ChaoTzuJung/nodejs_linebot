const linebot = require('linebot');
var express = require('express');
var getJSON = require('get-json');

var timer;
var pm = [];
getJSON_bot();

PM25_bot();

//建立linebot物件
const bot = linebot({
  //自訂環境變數
	channelId: process.env.CHANNEL_ID,
	channelSecret: process.env.CHANNEL_SECRET,
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

const app = express();

//驗證數位簽章並解析JSON資料
const linebotParser = bot.parser();

//處理首頁請求
app.get('/',function(req,res){
  res.send('Hello World!');
});

//處理line訊息的伺服器請求
app.post('/linewebhook', linebotParser);

//處理訊息事件
bot.on('message', function (event) {
  //回覆收到的訊息文字
  event.reply(event.message.text)
    .then(function (data) {
      // 處理回覆成功的程式碼
		  console.log('Success', data);
    })
    .catch(function (error) {
      // 處理回覆失敗的程式碼
		  console.log('Error', error);
	  });
});
//重複我們說過的話
bot.on('message', function(event) {
  if (event.message.type = 'text') {
    var msg = event.message.text;
    event.reply(msg)
    .then(function(data) {
      setTimeout(function(){
        var userId = 'ohmygad5987326';
        var sendMsg = '我正在學習你說話';
        bot.push(userId,sendMsg);
        console.log('send: '+sendMsg);
      },5000);
      console.log(msg);
    })
    .catch(function(error) {
      // error 
      console.log('error');
    });
  }
});

function PM25_bot() {
  bot.on('message', function(event) {
    if (event.message.type == 'text') {
      var msg = event.message.text;
      var replyMsg = '';
      if (msg.indexOf('PM2.5') != -1) {
        pm.forEach(function(e, i) {
          if (msg.indexOf(e[0]) != -1) {
            replyMsg = e[0] + '的 PM2.5 數值為 ' + e[1];
          }
        });
        if (replyMsg == '') {
          replyMsg = '請輸入正確的地點';
        }
      }
      if (replyMsg == '') {
        replyMsg = '不知道「'+msg+'」是什麼意思 :p';
      }

      event.reply(replyMsg).then(function(data) {
        console.log(replyMsg);
      }).catch(function(error) {
        console.log('error');
      });
    }
  });
}

function getJSON_bot() {
  clearTimeout(timer);
  getJSON('http://opendata2.epa.gov.tw/AQX.json', function(error, response) {
    response.forEach(function(e, i) {
      pm[i] = [];
      pm[i][0] = e.SiteName;
      pm[i][1] = e['PM2.5'] * 1;
      pm[i][2] = e.PM10 * 1;
    });
  });
  timer = setInterval(_getJSON, 1800000); //每半小時抓取一次新資料
}

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
// var server = app.listen(process.env.PORT || 8080, function() {
//   var port = server.address().port;
//   console.log("LineBot is running on port", port);
// });

app.listen(process.env.PORT || 80, function () {
	console.log('LineBot is running.');
});