var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var client= {};

app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        var from = msg.from,
            to = msg.to,
            message = msg.message;
        if(!!client[from] && !!client[to]){
            client[to].emit('chat message', {
                from : from,
                to : to,
                message : message
            });
        }else{
            client[from] = socket;
            var tmpArray = [];
            for(var key in client){
                tmpArray.push(key);
            }
            io.sockets.emit("updateOnline",tmpArray);
        }
    });
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
