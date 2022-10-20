const socket = io()
//client


//elements
const $messageForm =document.querySelector('#myform');
const $messageInput = $messageForm.querySelector('input')
const $messageButton = $messageForm.querySelector('button');
const $messages = document.querySelector('#messages');


//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;


//options
const {username,room} = Qs.parse(location.search,{ ignoreQueryPrefix : true})
console.log(username,room);

socket.on('NewConnection', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate,{
        message:message.text,
        createdAt : moment(message.createdAt).format('h:mm')
    });
    $messages.insertAdjacentHTML('beforeend',html);
})

//url
socket.on('locationMessage',(message) => {
    console.log(message);
    const html = Mustache.render(locationTemplate,{
        url : message.url,
        createdAt :moment(message.createdAt).format('h:mm')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})



$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    $messageButton.setAttribute('disabled','disabled')
    const message = document.querySelector('#message').value
    socket.emit('sendMessage',message,(error) => {
        $messageButton.removeAttribute('disabled');
        $messageInput.value ="";
        $messageInput.focus();
    
        if (error) {
            console.log(error);
        }
        console.log('message delivered');
    });
})




//location of the user
const $loacationButton = document.querySelector('#location');

$loacationButton.addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('geolocation is not supported for your browser')
    }

    $loacationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation',
    {
        latitude :position.coords.latitude,
        longitude :position.coords.longitude},() =>{
            console.log('location shared');
        })
    })
    $loacationButton.removeAttribute('disabled');
})


socket.emit('join',{username,room }, (error) => {
    if(error) {
        alert(error);
        location.href ='/';
    }

})