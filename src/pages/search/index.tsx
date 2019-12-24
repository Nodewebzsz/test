import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, Swiper, SwiperItem } from '@tarojs/components'
import { AtTabBar, AtSearchBar, AtIcon } from 'taro-ui'
import { connect } from '@tarojs/redux'
import classnames from 'classnames'
import CLoading from '../../components/CLoading'
import CMusic from '../../components/CMusic'
import Suggest from '../../components/Suggest'
import { injectPlaySong } from '../../utils/decorators'
import { clearSearch, deleteSearch, saveSearch, getSearch } from '../../utils/common'
import { songType } from '../../constants/commonType'
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
  hotList: any,
  searchSuggest: any,
  searchList: any,
}

type PageDispatchProps = {
  getSearchHot: () => any,
  getSearch: (object) => any,
  getSearchSuggest: (object) => any,
  getSongInfo: (object) => any,
  getBanners: () => any,
  updatePlayStatus: (object) => any,
  resetSearch: (object) => any,
}

type PageOwnProps = {}

type PageState = {
  current: number,
  showLoading: boolean,
  searchValue: string,
  searches: Array<String>,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@injectPlaySong()
@connect(({ song }) => ({
  song: song,
  hotList: song.hotList,
  searchSuggest: song.searchSuggest,
  searchList: song.searchList,
}), (dispatch) => ({
  getSearchHot (payload={}) {
    dispatch({
      type: 'song/getSearchHot',
      payload
    })
  },
  getSearch (payload={}) {
    dispatch({
      type: 'song/getSearch',
      payload
    })
  },
  getSearchSuggest (payload={}) {
    dispatch({
      type: 'song/getSearchSuggest',
      payload
    })
  },
  getSongInfo (payload={}) {
    dispatch({
      type: 'song/GETSONGINFO',
      payload
    })
  },
  updatePlayStatus (payload={}) {
    dispatch({
      type: 'song/UPDATEPLAYSTATUS',
      payload
    })
  },
  resetSearch (payload={}) {
    dispatch({
      type: 'song/RESETSEARCH',
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

  constructor (props) {
    super(props)
    this.state = {
      current: 0,
      showLoading: true,
      searchValue: '',
      searches: getSearch(),
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
    this.setState({
      showLoading: false
    })
  }

  componentWillMount() {
    this.props.getSearchHot()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  componentDidMount() {
    this.removeLoading()
  }

  switchTab (value) {
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
  search = (value) => (e) => {
    console.log('value')
    console.log(value)
    const searchData = saveSearch(value)
    this.setState({
      searches: searchData
    })
    this.props.getSearchSuggest({
      keywords: value
    })
    this.props.getSearch({
      keywords: value
    })
  }
  
  goDetail(item) {
    Taro.navigateTo({
      url: `/pages/playListDetail/index?id=${item.id}&name=${item.name}`
    })
  }

  removeLoading() {
    const { searchList, searchSuggest } = this.props
    if (searchList.length || searchSuggest ) {
      this.setState({
        showLoading: false
      })
    }
  }
  jump() {
    Taro.switchTab({
      url: '/pages/search/index'
    })
  }
  onChange = (value,e) => {
    this.props.resetSearch({
      searchList: [],
      searchSuggest: {
        albums: [],
        artists: [],
        mvs:[],
        order: [],
        playlists: [],
        songs: []
      },
    })
    this.setState({
      searchValue: value
    })
  }
  reset  = () =>{
    this.props.resetSearch({
      searchList: [],
      searchSuggest: {
        albums: [],
        artists: [],
        mvs:[],
        order: [],
        playlists: [],
        songs: []
      },
    })
    this.setState({
      searchValue: '',
    })
  }
  addQuery = (value) => (e) => {

  }
  showConfirm = (value) => (e) => {

  }
  selectItem = (value) => (e) => {

  }
  deleteOne = (value) => (e) => {

  }

  render () {
    const { hotList, searchList, song, searchSuggest } = this.props
    const { showLoading, searchValue, searches } = this.state
    return (
      <View className='search'>
        <AtSearchBar
          fixed
          showActionButton
          focus
          placeholder='搜索歌曲、歌手'
          value={searchValue}
          onChange={this.onChange.bind(this)}
          onConfirm={this.search(searchValue)}
          onActionClick={this.search(searchValue)}
          onClear={this.reset}
        />
        <View className='search-scroll-wrapper' >
          {
            searchValue ?
              // <Loading/> :
              <View className='search-result'>
                <Suggest searchList={searchList} searchSuggest={searchSuggest} query={searchValue} ></Suggest>
              </View> :
              // <View class='search-result'>
              //   <suggest onSelect={this.saveSearch.bind(this)} onRefresh={this.refresh.bind(this)} query={searchValue} ></suggest>
              // </View> :
              <View className='search-hots' >
                <View className='title'>热门搜索</View>
                {
                  hotList.map(item => (
                    <View className='search-hots-item' onClick={this.addQuery(item.first)}>{item.first}</View>
                  ))
                }
              </View>
          }
          {
            !searchValue ?
            searches.length && 
            <View className='shortcut-wrapper' >
              <View className='search-history'>
                <View className='title'>
                  <View className='text'>搜索历史</View>
                  <View className='clear' onClick={this.showConfirm}>
                    <AtIcon value='trash' size='16' color='#2e3030'></AtIcon>
                  </View>
                </View>
                <View className='search-list'>
                  {
                    searches.map(item => (
                      <View  className='search-item' onClick={this.selectItem(item)}>
                        <View className='text'>{item}</View>
                        <View className='delete' onClick={this.deleteOne(item)}>
                          <AtIcon value='close' size='12' color='#2e3030'></AtIcon>
                        </View>
                      </View>
                    ))
                  }
                </View>
              </View>
            </View> : ''
          }
        </View>
      </View>
    )
  }
}

export default Index as ComponentClass<IProps, PageState>
