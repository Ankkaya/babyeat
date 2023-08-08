<template>
  <map
    id="myMap"
    style="width: 100%; height: 300px"
    :longitude="longitude"
    :latitude="latitude"
    scale="16"
    :polyline="polyline"
    show-location
  >
  </map>
  <view class="map-view-container">
    <view class="map-view-content">
      <view class="introduce"
        >腾讯位置服务路线规划插件提供路线规划等功能，根据起终点，多种出行方式智能规划最佳出行路线及详情。开发者可以将路线规划插件嵌入到自建小程序的页面里，实现路线规划功能。</view
      >
    </view>
    <view class="feature-container">
      <view class="feature-content border-bottom border-top">
        <text class="feature-label">起点位置</text>
        <view class="feature-txt">
          <text class="point active">{{ startPoint.name }}</text>
        </view>
      </view>
      <view class="feature-content border-bottom">
        <text class="feature-label">终点位置</text>
        <view class="feature-txt">
          <text class="active point">{{ endPoint.name }}</text>
        </view>
      </view>
      <view class="feature-content border-bottom">
        <text class="feature-label">出行方式</text>
        <view class="feature-txt">
          <view
            @click="onSelectMode"
            :class="[modeIndex === index ? 'active feature-txt-item' : 'feature-txt-item']"
            v-for="item in modes"
          >
            {{ item.text }}
          </view>
        </view>
      </view>
      <button @click="onStartNav">开始导航</button>
    </view>
  </view>
</template>

<script setup>
import QQMapWX from '../../utils/qqmap-wx-jssdk.min.js'
import { onMounted, ref } from 'vue'
import Taro from '@tarojs/taro'

const qqmapsdk = new QQMapWX({
  key: 'UPZBZ-CJECP-R4FDK-V4VM5-Q3ZGS-OBFVB',
})

onMounted(() => {
  qqmapsdk.geocoder({
    address: '北京市海淀区彩和坊路海淀西大街74号',
    success: function (res) {
      console.log(res)
    },
    fail: function (error) {
      console.error(error)
    },
  })
})

const modes = ref([
  {
    text: '驾车',
    value: 'driving',
  },
  {
    text: '步行',
    value: 'walking',
  },
  {
    text: '公交',
    value: 'transit',
  },
])
const modeIndex = ref(0)
const mapStyle = ref('BAIQIAN_KEY')
const themeColor = ref('#427cff')
const startPoint = ref({ name: '腾讯北京总部大楼', latitude: 40.040417, longitude: 116.273514 })
const endPoint = ref({ name: '北京西站', latitude: 39.894806, longitude: 116.321592 })
const polyline = ref([])
const longitude = ref('')
const latitude = ref('')
const onStartNav = () => {
  // let url =
  //   'plugin://routePlan/index?key=' +
  //   mapStyle.value +
  //   '&referer=' +
  //   '宝宝优选小食记' +
  //   '&endPoint=' +
  //   endPoint.value +
  //   '&mode=' +
  //   modes.value[modeIndex.value].value +
  //   '&navigation=' +
  //   1 +
  //   '&themeColor=' +
  //   themeColor.value +
  //   '&startPoint=' +
  //   startPoint.value
  // Taro.navigateTo({
  //   url: url,
  // })
  var _this = this
  //调用距离计算接口
  qqmapsdk.direction({
    mode: 'driving', //可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
    //from参数不填默认当前地址
    from: '40.040417,116.273514',
    to: '39.894806,116.307520',
    success: function (res) {
      console.log(res)
      var ret = res
      var coors = ret.result.routes[0].polyline,
        pl = []
      //坐标解压（返回的点串坐标，通过前向差分进行压缩）
      var kr = 1000000
      for (var i = 2; i < coors.length; i++) {
        coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr
      }
      //将解压后的坐标放入点串数组pl中
      for (var i = 0; i < coors.length; i += 2) {
        pl.push({ latitude: coors[i], longitude: coors[i + 1] })
      }
      console.log(pl)
      //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
      longitude.value = pl[0].longitude
      latitude.value = pl[0].latitude
      polyline.value = [
        {
          points: pl,
          color: '#FF0000DD',
          width: 4,
        },
      ]
    },
    fail: function (error) {
      console.error(error)
    },
    complete: function (res) {
      console.log(res)
    },
  })
}
</script>
