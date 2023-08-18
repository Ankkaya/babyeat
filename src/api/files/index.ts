import callFunction from '@/utils/request'
/**
 * 图片管理
 * @description 图片管理
 * @param {Function} uploadImg 上传图片
 * @param {Function} delUploadedImg 删除图片
 */
// 上传图片
const uploadImg = (data) => callFunction({ name: 'uploadImg', ...data })

// 删除图片
const delUploadedImg = (data) => callFunction({ name: 'selectDetail', ...data })

export { uploadImg, delUploadedImg }
