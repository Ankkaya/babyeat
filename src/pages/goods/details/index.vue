<template>
  <nut-image-preview :show="showPreview" :images="imgData" @close="hideFn" />
  <view class="details">
    <nut-swiper>
      <template v-for="item in items">
        <nut-swiper-item @click="clickSwiperFn">
          <image class="img" :src="item.imgUrl" mode="widthFix" />
        </nut-swiper-item>
      </template>
      <template v-slot:page>
        <div class="page">1/4</div>
      </template>
    </nut-swiper>
    <view class="content-one">
      <view class="price">
        <view class="price-text">参考金额</view>
        <nut-price class="price-num" :price="info.price" :decimal-digits="2" thousands symbol="￥" />
      </view>
      <view class="title">
        {{ info.title }}
      </view>
    </view>
    <view class="content-two">
      <view class="details">
        <view class="title"> 详情 </view>
        <view>
          <view class="param-title">
            <Tips class="param-title-tips" />
            <view class="text"> 规格参数 </view>
          </view>
          <view class="params">
            <template v-for="item in paramsList">
              <view class="params-item">
                <view class="params-item-title">{{ item.value }}</view>
                <view class="params-item-con">{{ item.key }}</view>
              </view>
            </template>
          </view>
        </view>
        <!-- 位置信息 -->
        <view>
          <view class="param-title">
            <Shop class="param-title-tips" />
            <view class="text"> 位置信息 </view>
          </view>
          <view class="addr" @click="clickNavFn"> 河南省洛阳市涧西区武汉路与西三环交叉口向西200米路南 大张超市 </view>
        </view>
      </view>
    </view>
    <view class="bottom-control">
      <template v-for="(item, index) in bottomControlBtns">
        <view class="c-item" @click="bcbClickFn(index, item)">
          <template v-if="item.value">
            <IconFont :name="item.iconActive" :class="['c-item-icon', 'c-item-icon-scale']" />
          </template>
          <template v-else>
            <IconFont :name="item.icon" :class="['c-item-icon']" />
          </template>
          <view :class="['c-item-label', item.value ? 'c-item-text-scale' : '']">{{ item.label }}</view>
        </view>
      </template>
    </view>
  </view>
</template>

<script setup>
import './index.scss'
import { IconFont } from '@nutui/icons-vue-taro'
import { Tips, Shop } from '@nutui/icons-vue-taro'
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import { useGoodsStore } from '@/store'
import { onMounted } from 'vue'

const items = ref([
  {
    imgUrl: 'https://img10.360buyimg.com/n1/jfs/t1/139559/36/33075/130633/63da3034F8d7e51ac/f6303e46856c451a.jpg',
    price: 29.9,
    title: '秋田满满 婴儿零食手指泡芙条原味宝宝零食泡芙婴儿小饼干罐装36g',
  },
  {
    imgUrl: 'https://img10.360buyimg.com/n1/jfs/t1/139559/36/33075/130633/63da3034F8d7e51ac/f6303e46856c451a.jpg',
    price: 29.9,
    title: '秋田满满 婴儿零食手指泡芙条原味宝宝零食泡芙婴儿小饼干罐装36g',
  },
])
const info = {
  price: 29.9,
  title: '秋田满满 婴儿零食手指泡芙条原味宝宝零食泡芙婴儿小饼干罐装36g',
  star: false,
  follow: false,
}
const paramsList = ref([
  {
    key: 'category',
    value: '类别',
  },
  {
    key: 'age',
    value: '适用年龄',
  },
  {
    key: 'wrapper',
    value: '包装形式',
  },
  {
    key: 'saltsaltsaltsaltsaltsaltsaltsaltsaltsaltsaltsaltsaltsaltsaltsaltsaltsaltsaltsaltsaltsalt',
    value: '是否含盐',
  },
  {
    key: 'taste',
    value: '口味',
  },
])

/**
 * 获取零食详情
 * @description 获取零食详情
 * @param {Function} useGetItemDetail 获取零食详情
 */
const useGetItemDetail = (id) => {
  wx.cloud.callFunction({
    name: 'quickstartFunctions',
    data: {
      type: 'selectRecord',
      id: id,
    },
    success: (res) => {
      console.log(res)
    },
    fail: (err) => {
      console.error('[云函数] [login] 调用失败', err)
    },
  })
}

const imgData = ref([])
const showPreview = ref(false)

// 轮播图点击事件
const clickSwiperFn = () => {
  imgData.value = items.value.map((item) => ({ src: item.imgUrl }))
  showPreview.value = true
}
// 隐藏预览图
const hideFn = () => {
  showPreview.value = false
}

/**
 * 底部控制按钮
 * @description 商品地图导航，收藏，点赞
 * @type {Ref<BottomControlBtns>} bottomControlBtns - 底部控制按钮
 * @type {Function} bcbClickFn - 底部控制按钮点击事件
 */

const bottomControlBtns = ref([
  {
    icon: 'find',
    iconActive: 'find',
    label: '我要买',
    value: false,
  },
  {
    icon: 'addfollow',
    iconActive: 'heart-fill',
    label: '点个赞吧',
    value: true,
  },
  {
    icon: 'star-n',
    iconActive: 'star-fill-n',
    label: '收藏啦',
    value: true,
  },
])
const bcbClickFn = (index, item) => {
  item.value = !item.value
  if (index === 0) {
    clickNavFn()
  }
}

// 地图导航
const clickNavFn = () => {
  Taro.openLocation({
    latitude: 34.75661,
    longitude: 113.649643,
    name: '牡丹图文',
    address: 'wuhanlu',
  })
}

onMounted(() => {
  useGetItemDetail(useGoodsStore().goodsId)
})
</script>
