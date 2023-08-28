import { createApp } from 'vue'
import Taro from '@tarojs/taro'
import { setupStore } from './store'
import hdm from './hdm'
import './app.scss'
import { selectUser } from './api/user'
import { getStorageSync, setStorageSync } from './utils/storage'

const App = createApp({
  onLaunch() {
    Taro.cloud.init({
      env: 'cloud1-5g34jakm84d4e646',
      traceUser: true,
    })
    Taro.getSkylineInfo({
      success: (res) => {
        console.log(res)
      },
    })
  },
  onShow(options) {
    if (getStorageSync('userInfo')) {
      // 每次打开应用，获取最新用户信息
      selectUser({ openid: getStorageSync('userInfo').openid }).then((res: any) => {
        setStorageSync('userInfo', res.data)
      })
    }
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
setupStore(App)
App.use(hdm)
export default App
