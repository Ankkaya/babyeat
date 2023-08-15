export default defineAppConfig({
  pages: ['pages/index/index'],
  subpackages: [
    {
      root: 'pages/goods',
      pages: ['add/index', 'details/index'],
    },
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
})
