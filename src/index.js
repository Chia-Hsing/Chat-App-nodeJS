const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { getMessages } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

const port = process.env.PORT || 3000

io.on('connection', socket => {
    console.log('New websocket connection.')

    socket.on('join', ({ username, room }) => {
        socket.join(room)

        socket.emit('message', getMessages('Welcome!'))
        socket.broadcast.to(room).emit('message', getMessages(`${username} has joined!`))
    })

    socket.on('sendMessage', (msg, callback) => {
        if (!msg) {
            return callback('Please say something...')
        }

        const filter = new Filter()
        if (filter.isProfane(msg)) {
            return callback('Profanity is not allowed!')
        }

        io.emit('message', getMessages(msg))
        callback()
    })

    // socket.on('sendLocation', (coords, callback) => {
    //     io.emit(
    //         'locationMessage',
    //         getLocationMessages(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
    //     )
    //     callback()
    // })

    // socket.on('disconnect', () => {
    //     io.emit('message', getMessages('A user has left.'))
    // })
})

server.listen(port, () => {
    console.log(`The Server is up on ${port}.`)
})
