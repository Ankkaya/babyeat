<template>
  <view class="add">
    <nut-form ref="formRef" :rules="rules" :model-value="formData2">
      <nut-form-item label="商品名称" prop="title">
        <nut-input class="form-input" v-model="formData2.title" placeholder="请输入商品名称 " :border="false" />
      </nut-form-item>
      <nut-form-item label="参考价" prop="price">
        <nut-input placeholder="请输入参考价" v-model="formData2.price" type="digit" :border="false" />
      </nut-form-item>
      <nut-form-item label="类别" prop="category">
        <nut-input
          v-model="formData2.category"
          @click="clickShowFn('category')"
          readonly
          placeholder="请选择类别"
          type="text"
          :border="false"
        />
      </nut-form-item>
      <nut-form-item label="产地" prop="location">
        <nut-input
          v-model="formData2.location"
          @click="clickShowFn('location')"
          readonly
          placeholder="请选择产地"
          type="text"
          :border="false"
        />
      </nut-form-item>
      <nut-form-item label="是否含糖" prop="sugar">
        <nut-radio-group direction="horizontal" v-model="formData2.sugar">
          <template v-for="item in sugarList">
            <nut-radio :label="item.label">{{ item.label }}</nut-radio>
          </template>
        </nut-radio-group>
      </nut-form-item>
      <nut-form-item label="是否含盐" prop="salt">
        <nut-radio-group direction="horizontal" v-model="formData2.salt">
          <template v-for="item in saltList">
            <nut-radio :label="item.label">{{ item.label }}</nut-radio>
          </template>
        </nut-radio-group>
      </nut-form-item>
      <nut-form-item label="包装" prop="wrapper">
        <nut-input
          v-model="formData2.wrapper"
          @click="clickShowFn('wrapper')"
          readonly
          placeholder="请选择包装"
          type="text"
          :border="false"
        />
      </nut-form-item>
      <nut-form-item label="适用年龄" prop="age">
        <nut-input
          v-model="formData2.age"
          @click="clickShowFn('age')"
          readonly
          placeholder="请选择适用年龄"
          type="text"
          :border="false"
        />
      </nut-form-item>
      <nut-form-item label="商品图片" prop="imgList">
        <nut-uploader
          ref="uploaderRef"
          accept="image/*"
          v-model:file-list="formData2.imgList"
          :before-xhr-upload="beforeXhrUpload"
          maximum="3"
          multiple
        >
        </nut-uploader>
      </nut-form-item>
      <nut-form-item label="地址">
        <!-- <nut-input
          class="address"
          v-model="formData2.address"
          @click="clickChooseAddr"
          placeholder="请选择地址"
          type="text"
        /> -->
        <view class="addr-wrapper">
          <!-- 地址不适合滚动动画 -->
          <!-- 内容过多，换行处理 -->
          <!-- <view
            :class="['addr-content', wrapContentClass]"
            :style="contentStyle"
            @click="clickChooseAddr"
            @animationend="onAnimationEnd"
            @webkit-animation-end="onAnimationEnd"
            >{{ formData2.address }}</view
          > -->
          <view class="addr-content" @click="clickChooseAddr">
            {{ formData2.addressInfo.address + ' ' + formData2.addressInfo.name }}
          </view>
        </view>
      </nut-form-item>
    </nut-form>
    <view class="bottom-control">
      <nut-button style="width: 100%" type="primary" @click="clickConfirmFn">确定</nut-button>
    </view>
    <nut-action-sheet
      v-model:visible="actionSheetVisible"
      :menu-items="menuItems"
      option-tag="label"
      @choose="chooseItemFn"
    ></nut-action-sheet>
  </view>
</template>
<script setup>
import './index.scss'
import { ref, onMounted, computed, watch } from 'vue'
import { useGoodsStore } from '@/store'
import { getTimeStamp } from '@/utils'
import { $ } from '@tarojs/extend'
const rules = ref({
  title: [
    {
      required: true,
      message: '请输入商品名称',
    },
  ],
  category: [
    {
      required: true,
      message: '请选择商品类别',
    },
  ],
  location: [
    {
      required: true,
      message: '请选择产地',
    },
  ],
  wrapper: [
    {
      required: true,
      message: '请选择包装',
    },
  ],
  age: [
    {
      required: true,
      message: '请选择适用年龄',
    },
  ],
  imgList: [
    {
      message: '请上传商品图片',
      validator: () => {
        return formData2.value.imgList.length > 0
      },
    },
  ],
})
const formData2 = ref({
  title: '',
  price: '',
  category: '',
  location: '',
  sugar: '',
  salt: '',
  wrapper: '',
  age: '',
  addressInfo: {
    name: '',
    address: '点击选择地址',
    longitude: '',
    latitude: '',
  },
  imgList: [],
})
const formRef = ref(null)
const choosedTags = useGoodsStore().choosedTags
const findListByKey = (key) => {
  const list = choosedTags.find((item) => item.key === key)
  return list?.value || []
}
// 表单相关列表数据
const saltList = findListByKey('salt')
const sugarList = findListByKey('sugar')
const currentKey = ref('')

// 选择地址
const clickChooseAddr = async () => {
  if (await isOverflow()) {
    options.value.duration = options.value.contentWidth / options.value.speed
    options.value.animationClass = 'play'
  }
  wx.chooseLocation({
    success: (res) => {
      formData2.value.addressInfo.name = res.name
      formData2.value.addressInfo.address = res.address
      formData2.value.addressInfo.longitude = res.longitude
      formData2.value.addressInfo.latitude = res.latitude
    },
  })
}

/**
 * 输入框点击事件
 * @description: 点击输入框时，显示对应选择器
 */
const clickShowFn = (type) => {
  actionSheetVisible.value = true
  menuItems.value = findListByKey(type)
  currentKey.value = type
}

/**
 * 动作面板
 * @description: 点击输入框时，显示对应选择器
 */
const actionSheetVisible = ref(false)
const menuItems = ref([])
const chooseItemFn = (item) => {
  formData2.value[currentKey.value] = item.label
}

// 上传图片
const uploaderRef = ref()
const beforeXhrUpload = (file, options) => {
  let index = formData2.value.imgList.length - 1
  formData2.value.imgList[index].status = 'uploading'
  formData2.value.imgList[index].message = '上传中...'
  wx.getFileSystemManager().readFile({
    filePath: options.taroFilePath,
    encoding: 'base64',
    success: (res) => {
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'uploadImg',
          cloudPath: 'img_' + getTimeStamp() + '.png',
          file: res.data,
        },
        success: (res) => {
          formData2.value.imgList[index].status = 'success'
          formData2.value.imgList[index].message = '上传成功'
          formData2.value.imgList[index].id = res.result.data
        },
        fail: (err) => {
          formData2.value.imgList[index].status = 'error'
          formData2.value.imgList[index].message = '上传失败'
          console.error('[云函数] [login] 调用失败', err)
        },
      })
    },
  })
}

// 表单提交
const clickConfirmFn = () => {
  formRef.value.validate().then((valid, errors) => {
    if (valid) {
      let obj = JSON.parse(JSON.stringify(formData2.value))
      obj.imgList = obj.imgList.map((item) => item.id)
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'insertGoods',
          data: obj,
        },
        success: (res) => {
          console.log(res)
        },
        fail: (err) => {
          console.error('[云函数] [login] 调用失败', err)
        },
      })
    } else {
      console.log('error submit!!', errors)
    }
  })
}

/**
 * 地址超出滚动动画
 */
const options = ref({
  speed: 50,
  duration: 0,
  animationClass: '',
  contentWidth: 0,
  wrapperWidth: 0,
  delay: 0.5,
  firstRound: true,
  id: Math.round(Math.random() * 100000),
})
// 判断内容是否溢出
const isOverflow = async () => {
  options.value.wrapperWidth = await $('.addr-wrapper').width()
  options.value.contentWidth = await $('.addr-content').width()
  return options.value.contentWidth > options.value.wrapperWidth
}

const wrapContentClass = computed(() => {
  return {
    [`content${options.value.id}`]: true,
    [options.value.animationClass]: true,
  }
})

const contentStyle = computed(() => {
  return {
    animationDelay: (options.value.firstRound ? options.value.delay : 0) + 's',
    animationDuration: options.value.duration + 's',
    transform: `translateX(${options.value.firstRound ? 0 : options.value.wrapperWidth + 'px'})`,
  }
})

watch(
  () => formData2.value.address,
  async (newVal, oldVal) => {
    if (newVal) {
      if (await isOverflow()) {
        options.value.duration = options.value.contentWidth / options.value.speed
        options.value.animationClass = 'play-infinite'
      } else {
        options.value.animationClass = ''
      }
    }
  }
)

const onAnimationEnd = (event) => {
  options.value.firstRound = false
  setTimeout(() => {
    options.value.duration = (options.value.contentWidth + options.value.wrapperWidth) / options.value.speed
    options.value.animationClass = 'play-infinite'
  }, 0)
}

onMounted(() => {})
</script>
