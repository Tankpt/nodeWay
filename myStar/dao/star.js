/**
 * Created by tankpt on 14-10-12.
 */
var mongodb = require('./db');

function Star (star) {
    this.userName  = star.userName;
    this.starName = star.starName;
    this.type = star.type;
}

module.exports = Star;

Star.prototype.get = function(_query,callback) {

    mongodb.open(function(err,db){
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 rssTable 集合
        db.collection('starTable', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }

            collection.find(_query).sort({
                userName:-1
            }).toArray(function (err, stars) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, stars);//成功！返回查询的用户信息
            });
        });
    });
};

//Star.prototype.save = function(callback) {
//
//    var rssInfo = {
//        userName : this.userName,
//        rssUrl : this.rssUrl,
//        rssName : this.rssName,
//        update : this.update
//    };
//    mongodb.open(function(err,db){
//        if (err) {
//            return callback(err);//错误，返回 err 信息
//        }
//        //读取 rssTable 集合
//        db.collection('rssTable', function (err, collection) {
//            if (err) {
//                mongodb.close();
//                return callback(err);//错误，返回 err 信息
//            }
//            //将用户数据插入 rssTable 集合
//            collection.insert(rssInfo, {
//                safe: true
//            }, function (err, rss) {
//                mongodb.close();
//                if (err) {
//                    return callback(err);//错误，返回 err 信息
//                }
//                callback(null, rss[0]);//成功！err 为 null，并返回存储后的用户文档
//            });
//        });
//    });
//};
//
//Star.prototype.update = function(_query,_obj,callback){
//
//    mongodb.open(function(err,db){
//        if (err) {
//            return callback(err);//错误，返回 err 信息
//        }
//        //读取 rssTable 集合
//        db.collection('rssTable', function (err, collection) {
//            if (err) {
//                mongodb.close();
//                return callback(err);//错误，返回 err 信息
//            }
//            //将用户数据插入 rssTable 集合
//            collection.update(_query,{
//                $set : _obj
//            }, function (err, rss) {
//                mongodb.close();
//                if (err) {
//                    return callback(err);//错误，返回 err 信息
//                }
//                callback(null, rss[0]);//成功！err 为 null，并返回存储后的用户文档
//            });
//        });
//    });
//};
//
//Star.prototype.remove = function(_query,callback){
//    mongodb.open(function(err,db){
//        if (err) {
//            return callback(err);//错误，返回 err 信息
//        }
//        //读取 rssTable 集合
//        db.collection('rssTable', function (err, collection) {
//            if (err) {
//                mongodb.close();
//                return callback(err);//错误，返回 err 信息
//            }
//            collection.remove(_query, {
//                w: 1
//            }, function (err) {
//                mongodb.close();
//                if (err) {
//                    return callback(err,false);
//                }
//                callback(null,true);
//            });
//        });
//    });
//};