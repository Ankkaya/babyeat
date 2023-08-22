import { defineStore } from 'pinia'

export const useBaseStore = defineStore('base', {
  state() {
    return {
      lastChooseTabIndex: 0,
    }
  },
})
