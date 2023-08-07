<template>
  <view class="details">
    <nut-swiper>
      <template v-for="item in items">
        <nut-swiper-item>
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
        <nut-price :price="info.price" :decimal-digits="2" thousands symbol="￥" />
      </view>
      <view class="title">
        {{ info.title }}
      </view>
    </view>
    <view class="content-two">
      <view class="details">
        <view class="title"> 详情 </view>
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
    </view>
  </view>
</template>

<script setup>
import './index.scss'
import { Tips } from '@nutui/icons-vue-taro'
import { ref } from 'vue'
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
</script>
