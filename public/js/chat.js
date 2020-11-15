
const socket=io()

//Elements
const form=document.querySelector('#send')
const input=document.querySelector('#msg')
const locat=document.querySelector('#Send-loc')
const $message = document.querySelector('#messages')

//templates
const msgtemplate=document.querySelector('#message-template').innerHTML
const loctemplate=document.querySelector('#location-template').innerHTML
const sidetemplate=document.querySelector('#sidebar-template').innerHTML

//Options

const query=location.search


const autoscroll = () => {
    // New message element
    const $newMessage = $message.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $message.offsetHeight

    // Height of messges container
    const containerHeight = $message.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $message.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $message.scrollTop = $message.scrollHeight
    }
}


socket.on('Message',(msg)=>{
    const html=Mustache.render(msgtemplate,{msg:msg.text,time:moment(msg.createdAt).format('h:mm a'),name:msg.username})
    $message.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

form.addEventListener('click',()=>{
    const message=input.value
    socket.emit('sendmessage',message,(error)=>{
        form.setAttribute('disabled','disabled')
        input.value=''
        input.focus()
        if(error)
        console.log(error)
        else{
        console.log('Message Delivered')
        form.removeAttribute('disabled')
        }
    })

})
locat.addEventListener('click',()=>{
    locat.setAttribute('disabled','disabled')
    if(!navigator.geolocation)
    return alert('Geo location is not supported on your browser')
    navigator.geolocation.getCurrentPosition((position)=>{
        const loc={
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        }
        socket.emit('Location',loc,()=>{
            console.log('Locagtion Shared!!')
            locat.removeAttribute('disabled')
        })
    })
})
socket.on('DispLoc',(loc,name)=>{
    if(loc.url){
    const html=Mustache.render(loctemplate,{loc:loc.url,time:moment(msg.createdAt).format('h:mm a'),name:loc.username})
    $message.insertAdjacentHTML('beforeend',html)
    autoscroll()
    }
})

socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sidetemplate,{room,users})
    document.querySelector('#sidebar').innerHTML=html
})

socket.emit('join',query,(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})