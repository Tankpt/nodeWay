/**
 * Created by tankpt on 14-10-3.
 */
var mongodb = require('./db');

function StarItem () {}

module.exports = StarItem;

StarItem.prototype.save = function(rssArray,callback) {

    mongodb.open(function(err,db){
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('rssitemTable', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //将用户数据插入 users 集合
            collection.insert(rssArray, {
                safe: true
            }, function (err, _rssItemArray2) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回 err 信息
                }
                callback(null, _rssItemArray2);//成功！err 为 null，并返回存储后的用户文档
            });
        });
    });
};

StarItem.prototype.get = function(_query,callback) {

    mongodb.open(function(err,db){
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 rssitemTable 集合
        db.collection('rssitemTable', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }

            collection.find(_query).sort({
                rssUrl : -1
            }).toArray(function (err, _rssItemArray2) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, _rssItemArray2);//成功！返回查询的用户信息
            });
        });
    });
};

StarItem.prototype.remove = function(_query,callback){
    mongodb.open(function(err,db){
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('rssitemTable', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //将用户数据插入 users 集合
            collection.remove(_query, function (err, removedItem) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回 err 信息
                }
                callback(null, removedItem);//成功！err 为 null，并返回存储后的用户文档
            });
        });
    });
}