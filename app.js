// 系统模块
const http = require('http')
const fs = require('fs')
const url = require('url')
const path = require('path')
const querystring = require('querystring');
// 第三方模块
const ejs = require('ejs');
// 自定义模块
const util = require('./utils');

// 启动服务
const callback = function (req, res) {
  router(req, res);
}
const server = http.createServer(callback)
server.listen(3000, console.log('server port 3000'))

// 路由
const router = async (req, res) => {
  const _url = req.url;
  const _method = req.method.toLowerCase();
  let { pathname, query } = url.parse(_url, true);
  if (Object.is(pathname, '/')) pathname = '/index.html'
  if (pathname === '/api/login' && _method === 'post') { // 登录业务
    const data = await postData(req)
    const str = querystring.stringify(data)
    const userData = fs.readFileSync(path.join(__dirname, './utils/store.text')) // 读取数据
    const userInfo = querystring.parse(userData.toString());
    if (data.username == userInfo.username && data.password == userInfo.password) {
      send(200, `<h1>登录成功</h1><a onclick="javascript:history.back()">返回上一级</a><div>${str}</div>`, res, pathname)
    } else {
      send(200, `<h1>用户名密码错误</h1><a onclick="javascript:history.back()">返回上一级</a><div>${str}</div>`, res, pathname)
    }
  } else if (pathname === '/api/register' && _method === 'post') {  // 注册业务
    const data = await postData(req)
    const str = querystring.stringify(data)
    util.writeFile(path.join(__dirname, './utils/store.text'), str).then(() => {
      send(200, `<h1>注册成功</h1><a onclick="javascript:history.back()">返回上一级</a><div>${str}</div>`, res, pathname)
    }).catch((error) => {
      console.error(error)
    })
  } else {
    // 创建静态web服务
    renderStaticFile(pathname, res)
  }
}
// 静态文件渲染
function renderStaticFile(pathname, res) {
  const _path = path.join(__dirname, './static' + pathname);
  const promise = util.readFile(_path)
  promise.then((data) => {
    send(200, data, res, pathname)
  }).catch((error) => {
    send(404, '<h1>404</h1>\n错误：' + error, res, pathname)
  })
}
/**
 * 发送
 * @param {number} code - 状态码
 * @param {string} data - 显示数据
 * @param {Object} response - 对象
 * @param {string} pathname - 路径名
 */
async function send(code = 200, data, response, pathname) {
  const extname = path.extname(pathname);
  response.writeHead(code, {
    'Content-Type': `${await util.getMime(extname)};charset=utf-8;`
  })
  response.end(data)
}
/**
 * post数据响应
 * @param {Object} requset - 对象 
 */
function postData(requset) {
  return new Promise((resolve, reject) => {
    let result = ''
    requset.on('data', (chunk) => result += chunk)
    requset.on('end', () => {
      try {
        resolve(querystring.parse(result))
      } catch (e) {
        reject(e.message);
      }
    })
    requset.on('error', (e) => {
      reject(`出现错误: ${e.message}`);
    })
  })
}


