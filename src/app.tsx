import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import models from './models'
import AppContainer from './pages/app'
import dva from './store';
import 'taro-ui/dist/style/index.scss' // 全局引入一次即可
import './app.scss'
import './assets/iconFont/icon.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const dvaApp = dva.createApp({
  initialState:{},
  models:  models,
})

const store = dvaApp.getStore();

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      // 'pages/songDetail/index',

      'pages/index/index',
      'pages/my/index',
      'pages/search/index',
      'pages/singer/index',
      'pages/rank/index',
      'pages/songDetail/index',
      'pages/myFans/index',
      'pages/myFocus/index',
      'pages/myEvents/index',
      'pages/login/index',
      'pages/playListDetail/index',
      'pages/recentPlay/index'
    ],
    tabBar: {
      list: [{
        pagePath: "pages/index/index",
        text: "热门推荐",
        iconPath: "./assets/images/recommond.png",
        selectedIconPath: "./assets/images/recommond-active.png"
      },
      {
        pagePath: "pages/rank/index",
        // pagePath: "pages/rank/index",
        text: "排行榜",
        iconPath: "./assets/images/rank.png",
        selectedIconPath: "./assets/images/rank-active.png"
      },
      {
        // pagePath: "pages/singers/index",
        pagePath: "pages/singer/index",
        text: "热门歌手",
        iconPath: "./assets/images/singer.png",
        selectedIconPath: "./assets/images/singer-active.png"
      },
      {
        // pagePath: "pages/singers/index",
        pagePath: "pages/my/index",
        text: "我的",
        iconPath: "./assets/images/my.png",
        selectedIconPath: "./assets/images/my-active.png"
      }
    ],
      color: '#ccc',
      selectedColor: '#d44439',
      backgroundColor: '#fff',
      borderStyle: 'white'
    },
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#d43c33',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'white'
    },
    requiredBackgroundModes: ["audio"]
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
