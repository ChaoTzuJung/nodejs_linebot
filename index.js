var linebot = rqeuire('linebot');
var express = require('express');

var bot = linebot({
  channelId: "1575213184",
  channelSecret: "170a528e94cb2b049c6b8b4eaee95692",
  channelAccessToken: "JSutZgXJVswJbet8e3uclCCVXjmPZ+bUGZAoUZBpAt3E65b6N5r+d37fDZWqD8hnbEXESp9YAvG+KGXul9HFcLFR6Inzz7eQbaswUf8jvuIy4T6pwP4vQ2tPF0IvBZ6BDN60u8aHpaabOv+fmWaIgQdB04t89/1O/w1cDnyilFU="
});

bot.on('message', function(event) {
  console.log(event); //把收到訊息的 event 印出來看看
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});