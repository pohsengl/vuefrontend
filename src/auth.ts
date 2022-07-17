function saveCookie(access_token:any, refresh_token:any){
    console.log('saving cookie')
    document.cookie=`access_token=${access_token}; Secure"`
    console.log('saved cookie')
}




export {saveCookie}