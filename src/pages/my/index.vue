<template>
  <view class="my">
    <view class="base">
      <image class="bg" :src="!!userInfo ? userInfo.avatarUrl : noImg"></image>
      <view class="info" @click="clickAuthFn">
        <nut-avatar :size="80">
          <img class="avatar" :src="!!userInfo ? userInfo.avatarUrl : noImg" />
        </nut-avatar>
        <view class="nickname">{{ !!userInfo ? userInfo.nickName : '未登录' }}</view>
      </view>
    </view>
    <view class="card">
      <nut-cell-group>
        <template v-for="item in menus">
          <nut-cell @click="clickCellFn(item)" :title="item.label" is-link />
        </template>
      </nut-cell-group>
      <view @click="clickLogoutFn" v-if="userInfo">
        <nut-cell title="退出登陆📴" />
      </view>
    </view>
  </view>
  <nav-bar></nav-bar>
</template>

<script setup>
import './index.scss'
import { ref, onMounted } from 'vue'
import Taro, { clearStorageSync } from '@tarojs/taro'
import { setStorageSync, getStorageSync } from '@/utils/storage'
import { getOpenId, selectUser, insertUser, updateUser } from '@/api/user'
const menus = ref([
  {
    label: '点赞👍',
  },
  {
    label: '收藏💗',
  },
  {
    label: '我的提交📝',
  },
])
const noImg = require('@/assets/imgs/default-avatar.png')

// 点击cell
const clickCellFn = (item) => {
  if (!userInfo.value) {
    Taro.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 2000,
    })
    return
  }
}
// 退出登录
const clickLogoutFn = () => {
  Taro.showModal({
    title: '提示',
    content: '确定退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        clearStorageSync()
        userInfo.value = null
      }
    },
  })
}
// 用户信息
const userInfo = ref(null)

const clickAuthFn = () => {
  if (!userInfo.value) {
    Taro.getUserProfile({
      desc: '展示用户基础信息',
      success: (res) => {
        getOpenId().then(async (sres) => {
          let { data: userInfoRes } = await selectUser({ openid: sres.openid })
          if (!userInfoRes) {
            // 添加用户
            insertUser({ openid: sres.openid, ...res.userInfo }).then((res) => {
              useLoginSuccessDo(res)
            })
          } else {
            // 更新用户
            updateUser({ openid: sres.openid, ...res.userInfo }).then((res) => {
              console.log(res)
              useLoginSuccessDo(res)
            })
          }
        })
      },
      fail: (err) => {
        console.log(err)
      },
    })
  }
}
const useLoginSuccessDo = (res) => {
  setStorageSync('userInfo', res.data)
  userInfo.value = res.data
  Taro.showToast({
    title: '登录成功',
    icon: 'success',
    duration: 2000,
  })
}
Taro.useDidShow(() => {
  userInfo.value = getStorageSync('userInfo')
})
onMounted(() => {})
</script>
