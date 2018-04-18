var linebot = rqeuire('linebot');
var express = require('express');

//建立linebot物件
var bot = linebot({
  //自訂環境變數
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
  // channelId: "1575252685",
  // channelSecret: "15a473de9ade3c5a878649a8a1486224",
  // channelAccessToken: "/kROuxM/8sgxzZLUzfCdVGM+LU+zvsMkhHQrVG36Ku0oNnAeaqniHsl+YS+PRLqIRcMH18tskWPQkHjabLzZjspObov2og7Zz2D7gtfrLOhm7sWB93+kFBhxHNrnSAcfznLOdE6q74n6FZnw4jux0wdB04t89/1O/w1cDnyilFU="
});
//處理訊息事件
bot.on('message', function(event) {
  console.log(event); 
  //回覆收到的訊息文字
  event.replay(event.message.text)
    .then((data)=> {
      // 處理回覆成功的程式碼
      console.log("Success", data); 
    })
    .catch((error) => {
      // 處理回覆失敗的程式碼
      console.log("Error", error); 
    })
});

const app = express();
//驗證數位簽章並解析JSON資料
const linebotParser = bot.parser();
//處理首頁請求
app.get('/', function(req, res){
  res.send('hello world')
})
//處理line訊息的伺服器請求
app.post('/linewebhook', linebotParser);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("LineBot is running on port", port);
});