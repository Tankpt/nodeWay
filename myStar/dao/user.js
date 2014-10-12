/**
 * Created by tankpt on 14-10-3.
 */
var mongodb = require('./db');

function User (user) {
    this.name = user.name;
    this.password = user.password;
    this.gitname = user.gitname;
    this.email  = user.email;
}

module.exports = User;

User.prototype.save = function(callback) {

    var userInfo = {
        name : this.name,
        password : this.password,
        email : this.email
    };
    mongodb.open(function(err,db){
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 userTable 集合
        db.collection('userTable', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //将用户数据插入 users 集合
            collection.insert(userInfo, {
                safe: true
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回 err 信息
                }
                callback(null, user[0]);//成功！err 为 null，并返回存储后的用户文档
            });
        });
    });
};

User.prototype.get = function(userName,callback) {

    mongodb.open(function(err,db){
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('userTable', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //将用户数据插入 users 集合
            collection.findOne({
                name: userName
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, user);//成功！返回查询的用户信息
            });
        });
    });
};