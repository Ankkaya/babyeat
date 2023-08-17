const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
const db = cloud.database()

// 图片上传
exports.main = async (event, context) => {
  let uploadResult = await cloud.uploadFile({
    cloudPath: event.cloudPath,
    fileContent: new Buffer(event.file, 'base64'),
  })
  // 上传成功后，返回文件 ID
  let img = null
  if (uploadResult.fileID) {
    img = await db.collection('imgs').add({
      data: {
        fileId: uploadResult.fileID,
        goodsId: '',
      },
    })
  }
  return {
    success: true,
    data: img._id,
  }
}
