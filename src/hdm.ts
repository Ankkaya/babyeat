import { showToast } from '@/utils/index'

export default {
  install(app) {
    app.provide('$showToast', showToast)
  },
}
