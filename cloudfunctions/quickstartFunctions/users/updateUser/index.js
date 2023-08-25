const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
const db = cloud.database({
  throwOnNotFound: false,
})
const _ = db.command

// 处理点赞和收藏
const useCollectFn = (event, userInfoResult, mark) => {
  let arr = userInfoResult[mark]
  // 查找当前用户是否已经点赞
  let index = arr.findIndex((item) => event.goodsId === item)
  if (event.value) {
    arr.push(event.goodsId)
  } else {
    arr.splice(index, 1)
  }
  // 数组去重
  arr = [...new Set(arr)]
}

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // 返回数据库查询结果
  delete event.type
  try {
    let dataParams = null
    let returnData = {
      success: true,
      data: null,
    }
    // 判断修改类型
    if (event.callType) {
      // 修改点赞和收藏
      let { data: userInfoResult } = await db.collection('users').doc(event.id).get()
      useCollectFn(event, userInfoResult, event.callType)
      if (event.callType === 'like') {
        dataParams = { like: userInfoResult.like }
      } else if (event.callType === 'collect') {
        dataParams = { collect: userInfoResult.collect }
      }
    } else {
      // 修改用户信息
      dataParams = { ...event }
    }
    await db
      .collection('users')
      .where({
        openid: event.openid,
      })
      .update({
        data: dataParams,
      })
    let { data } = await db.collection('users').where({ openid: event.openid }).get()
    returnData.data = data[0]
    return returnData
  } catch (e) {
    console.error(e)
  }
}
