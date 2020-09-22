const fs = require('fs');
const path = require('path')

const getQueryParam = (req, name) => {
  try {
    let _url;
    if (!_url) {
      _url = new URL(req.url, `http://${req.headers.host}`)
    }
    return _url.searchParams.get(name)
  } catch (error) {
    throw error;
  }
}

const getMime = function (type) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, './mime.json'), (err, data) => {
      if (err) {
        reject(err)
      }
      const mime = JSON.parse(data.toString());
      resolve(mime[type] || 'text/html')
    })
  })
}

/**
 * 文件读取
 * @param {string} _path - 文件路径
 */
function readFile(_path) {
  return new Promise((resolve, reject) => {
    fs.readFile(_path, (err, data) => {
      err ? reject(err) : resolve(data.toString())
    })
  })
}
/**
 * 文件写入
 * @param {string} _path - 文件路径
 * @param {string} value
 */
function writeFile(_path, value) {
  return new Promise((resolve, reject) => {
    fs.writeFile(_path, value, (err) => {
      err ? reject(err) : resolve()
    })
  })
}
/**
 * 文件追加内容
 * @param {string} _path - 文件路径
 * @param {string} value
 */
function appendFile(_path, value) {
  return new Promise((resolve, reject) => {
    fs.appendFile(_path, value, (err) => {
      err ? reject(err) : resolve()
    })
  })
}


module.exports = {
  getQueryParam,
  getMime,
  readFile,
  writeFile,
  appendFile,
}