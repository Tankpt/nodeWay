    var User = require('../dao/user.js'),
        updateStar = require('../modules/star/star.js');

    var EventProxy = require('eventproxy');
//
// RssItem = require('../dao/rssItem.js'),
//    Rss = require('../dao/rss.js'),
//
//    rssSearch = require('../modules/rss/rssSearch.js'),
//    ObjectID = require('mongodb').ObjectID;
//
//var PAGESIZE = 5;

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

        res.render('index', {
            title: 'Hello Rss page',
            user: req.session.user
        });
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
                //updateStar(_gitname);
                req.session.user = user;
                req.flash('success', '注册成功!');
                res.redirect('/');
            });
        });
    });


    app.post('/update',function(req, res){

   });
};