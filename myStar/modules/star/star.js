/**
 * Created by tankpt on 14-10-2.
 */
var https =  require('https'),
    cheerio = require("cheerio"),
    EventProxy = require('eventproxy');

var StarItem = require('../../dao/starItem.js'),
    Star = require('../../dao/star.js');

var url = "https://github.com/stars/gitname?direction=desc&page=pageNumber&sort=created";

function findNew(arrayL,arrayS){
    var obj = {},
        tmpArray = [];
    for(var i= 0,len = arrayS.length;i<len;i++){
        obj[arrayS[i].name] = arrayS;
    }
    for(var i= 0,len = arrayL.length;i<len;i++){
        if(arrayL[i].name in obj){
           continue;
        }else{
           tmpArray.push(arrayL[i]);
        }
    }
    return tmpArray;
}

module.exports = search =  function(gitname){

    var resultArray = [],
        desUrl =url.replace(/gitname/g,gitname),
        g_page = 1,
        hasNext = 1,
        ep = new EventProxy();

    ep.tail('search', function () {

        if(hasNext===1){
            g_page ++;
            getDate();
        }else{
            ep.unbind();
            //console.log(resultArray);
            var queryArray = [];
            for(var i= 0,len=resultArray.length;i<len;i++){
                queryArray.push(resultArray[i].name);
            }
            StarItem.prototype.get({
                name: { $in: queryArray }
            },function(err,starArray){

                var _insertArray = findNew(resultArray,starArray);
                console.log(_insertArray.length);
                StarItem.prototype.save();
            });
        }
    });

   function getDate (){
       https.get(desUrl.replace(/pageNumber/g,g_page), function(res) {
           var source = "";

           res.on('data', function(data) {
               source += data;
           });

           res.on('end', function() {
               var $ = cheerio.load(source);
               if(!!$('.blankslate').html()){
                   hasNext = 0 ;
                   console.log("not exit");
               }else{
                   $('.repo-list-item').each(function(_index,_item) {
                       resultArray.push({
                           name : $('.repo-list-name',_item).text().replace(/<\/?.+?>/g,"").replace(/\s+/g, ""),
                           description : $('.repo-list-description',_item).text().replace(/\n/g,"").trim(),
                           starTime : $('.repo-list-meta',_item).text().trim()
                       });
                   });
                   console.log("exit next page");
               }
               ep.emit('search');

           });
       }).on('error', function() {
           console.log("获取数据出现错误");
       });
   }
   getDate();
};