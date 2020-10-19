// eslint-disable-next-line no-undef
const socket = io()

const $msgFormMessage = document.querySelector('#message-form')
const $msgFormTextarea = document.querySelector('input')
const $msgFormButton = document.querySelector('Button')
const $messages = document.getElementById('messages')

const $messageTemplate = document.getElementById('message-template').innerHTML
const $sidebarTemplate = document.getElementById('sidebar-template').innerHTML

// eslint-disable-next-line no-undef
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', message => {
    console.log(message)

    // eslint-disable-next-line no-undef
    const html = Mustache.render($messageTemplate, {
        username: message.username,
        message: message.text,
        // eslint-disable-next-line no-undef
        createdAt: moment(message.createdAt).format('h:m a'),
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('roomData', ({ users, room }) => {
    // eslint-disable-next-line no-undef
    const html = Mustache.render($sidebarTemplate, { users, room })
    document.querySelector('#sidebar').innerHTML = html
})

$msgFormMessage.addEventListener('submit', e => {
    e.preventDefault()

    $msgFormButton.setAttribute('disabled', 'disabled')
    let msg = e.target.elements.message.value
    socket.emit('sendMessage', msg, error => {
        $msgFormButton.removeAttribute('disabled')
        $msgFormTextarea.value = ''
        $msgFormTextarea.focus()
        if (error) {
            return alert(error)
        }

        console.log('message delivered!')
    })
})

socket.emit('join', { username, room }, error => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})
