const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
const db = cloud.database()
const _ = db.command
console.log('selectRecord/index.js: db:', db)

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // 返回数据库查询结果
  let res = await db.collection('goods').where(jointParams(event)).get()
  res.data.forEach(async (item) => {
    let arr = [...item.imgList]
    let sres = await db
      .collection('imgs')
      .where({
        _id: _.in(arr),
      })
      .field({
        _id: false,
        fileId: true,
      })
      .get()
    item.imgList = sres.data
  })
  return res
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
  return Object.assign(titleCon, otherCon)
}
