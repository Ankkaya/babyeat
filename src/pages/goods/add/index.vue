<template>
  <view class="add">
    <nut-form>
      <nut-form-item label="商品名称">
        <nut-textarea
          class="title-textarea"
          v-model="formData2.title"
          placeholder="请输入商品名称"
          :rows="1"
          autosize
        />
      </nut-form-item>
      <nut-form-item label="参考价">
        <nut-input placeholder="请输入参考价" v-model="formData2.price" type="number" :border="false" />
      </nut-form-item>
      <nut-form-item label="类别">
        <nut-input @click="clickShowFn('category')" readonly placeholder="请选择类别" type="text" :border="false" />
      </nut-form-item>
      <nut-form-item label="产地">
        <nut-input @click="clickShowFn('location')" readonly placeholder="请选择产地" type="text" :border="false" />
      </nut-form-item>
      <nut-form-item label="是否含糖">
        <nut-radio-group direction="horizontal" v-model="formData2.sugar">
          <template v-for="item in sugarList">
            <nut-radio :label="item.value">{{ item.value }}</nut-radio>
          </template>
        </nut-radio-group>
      </nut-form-item>
      <nut-form-item label="是否含盐">
        <nut-radio-group direction="horizontal" v-model="formData2.salt">
          <template v-for="item in saltList">
            <nut-radio :label="item.value">{{ item.value }}</nut-radio>
          </template>
        </nut-radio-group>
      </nut-form-item>
      <nut-form-item label="包装">
        <nut-input @click="clickShowFn('wrapper')" readonly placeholder="请选择包装" type="text" :border="false" />
      </nut-form-item>
      <nut-form-item label="适用年龄">
        <nut-input @click="clickShowFn('wrapper')" readonly placeholder="请选择适用年龄" type="text" :border="false" />
      </nut-form-item>
      <nut-form-item label="商品图片">
        <nut-uploader
          url="http://服务地址"
          accept="image/*"
          v-model:file-list="formData2.defaultFileList"
          maximum="3"
          multiple
        >
        </nut-uploader>
      </nut-form-item>
      <nut-form-item label="地址">
        <nut-input
          class="nut-input-text"
          v-model="formData2.address"
          @click="show"
          readonly
          placeholder="请选择地址"
          type="text"
        />
        <!-- nut-address -->
        <nut-address
          v-model:visible="addressModule.state.show"
          :province="addressModule.state.province"
          :city="addressModule.state.city"
          :country="addressModule.state.country"
          :town="addressModule.state.town"
          @change="onChange"
          custom-address-title="请选择所在地区"
        ></nut-address>
      </nut-form-item>
    </nut-form>
    <nut-action-sheet
      v-model:visible="actionSheetVisible"
      :menu-items="menuItems"
      @choose="chooseItemFn"
    ></nut-action-sheet>
  </view>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const formData2 = ref({
  title: '',
  price: null,
  category: '',
  location: '',
  wrapper: '',
  sugar: '',
  salt: '',
  age: '',
  switch: false,
  checkbox: false,
  radio: 0,
  number: 0,
  rate: 3,
  range: 30,
  address: '',
  defaultFileList: [
    {
      name: '文件1.png',
      url: 'https://m.360buyimg.com/babel/jfs/t1/164410/22/25162/93384/616eac6cE6c711350/0cac53c1b82e1b05.gif',
      status: 'success',
      message: '上传成功',
      type: 'image',
    },
    {
      name: '文件2.png',
      url: 'https://m.360buyimg.com/babel/jfs/t1/164410/22/25162/93384/616eac6cE6c711350/0cac53c1b82e1b05.gif',
      status: 'uploading',
      message: '上传中...',
      type: 'image',
    },
  ],
})

const addressModule = ref({
  state: {
    show: false,
    province: [
      { id: 1, name: '北京' },
      { id: 2, name: '广西' },
      { id: 3, name: '江西' },
      { id: 4, name: '四川' },
    ],
    city: [
      { id: 7, name: '朝阳区' },
      { id: 8, name: '崇文区' },
      { id: 9, name: '昌平区' },
      { id: 6, name: '石景山区' },
    ],
    country: [
      { id: 3, name: '八里庄街道' },
      { id: 9, name: '北苑' },
      { id: 4, name: '常营乡' },
    ],
    town: [],
  },
})

// 表单相关列表数据
const saltList = ref([])
const wrapperList = ref([])
const sugarList = ref([])
const categoryList = ref([])
const locationList = ref([])
const ageList = ref([])

/**
 * 输入框点击事件
 * @description: 点击输入框时，显示对应选择器
 */
const clickShowFn = (type: string) => {
  switch (type) {
    case 'category':
      formData2.value.category = '1'
      break
    default:
      break
  }
}

/**
 * 动作面板
 * @description: 点击输入框时，显示对应选择器
 */
const actionSheetVisible = ref(false)
const menuItems = ref([])
const chooseItemFn = (item) => {}

const onChange = ({ custom, next, value }: any) => {
  formData2.value.address += value.name
  const name = addressModule.value.state[next]
  if (name.length < 1) {
    addressModule.value.state.show = false
  }
}

const show = () => {
  addressModule.value.state.show = !addressModule.value.state.show
  if (addressModule.value.state.show) {
    formData2.value.address = ''
  }
}
</script>
