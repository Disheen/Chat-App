const  getMessage=(text,name)=>{
    const time=new Date().getTime()
    return{
    username:name,
    text,
    createdAt:time
    }
}

const  getLocation=(url,name)=>{
    const time=new Date().getTime()
    return{
    username:name,
    url,
    createdAt:time
    }
}

module.exports={ getMessage,getLocation}