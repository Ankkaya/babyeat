import Taro from '@tarojs/taro'

const setStorageSync = (key: string, data: any) => {
  Taro.setStorageSync(key, data)
}

const getStorageSync = (key: string) => {
  return Taro.getStorageSync(key)
}

const removeStorageSync = (key: string) => {
  Taro.removeStorageSync(key)
}

const clearStorageSync = () => {
  Taro.clearStorageSync()
}

export { setStorageSync, getStorageSync, removeStorageSync, clearStorageSync }
