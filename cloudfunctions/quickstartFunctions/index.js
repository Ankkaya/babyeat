const getOpenId = require('./getOpenId/index')
const getMiniProgramCode = require('./getMiniProgramCode/index')
const createCollection = require('./createCollection/index')
const updateRecord = require('./updateRecord/index')
const sumRecord = require('./sumRecord/index')
const selectTags = require('./selectTags/index')
const uploadImg = require('./uploadImg/index')
// 商品
const selectRecord = require('./selectRecord/index')
const selectDetail = require('./selectDetail/index')
const insertGoods = require('./insertGoods/index')

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'getOpenId':
      return await getOpenId.main(event, context)
    case 'getMiniProgramCode':
      return await getMiniProgramCode.main(event, context)
    case 'createCollection':
      return await createCollection.main(event, context)
    case 'updateRecord':
      return await updateRecord.main(event, context)
    case 'sumRecord':
      return await sumRecord.main(event, context)
    case 'selectTags':
      return await selectTags.main(event, context)
    case 'uploadImg':
      return await uploadImg.main(event, context)
    case 'selectRecord':
      return await selectRecord.main(event, context)
    case 'insertGoods':
      return await insertGoods.main(event, context)
    case 'selectDetail':
      return await selectDetail.main(event, context)
  }
}
