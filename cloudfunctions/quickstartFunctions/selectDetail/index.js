const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
const db = cloud.database({
  throwOnNotFound: false,
})
const _ = db.command

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // 返回数据库查询结果
  let res = await db.collection('goods').doc(event.id).get()
  let imgsRes = await getImgById(res.data.imgList)
  res.data.imgList = imgsRes.data
  return res
}

// 根据图片 id 查询图片地址并返回
function getImgById(arr) {
  return db
    .collection('imgs')
    .where({
      _id: _.in(arr),
    })
    .field({
      _id: false,
      fileId: true,
    })
    .get()
}
