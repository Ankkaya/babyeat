import Taro from '@tarojs/taro'
function callFunction(data) {
  return new Promise((resolve, reject) => {
    Taro.showLoading({ title: '加载中...' })
    Taro.cloud.callFunction({
      name: 'quickstartFunctions',
      data: data,
      success: (res) => {
        console.log(res)
        Taro.hideLoading()
        resolve(res.result)
      },
      fail: (err) => {
        console.error('[云函数] [login] 调用失败', err)
        reject(err)
      },
      complete: () => {
        console.log('callFunction complete')
      },
    })
  })
}

export default callFunction
