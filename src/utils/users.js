const users = []

const addUser = ({ username, room, id }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return { error: 'username and room are required!' }
    }

    const existingUser = users.find(user => {
        return user.room === room && user.username === username
    })

    if (existingUser) {
        return { error: 'Username is in used!' }
    }
    const user = { username, room, id }
    users.push({ username, room, id })

    return { user }
}

const removeUser = id => {
    const index = users.findIndex(user => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = id => {
    return users.find(user => user.id === id)
}

const getUserInRoom = room => {
    room.trim().toLowerCase()
    return users.filter(user => user.room === room)
}
module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom,
}
