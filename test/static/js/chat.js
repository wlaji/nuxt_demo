var Comm100API = Comm100API || {}
;(function(t) {
  function e(e) {
    var a = document.createElement('script'),
      c = document.getElementsByTagName('script')[0]
    ;(a.type = 'text/javascript'),
      (a.async = !0),
      (a.src = e + t.site_id),
      c.parentNode.insertBefore(a, c)
  }

  ;(t.chat_buttons = t.chat_buttons || []),
    t.chat_buttons.push({
      code_plan: 237,
      div_id: 'comm100-button-237'
    }),
    (t.site_id = 217248),
    (t.main_code_plan = 237),
    e('https://vue.comm100.com/livechat.ashx?siteId='),
    setTimeout(function() {
      t.loaded || e('https://vue1.comm100.com/livechat.ashx?siteId=')
    }, 5e3)
})(Comm100API || {})
