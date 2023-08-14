const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
const db = cloud.database()

// 图片上传
exports.main = async (event, context) => {
  return await cloud.uploadFile({
    cloudPath: event.cloudPath,
    fileContent: new Buffer(event.file, 'base64'),
  })
}
