<template>
  <view class="my">
    <view>
      <template v-for="(item, index) in list">
        <view>{{ item.title }}</view>
      </template>
    </view>
    <view class="base">
      <image class="bg" :src="!!userInfo ? userInfo.avatarUrl : noImg"></image>
      <view class="info" @click="clickAuthFn">
        <nut-avatar :size="80">
          <img class="avatar" :src="!!userInfo ? userInfo.avatarUrl : noImg" />
        </nut-avatar>
        <view class="nickname">{{ !!userInfo ? userInfo.nickName : '未登录' }}</view>
      </view>
    </view>
    <!-- 发布，点赞，收藏记录 -->
    <scroll-view type="custom" style="height: 100%" :scroll-y="true" :push-pinned-header="true" class="content">
      <sticky-section>
        <nut-sticky class="sticky-menus">
          <template v-for="item in menus">
            <view>{{ item.label }}</view>
          </template>
        </nut-sticky>
        <list-view>
          <view
            v-for="item of [
              1, 2, 3, 4, 5, 4, 4, 4, 4, 1, 2, 3, 4, 5, 4, 4, 4, 4, 1, 2, 3, 4, 5, 4, 4, 4, 4, 1, 2, 3, 4, 5, 4, 4, 4,
              4,
            ]"
          >
            {{ item }}
            {{ item }}
          </view>
        </list-view>
      </sticky-section>
    </scroll-view>
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
import { selectGoods } from '@/api/goods'
const menus = ref([
  {
    label: 'Likes',
    key: 'like',
  },
  {
    label: 'Collects',
    key: 'collect',
  },
  {
    label: 'Posts',
    key: 'submit',
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
  } else {
    useGetList(item.key)
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

/**
 * 查询列表
 */
const list = ref([])
const useGetList = (key) => {
  selectGoods({
    ids: userInfo.value[key],
    pageNum: 1,
    pageSize: 10,
    title: '',
  }).then((res) => {
    list.value = res.data
  })
}
onMounted(() => {})
</script>
