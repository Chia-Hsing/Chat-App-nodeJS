const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { getMessages } = require('./utils/messages')
const { addUser, removeUser, getUser, getUserInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

const port = process.env.PORT || 3000

io.on('connection', socket => {
    console.log('New websocket connection.')

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', getMessages('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', getMessages(user.username, `${user.username} has joined!`))
        io.to(user.room).emit('roomData', { users: getUserInRoom(user.room), room: user.room })

        callback()
    })

    socket.on('sendMessage', (msg, callback) => {
        const user = getUser(socket.id)
        if (!msg) {
            return callback('Please say something...')
        }

        const filter = new Filter()
        if (filter.isProfane(msg)) {
            return callback('Profanity is not allowed!')
        }

        io.emit('message', getMessages(user.username, msg))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', getMessages('Admin', `${user.username} has left.`))
            io.to(user.room).emit('roomData', { users: getUserInRoom(user.room), room: user.room })
        }
    })
})

server.listen(port, () => {
    console.log(`The Server is up on ${port}.`)
})
