import Taro from '@tarojs/taro'
function callFunction(data) {
  return new Promise((resolve, reject) => {
    Taro.cloud.callFunction({
      name: 'quickstartFunctions',
      data: data,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

export default callFunction
