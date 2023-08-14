const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')
const { eventNames } = require('process')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
const db = cloud.database()

// 图片上传
exports.main = async (event, context) => {
  const fileStream = fs.createReadStream(path.join(__dirname, event.fileName))
  return await cloud.uploadFile({
    cloudPath: event.fileName,
    fileContent: fileStream,
  })
}
