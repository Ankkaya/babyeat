export default defineAppConfig({
  pages: ['pages/index/index', 'components/navBar/index'],
  subpackages: [
    {
      root: 'pages/goods',
      pages: ['add/index', 'details/index'],
    },
    {
      root: 'pages/my',
      pages: ['index'],
    },
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  usingComponents: {
    'nav-bar': './components/navBar',
  },
})
