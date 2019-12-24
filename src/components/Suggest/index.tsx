import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.scss'

type Props = {
  searchSuggest: {
    albums: Array<Object>,
    artists: Array<Object>,
    mvs: Array<Object>,
    order:Array<String>,
    playlists:Array<Object>,
    songs:Array<Object>,
  },
  searchList: Array<String>,
  query: String,
}

const  _defaultProps = {
  searchSuggest: {
    albums: [],
    artists: [],
    mvs:[],
    order: [],
    playlists: [],
    songs: []
  },
  searchList: [],
  query: '',
}


export default class Suggest extends Component<Props, {}> {
  private static defaultProps = _defaultProps;
  
  componentWillMount() {
  }
  selectItem = (item) => (e) => {

  }
  selectList = (item) => (e) => {
  
  }
  selectSong = (item) => (e) => {
  
  }
  render() {
    const { searchSuggest,searchList, query } = this.props
    return (
      <View className='suggest'>

        {
          searchSuggest && 
          <View className='search-suggest'>
            {
              (searchSuggest.artists.length || searchSuggest.playlists.length) && <View className='title'>最佳匹配</View>
            }
            {
              searchSuggest.artists.length && searchSuggest.artists.map(item => (
                <View onClick={this.selectItem(item)} className='search-suggest-item'>
                  <Image lazyLoad src={item.img1v1Url} mode='widthFix' />
                  <View>歌手：{item.name}</View>
                </View>
              ))
            }
            {
              searchSuggest.playlists.length &&  searchSuggest.playlists.map(item => (
                <View onClick={this.selectList.bind(this,item)} className='search-suggest-item'>
                  <Image lazyLoad  src={item.coverImgUrl} mode='widthFix'/>
                  <View className='text'>
                    <View className='text-dec'>歌单：{item.name}</View>
                  </View>
                </View>
              ))
            }
          </View>
        }
        {
          searchList.length && <View className='suggest-list'>
            {
              searchList.map(item => (
                <View onClick={this.selectSong(item)} className='suggest-item' >
                  <View className='name'>
                    <View className='song'>{item.name}</View>
                    <View className='singer'>{item.singer}</View>
                  </View>
                </View>
              ))
            }
          </View>
        }

        {/* {
          !haveMore && !songs.length && query ?
          <View class='no-result-wrapper'>
            抱歉，暂无搜索结果
          </View> : ''
        } */}
      </View>
    )
  }
}
