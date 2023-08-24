import callFunction from '@/utils/request'

/**
 * 用户信息管理
 * @description 获取，插入，更新，删除
 */

// 获取 openId
const getOpenId = () => callFunction({ type: 'getOpenId' })

// 获取用户信息
const selectUser = (data: any) => callFunction({ type: 'selectUser', ...data })
// 插入用户信息
const insertUser = (data: any) => callFunction({ type: 'insertUser', ...data })
// 更新用户信息
const updateUser = (data: any) => callFunction({ type: 'updateUser', ...data })
// 删除用户信息
const deleteUser = (data: any) => callFunction({ type: 'deleteUser', ...data })

export { getOpenId, selectUser, insertUser, updateUser, deleteUser }
