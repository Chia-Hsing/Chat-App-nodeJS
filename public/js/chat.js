// eslint-disable-next-line no-undef
const socket = io()

socket.on('message', message => {
    console.log(message)

    document.querySelector('#message-form').addEventListener('submit', e => {
        e.preventDefault()
        let msg = e.target.elements.message.value
        socket.emit('sendMessage', msg)
    })
})

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position)
    })
})
