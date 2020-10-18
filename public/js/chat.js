// eslint-disable-next-line no-undef
const socket = io()

const $msgFormMessage = document.querySelector('#message-form')
const $msgFormTextarea = document.querySelector('input')
const $msgFormButton = document.querySelector('Button')
// const $sendLocation = document.querySelector('#send-location')
const $messages = document.getElementById('messages')

const $messageTemplate = document.getElementById('message-template').innerHTML
// const $locationMessageTemplate = document.getElementById('location-message-template').innerHTML

// eslint-disable-next-line no-undef
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', message => {
    console.log(message)

    // eslint-disable-next-line no-undef
    const html = Mustache.render($messageTemplate, {
        message: message.text,
        // eslint-disable-next-line no-undef
        createdAt: moment(message.createdAt).format('h:m a'),
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

// socket.on('locationMessage', message => {
//     // eslint-disable-next-line no-undef
//     const html = Mustache.render($locationMessageTemplate, {
//         url: message.url,
//         // eslint-disable-next-line no-undef
//         createdAt: moment(message.createdAt).format('h:m a'),
//     })
//     $messages.insertAdjacentHTML('beforeend', html)
// })

$msgFormMessage.addEventListener('submit', e => {
    e.preventDefault()

    $msgFormButton.setAttribute('disabled', 'disabled')
    let msg = e.target.elements.message.value
    socket.emit('sendMessage', msg, error => {
        $msgFormButton.removeAttribute('disabled')
        $msgFormTextarea.value = ''
        $msgFormTextarea.focus()
        if (error) {
            return console.log(error)
        }

        console.log('message delivered!')
    })
})

socket.emit('join', { username, room })

// $sendLocation.addEventListener('click', () => {
//     if (!navigator.geolocation) {
//         return alert('Geolocation is not supported by your browser.')
//     }
//     $sendLocation.setAttribute('disabled', 'disabled')

//     navigator.geolocation.getCurrentPosition(position => {
//         socket.emit(
//             'sendLocation',
//             {
//                 latitude: position.coords.latitude,
//                 longitude: position.coords.longitude,
//             },
//             () => {
//                 console.log('Location shared!')
//                 $sendLocation.removeAttribute('disabled')
//             }
//         )
//     })
// })
