<template>
  <nut-image-preview :show="showPreview" :images="imgData" @close="hideFn" />
  <view class="details">
    <nut-swiper @change="changeSwiperFn">
      <template v-for="item in snacksInfo.imgList">
        <nut-swiper-item @click="clickSwiperFn">
          <image class="img" :src="item.fileId" mode="widthFix" />
        </nut-swiper-item>
      </template>
      <template v-slot:page>
        <div class="page">{{ currentIndex + 1 }}/{{ snacksInfo?.imgList?.length }}</div>
      </template>
    </nut-swiper>
    <view class="content-one">
      <view class="price">
        <view class="price-text">参考金额</view>
        <nut-price class="price-num" :price="snacksInfo?.price" :decimal-digits="2" thousands symbol="￥" />
      </view>
      <view class="title">
        {{ snacksInfo?.title }}
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
            <template v-for="item in paramsOther">
              <view class="params-item">
                <view class="params-item-title">{{ item?.label }}</view>
                <view class="params-item-con">{{ snacksInfo && snacksInfo[item.key] }}</view>
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
          <view class="addr" @click="clickNavFn">
            <template v-if="snacksInfo?.addressInfo?.name">
              {{ snacksInfo.addressInfo.address + ' ' + snacksInfo.addressInfo.name }}
            </template>
            <template v-else> 暂无地址信息 </template>
          </view>
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
import Taro, { setStorageSync } from '@tarojs/taro'
import { useGoodsStore, useBaseStore } from '@/store'
import { onMounted } from 'vue'
import { selectDetail } from '@/api/goods'
import { updateUser, selectUser } from '@/api/user'
import { getStorageSync } from '@/utils/storage'
import { storeToRefs } from 'pinia'

// 获取类别列表
const paramsOther = useGoodsStore().choosedTags
/**
 * 获取零食详情
 * @description 获取零食详情
 * @param {Function} useGetItemDetail 获取零食详情
 */
const snacksInfo = ref({})
const useGetItemDetail = async (id) => {
  await selectDetail({ id: id }).then((res) => {
    snacksInfo.value = res.data
  })
}

const imgData = ref([])
const showPreview = ref(false)
const currentIndex = ref(0)
// 轮播图切换事件
const changeSwiperFn = (e) => {
  currentIndex.value = e
}

// 轮播图点击事件
const clickSwiperFn = () => {
  imgData.value = snacksInfo.value.imgList.map((item) => ({ src: item.fileId }))
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
    value: false,
  },
  {
    icon: 'star-n',
    iconActive: 'star-fill-n',
    label: '收藏啦',
    value: false,
  },
])

// 获取状态
const useGetStatus = () => {
  selectUser({ openid: userInfo.openid }).then((res) => {
    bottomControlBtns.value[1].value = res.data.like.includes(snacksInfo.value._id)
    bottomControlBtns.value[2].value = res.data.collect.includes(snacksInfo.value._id)
    console.log(bottomControlBtns.value)
  })
}

const bcbClickFn = (index, item) => {
  if (index === 0) {
    clickNavFn()
  } else {
    if (!useJudgeBottomClick()) return
    let obj = {
      callType: '',
      value: !item.value,
      goodsId: snacksInfo.value._id,
      id: getStorageSync('userInfo')._id,
      openid: getStorageSync('userInfo').openid,
    }
    // 点赞或取消赞
    if (index === 1) {
      obj.callType = 'like'
      updateUser(obj).then((res) => {
        useBottomControl(item, res)
      })
    }
    // 收藏或取消收藏
    if (index === 2) {
      obj.callType = 'collect'
      updateUser(obj).then((res) => {
        useBottomControl(item, res)
      })
    }
  }
}

const { lastChooseTabIndex } = storeToRefs(useBaseStore())

// 判断底部点击状态
const useJudgeBottomClick = () => {
  // 判断用户信息是否存在
  if (!getStorageSync('userInfo')) {
    Taro.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 2000,
    })
    lastChooseTabIndex.value = 1
    setTimeout(() => {
      Taro.navigateTo({
        url: '/pages/my/index',
      })
    }, 800)
  } else {
    return true
  }
}
const useBottomControl = (item, res) => {
  item.value = !item.value
  Taro.showToast({
    title: item.value ? '操作成功' : '取消成功',
    icon: 'success',
    duration: 2000,
  })
  setStorageSync('userInfo', res.data)
}

// 地图导航
const clickNavFn = () => {
  if (snacksInfo?.addressInfo?.name) {
    Taro.openLocation({
      latitude: snacksInfo.value.addressInfo.latitude,
      longitude: snacksInfo.value.addressInfo.longitude,
      name: snacksInfo.value.addressInfo.name,
      address: snacksInfo.value.addressInfo.address,
    })
  }
}

const userInfo = getStorageSync('userInfo')
onMounted(async () => {
  console.log('goods/detail mounted')
  await useGetItemDetail(useGoodsStore().goodsId)
  // 如果用户信息存在，获取状态
  if (userInfo) {
    useGetStatus()
  }
})
</script>
