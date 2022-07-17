function saveCookie(access_token:any, refresh_token:any){
    document.cookie=`access_token=${access_token}; path='/'; domain='vue.lpssss.site; Secure"`
}




export {saveCookie}