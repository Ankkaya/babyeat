import { createApp } from 'vue'
import Taro from '@tarojs/taro'
import { setupStore } from './store'
import hdm from './hdm'
import './app.scss'

const App = createApp({
  onLaunch() {
    Taro.cloud.init({
      env: 'cloud1-5g34jakm84d4e646',
      traceUser: true,
    })
  },
  onShow(options) {},
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
setupStore(App)
App.use(hdm)
export default App
