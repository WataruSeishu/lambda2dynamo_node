var AWS = require('aws-sdk');

AWS.config.update({
    // Dynamoのリージョンに合わせて書き換える
    region: "us-west-2"
});

var dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    // 現在時刻の取得
    var dt    = new Date();
    
    // 日本の時間に修正
    dt.setTime(dt.getTime() + 32400000); // 1000 * 60 * 60 * 9(hour)
    
    // 日付を数字として取り出す
    var year  = dt.getFullYear();
    var month = dt.getMonth()+1;
    var day   = dt.getDate();
    var hour  = dt.getHours();
    var min   = dt.getMinutes()
    
    // 値が1桁であれば '0'を追加 
    if (month < 10) {
        month = '0' + month;
    }
    
    if (day   < 10) {
        day   = '0' + day;
    }
    
    if (hour   < 10) {
        hour  = '0' + hour;
    }
    
    if (min   < 10) {
        min   = '0' + min;
    }
    
    // 出力
    var Date_now = year + '/' + month  + '/' + day + ' ' + hour  + ':'+ min;
    console.log('Received event:' + Date_now);

    console.log("event:", event);
    dynamo.put({
        "TableName": "Complaints",
        "Item": {
            "Complaints": event.complaints,
            "PostedDate": Date_now
        }
    }, function( err, data ) {
        console.log("dynamo_err:", err);
        context.done(null, data);
    });
};

