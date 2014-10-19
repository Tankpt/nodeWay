    var User = require('../dao/user.js'),
        Star = require('../dao/star.js'),
        StarItem = require('../dao/starItem.js'),
        updateStar = require('../modules/star/star.js');

    var EventProxy = require('eventproxy');
//
// RssItem = require('../dao/rssItem.js'),
//    Rss = require('../dao/rss.js'),
//
//    rssSearch = require('../modules/rss/rssSearch.js'),
//    ObjectID = require('mongodb').ObjectID;
//
    var PAGESIZE = 10;

function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登录!');
        res.redirect('/login');
    }
    next();
}

function checkNotLogin(req, res, next) {
    if (req.session.user) {
        req.flash('error', '已登录!');
        res.redirect('back');//返回之前的页面
    }
    next();
}

module.exports = function(app) {


    app.get('/', function(req, res){
        var pageType = req.query.type || '';
        if (req.session.user) {
           Star.prototype.get({
               userName : req.session.user.name
           },function(err, starArray){
              var queryArray = [],
                  tmpObj ={};
              for(var i= 0,len=starArray.length;i<len;i++){
                  queryArray.push(starArray[i].starName);
                  tmpObj[starArray[i].starName] = starArray[i].type;
              }

              StarItem.prototype.get({
                  name: { $in: queryArray }
              },function(err,itemArray){
                   var typeObj = {},
                       typeArray= [],
                       starVoList = [],
                       _pageInfo;
                   for(var i= 0,len=itemArray.length;i<len;i++){
                       var tmp = itemArray[i];
                       tmp.type = tmpObj[tmp.name];
                       if(typeObj[tmp.type]){
                           typeObj[tmp.type] ++;
                       }else{
                           typeObj[tmp.type] = 1;
                       }
                       if(tmp.type == pageType || !pageType){
                           starVoList.push(tmp);
                       }
                   }
                  for(var key in typeObj){
                      typeArray.push({
                          typeName : key,
                          count : typeObj[key]
                      });
                  }
                  _pageInfo = {
                          psize : Math.ceil(starVoList.length/PAGESIZE),
                          p : req.query.p || 1
                  };

                  res.render('index', {
                      title: 'Hello Rss page',
                      user: req.session.user ,
                      starVo : starVoList.slice((_pageInfo.p-1)*PAGESIZE,_pageInfo.p*PAGESIZE),
                      pagePation : _pageInfo,
                      typeArray :typeArray ,
                      pageType : pageType
                  });
              });
           });
        }else{
            res.render('index', {
                title: 'Hello Rss page',
                user: req.session.user,
                starVo : [],
                pageInfo : '',
                typeArray : '',
                pageType : pageType
            });
        }

    });

    app.get('/login', function(req, res){

        res.render('index', {
            title: 'Hello Rss page',
            user: req.session.user
        });
    });
    app.post('/login', function(req, res){


    });


    /*********************reg start***************************/
    app.get('/reg', checkNotLogin);
    app.get('/reg', function(req, res){
        res.render('reg', {
            title: 'register page' ,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/reg', checkNotLogin);
    app.post('/reg', function (req, res) {

        var _name = req.body.name,
            _password = req.body.password,
            _gitname = req.body.gitname,
            _email = req.body.email;

        var newUser = new User({
            name: _name,
            password: _password,
            gitname : _gitname,
            email: _email
        });
        newUser.get(newUser.name, function (err, user) {
            if (user) {
                req.flash('error', '用户已存在!');
                return res.redirect('/reg');
            }
            newUser.save(function (err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg');
                }
                updateStar(_gitname,_name);
                req.session.user = user;
                req.flash('success', '注册成功!');
                res.redirect('/');
            });
        });

    });

    app.get('/update', checkNotLogin);
    app.post('/update',function(req, res){
        var _query = {
                starName : req.body.starName,
                userName : req.session.user.name
            },
            _obj = {
                starName : req.body.starName,
                userName : req.session.user.name,
                type : req.body.type
            };

        res.writeHead(200, {"Content-Type": "text/plain"});
        Star.prototype.update(_query,_obj,function(err,callback){
            if(!!callback){
                res.write("true");
            }else{
                res.write("fasle");
            }
            res.end();
        });
   });
};