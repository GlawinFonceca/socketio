require('dotenv').config()
const express = require('express');
const path = require('path');
const router = require('./src/index');

const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words')

const port = process.env.PORT;
const app = express()

const server = http.createServer(app)
const io = socketio(server)



const viewPath = path.join(__dirname, './views');
app.set('view engine', 'hbs')
app.set('views', viewPath);
app.use(express.static(viewPath))
app.use(router)


io.on('connection', (socket) => {
    console.log('new connection');

    socket.emit('NewConnection', 'welcome!');
    socket.broadcast.emit('NewConnection', 'new user connected');
    // message
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane.message) {
            callback('profanity is not allowed')
        }
        io.emit('NewConnection', message)
        callback()
    });

    // location
    socket.on('sendLocation', (cords, callback) => {
        io.emit('NewConnection',`http://google.com/maps?q=${cords.latitude},${cords.longitude}`);
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('NewConnection', 'user has discononected')
    })
})

server.listen(port, () => {
    console.log('server is up on port ' + port);
})