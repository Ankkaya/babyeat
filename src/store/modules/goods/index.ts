import { defineStore } from 'pinia'

export const useGoodsStore = defineStore('goods', {
  state() {
    return {
      choosedTags: [],
    }
  },
  actions: {
    setChoosedTags(tags) {
      this.choosedTags.push(tags)
    },
  },
})
