/**
 * Created by tankpt on 14-9-9.
 */
var fs = require('fs');
fs.readFile('content.txt',"utf-8",function(err, data) {
    if (err) {
        console.error(err);
    } else {
        console.log(data.length);
    }
    var tmp = data.match(/src[\S]*>/g),
        resultDate ;
    for(var i=0;i<tmp.length;i++){
        resultDate+=tmp[i].split("\"")[1];
    }
});