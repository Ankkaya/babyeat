<template>
  <view class="my">
    <view class="base">
      <image class="bg" src="https://img.yzcdn.cn/vant/cat.jpeg"></image>
      <view class="info" @click="clickAuthFn">
        <nut-avatar :size="80">
          <img class="avatar" src="https://img.yzcdn.cn/vant/cat.jpeg" />
        </nut-avatar>
        <view class="nickname">Ankkaya</view>
      </view>
    </view>
    <view class="card">
      <nut-cell-group>
        <template v-for="item in menus">
          <nut-cell :title="item.label" is-link />
        </template>
      </nut-cell-group>
    </view>
  </view>
  <nav-bar></nav-bar>
</template>

<script setup>
import './index.scss'
import { ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'

const menus = ref([
  {
    label: '点赞👍',
  },
  {
    label: '收藏💗',
  },
])

const clickAuthFn = () => {
  Taro.getUserProfile({
    desc: '展示用户基础信息',
    success: (res) => {
      console.log(res)
    },
    fail: (err) => {
      console.log(err)
    },
  })
}
onMounted(() => {})
</script>
