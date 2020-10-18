const getMessages = text => {
    return {
        text,
        createdAt: new Date().getTime(),
    }
}

const getLocationMessages = url => {
    return {
        url,
        createdAt: new Date().getTime(),
    }
}

module.exports = { getMessages, getLocationMessages }
