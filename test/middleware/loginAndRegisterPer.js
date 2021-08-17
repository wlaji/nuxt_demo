export default function({ redirect, store }) {
  //如果是登录状态
  if (store.state.authInfo) {
    redirect('/account')
  }
}
