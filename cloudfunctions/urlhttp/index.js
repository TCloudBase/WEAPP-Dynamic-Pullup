const cloud = require('wx-server-sdk') //引入小程序原生SDK，用于云调用生成URL Scheme
const manage = require('@cloudbase/manager-node') //引入manage-sdk，用于管理静态网站托管，文件上传更新
const fs = require("fs");
const path = require("path");
const USER_ID = '' //在管理后台取小程序原始ID

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  // 读取云函数环境变量，获取必要的信息
  const {
    WX_APPID,
    TENCENTCLOUD_SECRETID,
    TENCENTCLOUD_SECRETKE,
    TCB_ENV
  } = JSON.parse(context.environment)
  // 初始化manage-sdk，获取静态托管操作对象
  const {
    hosting
  } = new manage({
    SecretId: TENCENTCLOUD_SECRETID,
    SecretKey: TENCENTCLOUD_SECRETKE,
    envId: TCB_ENV
  })

  // 处理参数
  const PATH = event.page!=null? event.page +'.html?' + event.query : ''
  const NAME = event.name!=null? encodeURIComponent(event.name) : new Date().getTime()


  // 获取URL Scheme
  const {
    openlink
  } = await cloud.openapi.urlscheme.generate({
    jumpWxa: {
      path: event.page || '',
      query: event.query || '',
    },
    isExpire: false, // 是否过期
    // expire_time: Math.round(new Date().getTime()/1000) + time  // 如果过期，需要设置过期时间
  })
  
  // 保存有关信息，本地html
  fs.writeFileSync(path.join('/tmp', `${NAME}.html`), `
    <script src="/main.js" charset="utf-8"></script>
    <script>
      window.Info = {
        appId: '${WX_APPID}',
        gh_ID: '${USER_ID}',
        path: '${PATH}',
        scheme: '${openlink}'
      }
    </script>
        `, 'utf8');

  // 更新上传至静态网站托管
  const result = await hosting.uploadFiles({
    localPath: path.join('/tmp', `${NAME}.html`),
    cloudPath: `url/${NAME}.html`
  })

  cloud.logger().log({
    PATH,
    NAME,
    WX_APPID,
    TCB_ENV,
    TENCENTCLOUD_SECRETID,
    TENCENTCLOUD_SECRETKE,
    openlink,
    result:JSON.stringify(result)
  })
  return result.files[0].options.Key
}