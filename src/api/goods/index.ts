import callFunction from '@/utils/request'

/**
 * 商品管理
 * @description 新增，查询，详情，类别
 * @param {Function} addGoods 新增商品
 * @param {Function} selectGoods 查询商品
 * @param {Function} selectDetail 查询商品详情
 */

// 商品类别
const selectTags = (data) => callFunction({ type: 'selectTags', ...data })

// 新增商品
const addGoods = (data) => callFunction({ type: 'insertGoods', ...data })

// 查询商品
const selectGoods = (data) => callFunction({ type: 'selectRecord', ...data })

// 查询商品详情
const selectDetail = (data) => callFunction({ type: 'selectDetail', ...data })

export { addGoods, selectGoods, selectDetail, selectTags }
