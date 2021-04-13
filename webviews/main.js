loadheadfile('https://res.wx.qq.com/open/js/jweixin-1.6.0.js', 'js')
loadheadfile('https://res.wx.qq.com/open/js/cloudbase/1.1.0/cloud.js', 'js')
document.head.innerHTML += `
  <meta charset="UTF-8">
	<title>跳转微信小程序</title>
	<meta name="viewport"
		content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,viewport-fit=cover">
  <style>
    body{
      display: flex;
    }
    button{
      border: none;
      line-height: 3;
      font-size: 15px;
      padding: 0 15px;
      margin: auto;
      outline: none;
    }
    #weixin{
      margin: auto;
      width: 166px;
    }
  </style>
`

window.onload = function () {
  loadpage()
  if(isWeixinBrowser()){
    initweixin()
  } else {
    document.getElementById('scheme').style = ''
  }
}

function loadpage() {
  document.body.innerHTML = `
  <wx-open-launch-weapp id="weixin" username="" style="display: none;">
    <template>
      <style>
        button{
          border: none;
          line-height: 3;
          font-size: 15px;
          padding: 0 15px;
          margin: auto;
          outline: none;
        }
      </style>
      <button>进入到微信小程序</button>
    </template>
  </wx-open-launch-weapp>
  <button id="scheme" style="display: none;" onclick="window.location.href = window.Info.scheme">跳转到微信小程序</button>
  `
}

function initweixin() {
  window.wx.config({
    appId: window.Info.appId,
    timestamp: 0,
    nonceStr: 'nonceStr',
    signature: 'signature',
    jsApiList: ['openWeApp'],
    openTagList: ['wx-open-launch-weapp'],
    debug: false
  })
  window.wx.ready(function () {
    var btn = document.getElementById('weixin')
    btn.setAttribute('username', window.Info.gh_ID)
    btn.setAttribute('path', window.Info.path)
    btn.style = ''
    btn.addEventListener('launch', function (e) {
      console.log('success', e)
    })
    btn.addEventListener('error', function (e) {
      console.log('fail', e)
    })
  })
}

function isWeixinBrowser() {
  var agent = navigator.userAgent.toLowerCase()
  if (agent.match(/MicroMessenger/i) == 'micromessenger' && agent.match(/wxwork/i) != 'wxwork') {
    return true
  } else {
    return false
  }
}

function loadheadfile (filename, filetype) {
  let fileref = null
  if (filetype === 'js') {
    fileref = document.createElement('script')
    fileref.setAttribute('type', 'text/javascript')
    fileref.setAttribute('src', filename)
  } else if (filetype === 'css') {
    fileref = document.createElement('link')
    fileref.setAttribute('rel', 'stylesheet')
    fileref.setAttribute('type', 'text/css')
    fileref.setAttribute('href', filename)
  }
  if (typeof fileref !== 'undefined') {
    document.getElementsByTagName('head')[0].appendChild(fileref)
  }
}