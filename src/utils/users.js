
count=0
const users=[]

const adduser=({id,username,room})=>{
    
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    if(!username|| !room)
    return {error:'Username and room required'}
    users.forEach((user)=>{
        if(user.username===username&&user.room===room){
            count++
        }
    })
    if(count!=0){
     return{error:' User already exists in the given room',user:undefined}
    }
    else{
    const user={id,username,room}
    users.push(user)
    return {error:undefined,user}
    }
}

const removeUser=(id)=>{
    const index=users.findIndex((user)=>user.id===id)
    if(index!=-1)
    return users.splice(index,1)[0]
}

const getUser=(id)=>{
    const user=users.find((user)=>user.id===id)
    return user
}


const getUsersinRoom=(room)=>{
    room=room.toLowerCase()
    return users.filter((user)=>user.room===room)
    
}



module.exports={adduser,removeUser,getUser,getUsersinRoom}