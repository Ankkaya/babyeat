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
          <nut-button class="btn" @click="handleClickReset('reset')">重置</nut-button>
          <nut-button type="danger" class="btn" @click="handleClickConfirm">确定</nut-button>
        </view>
      </view>
    </view>
    <view class="content">
      <template v-if="itemList.length > 0">
        <template v-for="(item, index) in itemList">
          <view class="card" @click="handleClickNav(item)">
            <!-- 添加长按事件 -->
            <view :animation="animationShake">
              <image
                class="img"
                :src="calImgSrcFn(item.imgList)"
                mode="scaleToFill"
                @longpress="handleLongPress(index)"
              />
            </view>
            <view class="details">
              <view class="title">
                {{ item.title }}
              </view>
              <view class="tags">
                <template v-for="sitem in item.tags">
                  <view v-if="sitem" class="tag">{{ sitem }}</view>
                </template>
              </view>
              <view class="price">
                <view class="price-text">参考金额</view>
                <nut-price class="price-num" :price="item.price" :decimal-digits="2" thousands symbol="¥" />
              </view>
            </view>
          </view>
        </template>
        <template v-if="queryParams.pageNum > maxPageNum">
          <view class="bottom-no-data">-- 已经到底了 --</view>
        </template>
      </template>
      <template v-else> <nut-empty description="暂无数据"></nut-empty></template>
    </view>
  </view>
  <view class="add" @click="clickAddFn">
    <Uploader class="uploader" />
  </view>
</template>

<script setup>
import './index.scss'
import { $ } from '@tarojs/extend'
import { useDidShow } from '@tarojs/taro'
import { ref, onMounted, watchEffect, computed } from 'vue'
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
import { useGoodsStore } from '@/store'
import { storeToRefs } from 'pinia'
import noImg from '@/assets/imgs/no-img.png'
import { selectGoods, selectTags } from '@/api/goods'

const { choosedTags, goodsId } = storeToRefs(useGoodsStore())
const { setChoosedTags } = useGoodsStore()

usePullDownRefresh(async () => {
  queryParams.value.pageNum = 1
  itemList.value = []
  useGetTagList()
})

useReachBottom(() => {
  queryParams.value.pageNum++
  useGetItemList()
  console.log('上拉加载')
})

/**
 * 获取商品列表
 * @description 获取商品列表
 * @param {Array} itemList 商品列表
 * @param {Function} useGetItemList 获取商品列表
 */
const itemList = ref([])
const queryParams = ref({
  pageNum: 1,
  pageSize: 5,
})
const tagsParams = computed(() => {
  let obj = {}
  choosedTags.value.forEach((item) => {
    obj[item.key] = item.value.filter((sitem) => sitem.active).map((sitem) => sitem.label)
  })
  return obj
})

// 记录总数
const total = ref(0)
// 最大页数
const maxPageNum = computed(() => {
  return Math.ceil(total.value / queryParams.value.pageSize) === 0
    ? 1
    : Math.ceil(total.value / queryParams.value.pageSize)
})
const useGetItemList = () => {
  if (queryParams.value.pageNum > maxPageNum.value) return
  selectGoods({
    title: searchValue.value,
    tags: tagsParams.value,
    ...queryParams.value,
  }).then((res) => {
    total.value = res.total
    if (queryParams.value.pageNum <= maxPageNum.value) {
      // 分类属性统一添加到结果的 tags 属性
      res.data.forEach((item) => {
        item.tags = tagList.value.map((sitem) => item[sitem.key])
      })
      itemList.value.push(...res.data)
      console.log(itemList)
    }
    stopPullDownRefresh({
      complete: () => {
        console.log('下拉刷新结束')
      },
    })
  })
}

// 商品名称搜索
const searchValue = ref('')
const debounceSearch = debounce(useGetItemList, 1000)
const handleSearchChange = (value) => {
  searchValue.value = value
  queryParams.value.pageNum = 1
  itemList.value = []
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
    duration: 50,
    timingFunction: 'ease',
  })
  animation.translateX(-100).step().translateX(200).step().translateX(0).step()
  animationShake.value = animation.export()
  console.log(animationShake.value)
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
  selectTags().then((res) => {
    useGetItemList()
    // 分类添加 active 属性
    res.data.forEach((item) => {
      item.active = false
    })
    // 获取当前分类下的详情，添加是否选中的属性
    let arr = []
    res.data.forEach((data) => {
      data.value = data.value.map((sdata) => {
        return {
          label: sdata,
          chooseLabel: '',
          active: false,
        }
      })
      arr.push(JSON.parse(JSON.stringify(data)))
    })
    setChoosedTags(arr)
    tagList.value = res.data
    nextTick(() => {
      $('.tag-item-text').forEach(async (item) => {
        item.style.maxWidth = (await $(item).width()) + 'px'
      })
      // 小程序操作 dom 的方式
      // const query = createSelectorQuery()
      // query.selectAll('#tagId').boundingClientRect()
      // query.exec((sres) => {
      //   sres.forEach((titem) => {
      //     titem.maxWidth = titem.width + 'px'
      //   })
      // })
    })
  })
}
// 默认获取商品第一张图片
const calImgSrcFn = (imgList) => {
  if (imgList.length > 0) {
    return imgList[0].fileId
  } else {
    return noImg
  }
}

// 分类点击逻辑
const handleTagClick = (item, index) => {
  currentTagIndex.value = index
  if (item.active) {
    showOverlay.value = false
    item.active = false
    choosedTags.value[index].active = false
  } else {
    // 重置所有分类的 active 属性
    tagList.value.forEach((sitem) => {
      sitem.active = false
    })
    choosedTags.value.forEach((sitem) => {
      sitem.active = false
    })
    item.active = true
    choosedTags.value[index].active = true
    showOverlay.value = true
  }
  handleClickReset()
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
  choosedTags.value[currentTagIndex.value] = JSON.parse(JSON.stringify(tagList.value[currentTagIndex.value]))
  useGetItemList()
}
// 重置按钮点击事件
const handleClickReset = (mark) => {
  // 点击事件重置需要重置当前分类下类别详情的 active 属性为 false
  // 重置当前分类下类别的 chooseLabel 属性为 null
  if (mark === 'reset') {
    choosedTags.value[currentTagIndex.value].value.forEach((item) => {
      item.active = false
    })
    choosedTags.value[currentTagIndex.value].chooseLabel = null
  }
  tagList.value = JSON.parse(JSON.stringify(choosedTags.value))
}

// 追踪分类详情的选择
watchEffect(() => {
  if (currentTagIndex.value === -1) return
  let activeItems = tagList.value[currentTagIndex.value]?.value.filter((item) => item.active)
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
  choosedTags.value[currentTagIndex.value].active = false
  handleClickReset()
}

// 点击跳转到详情页
const handleClickNav = (item) => {
  goodsId.value = item._id
  navigateTo({
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

// onMounted(() => {
//   console.log('onMounted')
//   useGetTagList()
// })
useDidShow(() => {
  console.log('onShow')
  useGetTagList()
})
</script>
