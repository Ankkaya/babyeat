import Taro from '@tarojs/taro'
// 防抖函数
export function debounce(fn: Function, delay: number) {
  let timer: any = null
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(fn, delay)
  }
}

// 生成时间标识 年_月_日_时_分_秒
export function getTimeStamp() {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDay()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${year}_${month}_${day}_${hour}_${minute}_${second}`
}

// 消息提示
export function showToast(title, icon = 'none') {
  Taro.showToast({
    title,
    //@ts-ignore
    icon,
    duration: 2000,
  })
}
