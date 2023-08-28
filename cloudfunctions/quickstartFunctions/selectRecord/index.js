const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
const db = cloud.database()
const _ = db.command

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // 先取出集合记录总数
  const countResult = await db.collection('goods').where(jointParams(event)).count()
  // 返回数据库查询结果
  let res = await db
    .collection('goods')
    .skip((event.pageNum - 1) * event.pageSize)
    .limit(event.pageSize ?? 5)
    .where(jointParams(event))
    .get()

  // 循环res.data,并同步执行数据库查询
  for (let i of res.data) {
    let imgsRes = await getImgById(i.imgList)
    i.imgList = imgsRes.data
  }
  return {
    data: res.data,
    total: countResult.total,
    pageNum: event.pageNum,
  }
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
function jointParams(event) {
  let titleCon = {
    title: {
      $regex: '.*' + event.title + '.*',
      $options: 'i',
    },
  }

  let otherCon = {}
  if (event.tags) {
    Object.keys(event.tags).forEach((key) => {
      if (event.tags[key].length > 0) {
        otherCon[key] = _.in(event.tags[key])
      }
    })
  }
  if (event.ids) {
    otherCon._id = _.in(event.ids)
  }
  return Object.assign(titleCon, otherCon)
}
