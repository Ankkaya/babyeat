const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
const db = cloud.database()

// 查询数据库集合
exports.main = async (event, context) => {
  await db.collection('goods').add({ data: jointParams(event) })
  return {
    sucess: true,
  }
}

function jointParams(event) {
  return {
    title: event.title,
    price: event.price ?? 0,
    category: event.category,
    location: event.location,
    sugar: event.sugar,
    salt: event.salt,
    wrapper: event.wrapper,
    age: event.age,
    imgList: event.imgList,
    addressInfo: event.addressInfo,
  }
}
