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
  try {
    await db
      .collection('users')
      .where({
        openid: event.openid,
      })
      .update({
        data: event.data,
      })
    return {
      success: true,
    }
  } catch (e) {
    console.error(e)
  }
}
