require('dotenv').config()
const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {generateMessage,generateLocation} = require('./utils/messages')
const {addUser, removeUser, getUser, getUserInRoom} = require('./utils/user')

const port = process.env.PORT;
const app = express()

const server = http.createServer(app)
const io = socketio(server)

const viewPath = path.join(__dirname, '../views');
app.use(express.static(viewPath))


io.on('connection', (socket) => {
    console.log('new connection');

    socket.on('join',({username,room}, callback) => {
        const {error,user} = addUser({id :socket.id, username, room});

        if(error){
            return callback(error)
        }

        socket.join(user.room);

        socket.emit('NewConnection', generateMessage('welcome!'));
        socket.broadcast.to(user.room).emit('NewConnection', generateMessage(`${user.username} has joined`));
        callback();
         
    })


    // message
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane.message) {
            callback('profanity is not allowed')
        }
        io.to('mangaluru').emit('NewConnection',generateMessage(message))
        callback()
    });


    // location
    socket.on('sendLocation', (cords, callback) => {
        io.emit('locationMessage', generateLocation(`http://google.com/maps?q=${cords.latitude},${cords.longitude}`));
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('NewConnection', generateMessage(`${user.username} has left!`));
        }
    })
})


server.listen(port, () => {
    console.log('server is up on port ' + port);
})