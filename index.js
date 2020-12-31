const express = require('express')
const app = express();
const http = require('http');

// gdeeeeeeeeeeeeeed //////////////////////////////////
//const Joi = require('joi');
//Joi.objectId = require('joi-objectid')(Joi);
//const users = require('./users.js');
var Users = require('./user.js');
//app.use(express.json());
//app.use('/api/users', users);
 
///////////////////////////////////////////////////////

var Messages = require('./msg.js')

const server = http.Server(app);

const socketio = require('socket.io')
const io = socketio(server);

var PORT = process.env.PORT || 3000;


server.listen(PORT, function () {
    console.log('Listening to PORTv ' + PORT);
});

//This code requires mongoose node module
var mongoose = require('mongoose');

//connecting local mongodb database named test
//var db = mongoose.connect('mongodb://127.0.0.1:27017/test');
mongoose.connect('mongodb://127.0.0.1:27017/test').then(()=>console.log("connect correctly to mongo database"));

//testing connectivity
mongoose.connection.once('connected', function() {
	console.log("Database connected successfully")
});

//chatRoom
var numUsers = 0;

//function to be executed when new user connects connection method
io.on('connection', function (socket) {
    console.log('a new socket has connected');
    var addedUser = false;

    //new message is sent    
    socket.on('new message', function (data) {
        console.log('In function new message');
        console.log(data);

        Messages.create({
        name: "nada for example",
        message: data
}).then(object=>console.log("message saved to mongo succesfully")).catch(err=>console.log(err))

        //show new message to all clients
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
    });

    //new user is added
    socket.on('add user', function (username) {

        if (addedUser === true) {
            //console.log('user already added');
            Users.create({
            name: "nada for example",
            message: username
}).then(object=>console.log("user saved to mongo succesfully")).catch(err=>console.log(err))
            return;
        }
        socket.username = username;
        numUsers++;
        addedUser = true;
        console.log(username + " has joined")

        //login the user and send the number of users
        socket.emit('login', {
            numUsers: numUsers
        });

        //also echo to all clients that the server has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    });


    //A client starts typing
    socket.on('typing', function () {
        console.log('typing')
        //broadcast to all clients
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    //Client stops typing
    socket.on('stop typing', function () {
        console.log('stoped typing');
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });

    //Client disconnects
    socket.on('disconnect', function () {
        console.log('in function disconnect');
        if (addedUser === true) {
            numUsers--;

            //echo globally that user has dissconnected
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });

});
