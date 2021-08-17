//登录之后跳转到登录之前的页面
export default ({ app, store }) => {
  app.router.beforeEach((to, from, next) => {
    let isClient = process.client
    if (isClient) {
      if(from.name === 'register' || from.name === 'login'){
        next()
        return
      }
      if((to.name === 'login' || to.name === 'register') && from.name){
        sessionStorage.setItem('prevRouteName',JSON.stringify({
          name:from.name,
          params:from.params,
          query:from.query
        }))
      }
    }
    next()
  })
}
