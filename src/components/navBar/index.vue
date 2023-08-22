<template>
  <nut-tabbar bottom safe-area-inset-bottom placeholder @tab-switch="tabSwitchFn" v-model="active">
    <nut-tabbar-item v-for="(item, index) in list" :tab-title="item.title" :icon="item.icon"> </nut-tabbar-item>
  </nut-tabbar>
</template>
<script setup>
import { h, ref, computed } from 'vue'
import { useBaseStore } from '@/store'
import { storeToRefs } from 'pinia'
import { Home, My } from '@nutui/icons-vue-taro'
import Taro from '@tarojs/taro'

const { lastChooseTabIndex } = storeToRefs(useBaseStore())

const list = ref([
  {
    title: '首页',
    icon: h(Home),
    to: '/pages/index/index',
  },
  {
    title: '我的',
    icon: h(My),
    to: '/pages/my/index',
  },
])

const active = computed(() => {
  return lastChooseTabIndex.value
})
const tabSwitchFn = (item, index) => {
  if (index === lastChooseTabIndex.value) return
  lastChooseTabIndex.value = index
  Taro.reLaunch({
    url: list.value[index].to,
  })
}
</script>
