export default function({ redirect, store }) {
  //如果不是登录状态
  if (!store.state.authInfo) {
    redirect('/login')
  }
}
