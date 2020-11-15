const express=require('express')
const path=require('path')
const http=require('http')
const socketio=require('socket.io')
const app=express()
const Filter= require('bad-words')
const server=http.createServer(app)
const io=socketio(server)
const qs=require('querystring')

const {getMessage,getLocation}=require('./utils/messages')
const {adduser,removeUser,getUser,getUsersinRoom}=require('./utils/users')
const port=process.env.PORT||3000

io.on('connection',(socket)=>{
    console.log('New Connection')

   
    socket.on('join',(query,callback)=>{
        query=query.replace('?','')
        const q= qs.parse(query)
        const {error,user}=adduser({id:socket.id,username:q.Username,room:q.Room})
        if(error)
        callback(error)
        else{
        socket.join(user.room)
        socket.emit('Message',getMessage("Welcome to the chat app",'Admin'))
        socket.broadcast.to(user.room).emit('Message',getMessage(`${user.username} has joined`,'Admin'))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersinRoom(user.room)
        })

        callback()
       
        }
    
     
    })


    socket.on('sendmessage',(message,callback)=>{
        const user=getUser(socket.id)
        const filter=new Filter()
        if(filter.isProfane(message))
        callback('Profanity is not allowed')
        else{
        io.to(user.room).emit('Message',getMessage(message,user.username))

        callback()
        }

    })
    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)
        if(user)
        io.to(user.room).emit('Message',getMessage(`${user.username} has left`,'Admin'))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersinRoom(user.room)
        })
    })
    socket.on('Location',(loc,callback)=>{
        const user=getUser(socket.id)
        io.emit('DispLoc',getLocation(`https://google.com/maps?q=${loc.latitude},${loc.longitude}`,user.username))
        callback()
    })
})


const Dir=path.join(__dirname,'../public')
app.use(express.static(Dir))
server.listen(port,()=>{
    console.log('Server is Running on port:'+port)
})