import { defineStore } from 'pinia'

export const useGoodsStore = defineStore('goods', {
  state() {
    return {
      choosedTags: [],
      goodsId: '',
    }
  },
  actions: {
    setChoosedTags(tags) {
      this.choosedTags = tags
    },
  },
})
