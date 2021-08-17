;(function flexible (window, document) {
  return false;
  var docEl = document.documentElement
  var dpr = window.devicePixelRatio || 1

  // adjust body font size
  function setBodyFontSize () {
    if (document.body) {
      // mac 浏览器 window.devicePixelRatio=2，导致 body 24px 太大了
      // 这个还是看实际需要吧，为了生活简单可以不需要 dpr
      // 例如腾讯新闻移动站直接设置 16px
      // document.body.style.fontSize = (12 * dpr) + 'px'
      document.body.style.fontSize = '16px'
    }
    else {
      document.addEventListener('DOMContentLoaded', setBodyFontSize)
    }
  }
  setBodyFontSize();

  // set 1rem = viewWidth / 10
  /**
   * 一般移动UI设计以 750px 设计为主
   * 那么这里的 1rem=75px
   */
  function setRemUnit () {
    var rem = docEl.clientWidth / 10
    docEl.style.fontSize = rem + 'px'
  }

  setRemUnit()

  // reset rem unit on page resize
  window.addEventListener('resize', ()=>{
    setRemUnit();
  })
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit()
    }
  })

  // detect 0.5px supports
  if (dpr >= 2) {
    var fakeBody = document.createElement('body')
    var testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
}(window, document))
