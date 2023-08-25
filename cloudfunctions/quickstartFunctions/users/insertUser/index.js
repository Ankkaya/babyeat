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
  // 删除 event 中的 type 属性
  delete event.type
  // 添加点赞，收藏，提交记录
  event.like = []
  event.collect = []
  event.submit = []
  let res = await db.collection('users').add({
    data: event,
  })
  return {
    sucess: true,
    data: { ...event, _id: res._id },
  }
}
