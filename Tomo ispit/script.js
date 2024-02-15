let currentUserId = 'User 1'
let userColors = {}

const userButtons = document.getElementsByClassName('user-btn')
for (let i = 0; i < userButtons.length; i++) {
  let userId = userButtons[i].textContent
  if (!userColors[userId]) {
    userColors[userId] = '#' + Math.floor(Math.random() * 16777215).toString(16)
  }
  userButtons[i].addEventListener('click', () => {
    currentUserId = userId
  })
}

const drone = new Scaledrone('ihkbYlvEbJL1J1ki')
const messages = document.getElementById('messages')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

drone.on('open', error => {
  if (error) {
    return console.error(error)
  }
  console.log('Connected to Scaledrone')
})

const room = drone.subscribe('observable-room')

room.on('open', error => {
  if (error) {
    return console.error(error)
  }
  console.log('Connected to room')
})

room.on('data', (data, member) => {
  const messageData = JSON.parse(data)
  const messageElement = document.createElement('div')
  messageElement.style.color = messageData.color

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.className = 'message-checkbox'
  checkbox.style.transform = 'scale(0.5)'
  messageElement.appendChild(checkbox)

  const textElement = document.createElement('span')
  textElement.textContent = messageData.text
  messageElement.appendChild(textElement)

  const timeElement = document.createElement('span')
  timeElement.style.fontSize = '0.6em'
  timeElement.style.marginLeft = '20px'
  timeElement.textContent = '(' + new Date(messageData.time).toLocaleTimeString() + ')'
  messageElement.appendChild(timeElement)

  messages.appendChild(messageElement)
  messages.scrollTop = messages.scrollHeight
})

messageForm.addEventListener('submit', event => {
  event.preventDefault()
  const message = {
    text: currentUserId + ': ' + messageInput.value,
    color: userColors[currentUserId],
    time: Date.now(),
  }
  drone.publish({
    room: 'observable-room',
    message: JSON.stringify(message),
  })
  messageInput.value = ''
})

const deleteButton = document.createElement('button')
deleteButton.textContent = 'Delete'
deleteButton.addEventListener('click', () => {
  const checkboxes = document.getElementsByClassName('message-checkbox')
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      checkboxes[i].parentNode.remove()
    }
  }
})
document.body.appendChild(deleteButton)
