<template>
  <nut-overlay
    v-model:visible="showOverlay"
    :lock-scroll="true"
    z-index="500"
    @click="handleOverlayClick"
  ></nut-overlay>
  <view class="index">
    <view class="search">
      <nut-searchbar v-model="searchValue" @change="handleSearchChange">
        <template v-slot:leftin>
          <Search2 />
        </template>
      </nut-searchbar>
    </view>
    <!-- 标签分类 -->
    <view class="filter">
      <view class="tag-list">
        <template v-for="(item, index) in tagList">
          <view class="tag-item" @click="handleTagClick(item, index)">
            <view :class="['tag-item-text', item.chooseLabel ? 'choosed' : '']">{{
              item.chooseLabel ?? item.label
            }}</view>
            <DownArrow
              :class="['tag-item-icon', item.active ? 'tag-item-icon-rotate' : '', item.chooseLabel ? 'choosed' : '']"
            />
          </view>
        </template>
      </view>
      <view class="tag-list-detail" v-if="showOverlay">
        <view class="details">
          <template v-for="(item, index) in tagList[currentTagIndex].value">
            <view class="item" @click="handleClickChooseTag(item, index)">
              <JoySmile class="joy-smile" v-if="item.active" />
              <view class="tag-list-detail-item">{{ item.label }}</view>
            </view>
          </template>
        </view>
        <view class="details-control">
          <nut-button class="btn" @click="handleClickReset">重置</nut-button>
          <nut-button type="danger" class="btn" @click="handleClickConfirm">确定</nut-button>
        </view>
      </view>
    </view>
    <view class="content">
      <template v-if="itemList.length > 0">
        <template v-for="(item, index) in itemList">
          <view class="card" @click="handleClickNav">
            <!-- 添加长按事件 -->
            <image
              class="img"
              :src="item.imgUrl"
              mode="scaleToFill"
              :animation="animationShake"
              @longpress="handleLongPress(index)"
            />
            <view class="details">
              <view class="title">
                {{ item.title }}
              </view>
              <view class="tags">
                <template v-for="sitem in item.tags">
                  <view class="tag">{{ sitem }}</view>
                </template>
              </view>
              <view class="price">
                <view class="price-text">参考金额</view>
                <nut-price class="price-num" :price="item.price" :decimal-digits="2" thousands symbol="¥" />
              </view>
            </view>
          </view>
        </template>
      </template>
      <template> <nut-empty description="暂无数据"></nut-empty></template>
    </view>
  </view>
  <view class="add" @click="clickAddFn">
    <Uploader class="uploader" />
  </view>
</template>

<script setup>
import './index.scss'
import { $ } from '@tarojs/extend'
import { ref, onMounted, toRefs, watchEffect } from 'vue'
import { Search2, DownArrow, Check, JoySmile, Uploader } from '@nutui/icons-vue-taro'
import { debounce } from '@/utils'
import {
  usePullDownRefresh,
  useReachBottom,
  stopPullDownRefresh,
  componentDidMount,
  nextTick,
  createSelectorQuery,
  navigateTo,
} from '@tarojs/taro'
const itemList = ref([])
usePullDownRefresh(() => {
  stopPullDownRefresh({
    complete: () => {
      console.log('下拉刷新')
    },
  })
})

useReachBottom(() => {
  console.log('上拉加载')
})

/**
 * 获取商品列表
 */
const useGetItemList = () => {
  wx.cloud.callFunction({
    name: 'quickstartFunctions',
    data: {
      type: 'selectRecord',
      title: searchValue.value,
    },
    success: (res) => {
      console.log('[云函数] [login] user openid: ', res)
      itemList.value = res.result.data
    },
    fail: (err) => {
      console.error('[云函数] [login] 调用失败', err)
    },
  })
}

const searchValue = ref('')
const debounceSearch = debounce(useGetItemList, 1000)
const handleSearchChange = (value) => {
  searchValue.value = value
  debounceSearch()
}

/**
 * 长按图片动画
 * @description 长按图片后，为图片添加动画，左右抖动
 */
const animationShake = ref()
const handleLongPress = (index) => {
  // 震动手机
  wx.vibrateShort({
    type: 'medium',
  })
  const animation = wx.createAnimation({
    duration: 10000,
    timingFunction: 'ease',
  })
  animation
    .translateX(-100)
    .step()
    .translateX(100)
    .step()
    .translateX(-100)
    .step()
    .translateX(100)
    .step()
    .translateX(-100)
    .step()
    .translateX(0)
    .step()
  animationShake.value = animation.export()
}

/**
 * 分类逻辑
 * @description 选择分类，以及分类具体项目
 * @param {Boolean} showOverlay 是否显示遮罩
 * @param {Array} tagList 分类列表
 * @param {Number} currentTagIndex 当前选择的分类索引
 * @param {Function} useGetTagList 获取分类列表
 * @param {Function} handleTagClick 分类点击事件
 * @param {Function} handleClickChooseTag 详情点击事件
 * @param {Function} handleOverlayClick 遮罩点击事件
 */
// 设置遮罩
const showOverlay = ref(false)
// 分类列表
const tagList = ref([])
// 当前选择的分类索引
const currentTagIndex = ref(-1)
// 获取分类列表
const useGetTagList = () => {
  wx.cloud.callFunction({
    name: 'quickstartFunctions',
    data: {
      type: 'selectTags',
    },
    success: (res) => {
      console.log('[云函数] [login] user openid: ', res)
      // 分类添加 active 属性
      res.result.data.forEach((item) => {
        item.active = false
      })
      // 获取当前分类下的详情，添加是否选中的属性
      res.result.data.forEach((data) => {
        data.value = data.value.map((sdata) => {
          return {
            label: sdata,
            chooseLabel: '',
            active: false,
          }
        })
      })
      tagList.value = res.result.data
      nextTick(() => {
        $('.tag-item-text').forEach(async (item) => {
          item.style.maxWidth = (await $(item).width()) + 'px'
        })
        // const query = createSelectorQuery()
        // query.selectAll('#tagId').boundingClientRect()
        // query.exec((sres) => {
        //   sres.forEach((titem) => {
        //     titem.maxWidth = titem.width + 'px'
        //   })
        // })
      })
    },
    fail: (err) => {
      console.error('[云函数] [login] 调用失败', err)
    },
  })
}

// 获取分类下详情
const handleTagClick = (item, index) => {
  currentTagIndex.value = index
  if (item.active) {
    showOverlay.value = false
    item.active = false
  } else {
    // 重置所有分类的 active 属性
    tagList.value.forEach((sitem) => {
      sitem.active = false
    })
    item.active = true
    showOverlay.value = true
  }
}
// 详情点击事件
const handleClickChooseTag = (item) => {
  item.active = !item.active
}
// 确定按钮点击事件
const handleClickConfirm = () => {
  // 隐藏遮罩
  showOverlay.value = false
  tagList.value[currentTagIndex.value].active = false
}
// 重置按钮点击事件
const handleClickReset = () => {
  // 重置当前分类的 active 属性
  tagList.value[currentTagIndex.value].value.forEach((item) => {
    item.active = false
  })
}

// 追踪分类详情的选择
watchEffect(() => {
  if (currentTagIndex.value === -1) return
  let activeItems = tagList.value[currentTagIndex.value]?.value.filter((item) => item.active)
  console.log(activeItems)
  if (activeItems?.length > 0) {
    tagList.value[currentTagIndex.value].chooseLabel = activeItems.map((item) => item.label).join('、')
  } else {
    tagList.value[currentTagIndex.value].chooseLabel = null
  }
})

// 遮罩点击事件
const handleOverlayClick = () => {
  // 隐藏遮罩
  showOverlay.value = false
  // 重置所有分类的 active 属性
  tagList.value.forEach((item) => {
    item.active = false
  })
}

// 点击跳转到详情页
const handleClickNav = () => {
  wx.navigateTo({
    url: '/pages/goods/details/index',
  })
}

/**
 * 添加零食
 * @description 点击添加零食按钮，跳转到添加零食页面
 */
const clickAddFn = () => {
  navigateTo({
    url: '/pages/goods/add/index',
  })
}

onMounted(() => {
  console.log('onMounted')
  useGetItemList()
  useGetTagList()
})
</script>
