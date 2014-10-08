/**
 * Created by tankpt on 14-10-2.
 */
var https =  require('https');
var cheerio = require("cheerio");
var EventProxy = require('eventproxy');


var url = "https://github.com/stars/username?direction=desc&page=pageNumber&sort=created";


module.exports = search =  function(username){

    var resultArray = [],
        desUrl =url.replace(/username/g,username),
        g_page = 1,
        hasNext = 1,
        ep = new EventProxy();

    ep.tail('search', function () {

        if(hasNext===1){
            g_page ++;
            getDate();
        }else{
            ep.unbind();
            console.log(resultArray);
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