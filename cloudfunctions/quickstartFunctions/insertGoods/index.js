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
    title: event.data.title,
    price: event.data.price ?? 0,
    category: event.data.category,
    location: event.data.location,
    sugar: event.data.sugar,
    salt: event.data.salt,
    wrapper: event.data.wrapper,
    age: event.data.age,
    imgList: event.data.imgList,
    addressInfo: event.data.addressInfo,
  }
}
