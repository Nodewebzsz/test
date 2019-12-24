import {ComponentClass} from 'react'
import Taro, {Component, Config} from '@tarojs/taro'
import {View, Image, Text, Swiper, SwiperItem} from '@tarojs/components'
import {AtTabBar, AtSearchBar} from 'taro-ui'
import {connect} from '@tarojs/redux'
import classnames from 'classnames'
import CLoading from '../../components/CLoading'
import CMusic from '../../components/CMusic'
import Player from '../../components/Player'

import {injectPlaySong} from '../../utils/decorators'
import {songType} from '../../constants/commonType'
// import {
//   getRecommendPlayList,
//   getRecommendDj,
//   getRecommendNewSong,
//   getRecommend,
//   getSongInfo,
//   updatePlayStatus
// } from '../../actions/song'

import './index.scss'

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
  song: songType,
  counter: {
    num: number
  },
  recommendPlayList: Array<{
    name: string,
    picUrl: string,
    playCount: number
  }>,
  recommendDj: Array<{
    name: string,
    picUrl: string
  }>,
  recommendNewSong: any,
  recommend: any,
  banners: any,
  fullScreenPlay: boolean,
}

type PageDispatchProps = {
  getRecommendPlayList: () => any,
  getRecommendDj: () => any,
  getRecommendNewSong: () => any,
  getRecommend: () => any,
  getSongInfo: (object) => any,
  getBanners: () => any,
  updatePlayStatus: (object) => any,
  getSearchHot: () => any,
  updatePlayerShow: (object) => any,
  test: () => any,
}

type PageOwnProps = {}

type PageState = {
  current: number,
  showLoading: boolean,
  searchValue: string
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@injectPlaySong()
@connect(({song}) => ({
  song: song,
  recommendPlayList: song.recommendPlayList,
  recommendDj: song.recommendDj,
  banners: song.banners,
  recommendNewSong: song.recommendNewSong,
  recommend: song.recommend,
  fullScreenPlay: song.fullScreenPlay
}), dispatch => ({
  getRecommendPlayList(payload = {}) {
    dispatch({
      type: 'song/getRecommendPlayList',
      payload
    })
  },
  getRecommendDj(payload = {}) {
    dispatch({
      type: 'song/getRecommendDj',
      payload
    })
  },
  getRecommendNewSong(payload = {}) {
    dispatch({
      type: 'song/getRecommendNewSong',
      payload
    })
  },
  getRecommend(payload = {}) {
    dispatch({
      type: 'song/getRecommend',
      payload
    })
  },
  getSongInfo(payload = {}) {
    dispatch({
      type: 'song/GETSONGINFO',
      payload
    })
  },
  getBanners(payload = {}) {
    dispatch({
      type: 'song/getBanners',
      payload
    })
  },
  getSearchHot(payload = {}) {
    dispatch({
      type: 'song/getSearchHot',
      payload
    })
  },
  updatePlayStatus(payload = {}) {
    dispatch({
      type: 'song/UPDATEPLAYSTATUS',
      payload
    })
  },
  test(payload = {}) {
    console.log('test')
    console.log(payload)
  },
  updatePlayerShow(payload = {}) {
    dispatch({
      type: 'song/UPDATEPLAYERSHOW',
      payload
    })
  },
}))
class Index extends Component<IProps, PageState> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '网易云音乐'
  }

  constructor(props) {
    super(props)
    this.state = {
      current: 0,
      showLoading: true,
      searchValue: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
    this.setState({
      showLoading: false
    })
  }

  componentWillMount() {
    this.getPersonalized()
    this.getNewsong()
    this.getDjprogram()
    this.getRecommend()
    this.getBanners()
    this.getSearchHot()
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  componentDidMount() {
    this.removeLoading()
  }

  switchTab(value) {
    console.log('value')
    console.log(value)
    this.setState({
      current: value
    })

    // if (value !== 3) return
    // Taro.reLaunch({
    //   url: '/pages/my/index'
    // })
  }

  /**
   * 获取推荐歌单
   */
  getPersonalized() {
    this.props.getRecommendPlayList()
  }

  /**
   * 获取推荐新音乐
   */
  getNewsong() {
    this.props.getRecommendNewSong()
  }

  /**
   * 获取推荐电台
   */
  getDjprogram() {
    this.props.getRecommendDj()
  }

  /**
   * 获取推荐节目
   */
  getRecommend() {
    this.props.getRecommend()
  }

  /**
   * 获取轮播图
   */
  getBanners() {
    this.props.getBanners()
  }

  /**
   * 获取搜索热点
   */
  getSearchHot() {
    this.props.getSearchHot()
  }

  goDetail(item) {
    Taro.navigateTo({
      url: `/pages/playListDetail/index?id=${item.id}&name=${item.name}`
    })
  }

  removeLoading() {
    const {recommendPlayList, recommendDj, recommendNewSong} = this.props
    if (recommendPlayList.length || recommendDj.length || recommendNewSong.length) {
      this.setState({
        showLoading: false
      })
    }
  }

  jump() {
    Taro.navigateTo({
      url: '/pages/search/index'
    })
  }

  render() {
    const {recommendPlayList, recommendDj, song, recommendNewSong, banners, fullScreenPlay} = this.props
    const {showLoading, searchValue} = this.state
    // @ts-ignore
    return <View className={
      classnames({
        index_container: true,
        hasMusicBox: !!song.currentSongInfo.name
      })
    }>
      <Player show={fullScreenPlay}/>
      <CMusic songInfo={this.props.song} isHome={false} onUpdatePlayStatus={this.props.updatePlayStatus.bind(this)}
              onUpdatePlayerShow={this.props.updatePlayerShow.bind(this)}/>
      <AtSearchBar
        placeholder='搜索歌曲、歌手'
        fixed
        value={searchValue}
        onChange={this.jump}
        onFocus={this.jump}
      />
      <View className='recommend_banners'>
        <View className='decorate'></View>
        <View className='slider-wrapper'>
          <Swiper
            indicatorColor='#fff'
            indicatorActiveColor='#fd6c62'
            circular
            indicatorDots
            autoplay>
            {
              banners.map(item => <SwiperItem>
                <Image src={item.imageUrl}></Image>
              </SwiperItem>)
            }
          </Swiper>
        </View>
      </View>
      <View className='recommend_playlist'>
        <View className='recommend_playlist__title'>
          推荐歌单
        </View>
        <CLoading fullPage={false} hide={!showLoading}/>
        <View className='recommend_playlist__content clear'>
          {
            recommendPlayList.map((item, index) => <View key={index} className='recommend_playlist__item'
                                                         onClick={this.goDetail.bind(this, item)}>
              <View className='recommend_playlist__item__cover'>
                <Image
                  src={item.picUrl}
                  mode='widthFix'
                  className='recommend_playlist__item__img'
                />
              </View>
              <View className='recommend_playlist__item__cover__num'>
                <Text className='at-icon at-icon-sound'></Text>
                {
                  item.playCount < 10000 ?
                    item.playCount :
                    `${Number(item.playCount / 10000).toFixed(0)}万`
                }
              </View>
              <View className='recommend_playlist__item__title'>{item.name}</View>
            </View>)
          }
        </View>
      </View>
      <View className='recommend_playlist'>
        <View className='recommend_playlist__title'>
          推荐歌曲
        </View>
        <CLoading fullPage={false} hide={!showLoading}/>
        <View className='recommend_playlist__content clear'>
          {
            recommendNewSong.map((item, index) => <View key={index} className='recommend_playlist__item'
                                                        onClick={this.goDetail.bind(this, item)}>
              <View className='recommend_playlist__item__cover'>
                <Image
                  src={item.image}
                  mode='widthFix'
                  className='recommend_playlist__item__img'
                />
              </View>
              <View className='text line'>{item.name}</View>
              <View className='singer line'>{item.singer}</View>
            </View>)
          }
        </View>
      </View>
      <View className='recommend_playlist'>
        <View className='recommend_playlist__title'>
          推荐电台
        </View>
        <CLoading fullPage={false} hide={!showLoading}/>
        <View className='recommend_playlist__content'>
          {
            recommendDj.map((item, index) => <View key={index} className='recommend_playlist__item'
                                                   onClick={this.goDetail.bind(this, item)}>
              <View className='recommend_playlist__item__cover'>
                <Image
                  src={item.picUrl}
                  mode='widthFix'
                  className='recommend_playlist__item__img'
                />
              </View>
              <View className='recommend_playlist__item__title'>{item.name}</View>
            </View>)
          }
        </View>
      </View>
      {/* <AtTabBar
          fixed
          selectedColor='#d43c33'
          tabList={[
            { title: '热门推荐', image: 'https://static.zszweb.cn/static/images/recommond.png', selectedImage: 'https://static.zszweb.cn/static/images/recommond-active.png' },
            { title: '排行榜', image: 'https://static.zszweb.cn/static/images/rank.png', selectedImage: 'https://static.zszweb.cn/static/images/rank-active.png'},
            { title: '热门歌手', image: 'https://static.zszweb.cn/static/images/singer.png', selectedImage: 'https://static.zszweb.cn/static/images/singer-active.png'},
            { title: '我的', image: 'https://static.zszweb.cn/static/images/my.png', selectedImage: 'https://static.zszweb.cn/static/images/my-active.png'},
          ]}
          onClick={this.switchTab.bind(this)}
          current={this.state.current}
        /> */}
    </View>
  }
}

export default Index as ComponentClass<IProps, PageState>
