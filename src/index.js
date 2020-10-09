const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

const port = process.env.PORT || 3000

io.on('connection', () => {
    console.log('New websocket connection.')
})

server.listen(port, () => {
    console.log(`The Server is up on ${port}.`)
})
