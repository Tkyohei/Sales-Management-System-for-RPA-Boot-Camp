if(sessionStorage.getItem('user') != "robo"){
    window.location.href = "../login.html";
}else{
    (async()=>{
        await dao.createDataBaseIfNotExists();
    })()
}
