import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import classnames from 'classnames'
import { connect } from '@tarojs/redux'
import CLoading from '../../components/CLoading'
import CMusic from '../../components/CMusic'
import Player from '../../components/Player'
// import { getSongInfo, getPlayListDetail, updatePlayStatus } from '../../actions/song'
import { injectPlaySong } from '../../utils/decorators'
import { songType } from '../../constants/commonType'
import './index.scss'

type PageStateProps = {
  song: songType,
  fullScreenPlay: boolean,
}

type PageDispatchProps = {
  getPlayListDetail: (object) => any,
  getSongInfo: (object) => any,
  updatePlayStatus: (object) => any,
  updatePlayerShow: (object) => any,
}

type PageState = {
}

@injectPlaySong()
@connect(({
  song
}) => ({
  song: song,
}), (dispatch) => ({
  getPlayListDetail (payload={}) {
    console.log(payload)
    console.log('payload')
    dispatch({
      type: 'song/getPlayListDetail',
      payload
    })
  },
  getSongInfo (payload={}) {
    dispatch({
      type: 'song/getSongInfo',
      payload
    })
  },
  updatePlayStatus (payload={}) {
    dispatch({
      type: 'song/UPDATEPLAYSTATUS',
      payload
    })
    // dispatch(updatePlayStatus(object))
  },
  updatePlayerShow (payload={}) {
    dispatch({
      type: 'song/UPDATEPLAYERSHOW',
      payload
    })
  },
}))
class Page extends Component<PageDispatchProps & PageStateProps, PageState> {

  config: Config = {
    navigationBarTitleText: '歌单详情'
  }

  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount () {
    const { id, name } = this.$router.params
    Taro.setNavigationBarTitle({
      title: name
    })
    this.props.getPlayListDetail({
      id
    })
  }

  componentDidMount() {
    console.log('test before did')
  }

  componentDidShow () {
  }

  componentDidHide () { }

  playSong(songId, canPlay) {
    if (canPlay) {
      Taro.navigateTo({
        url: `/pages/songDetail/index?id=${songId}`
      })
    } else {
      Taro.showToast({
        title: '暂无版权',
        icon: 'none'
      })
    }
  }

  render () {
    const { playListDetailInfo, playListDetailPrivileges, currentSongInfo, fullScreenPlay} = this.props.song
    return (
      <ScrollView 
        className={
          classnames({
            playList_container: true,
            hasMusicBox: !!currentSongInfo.name
          })
        }  
        scrollY 
        lowerThreshold={20}>
        <Player show={ fullScreenPlay } />
        <CMusic songInfo={ this.props.song } onUpdatePlayStatus={this.props.updatePlayStatus.bind(this)} onUpdatePlayerShow={this.props.updatePlayerShow.bind(this)} />
        <View className='playList__header'>
          <View className='playList_cover'>
            <Image 
              className='playList__header__bg'
              src={playListDetailInfo.coverImgUrl}
            />
            <View className='cover'></View>
          </View>
          {/* <Image 
              className='playList__header__bg'
              src={playListDetailInfo.coverImgUrl}
            /> */}
          <View className='playList__header__cover'>
            <Image 
              className='playList__header__cover__img'
              src={playListDetailInfo.coverImgUrl}
            />
            <Text className='playList__header__cover__desc'>歌单</Text>
            <View className='playList__header__cover__num'>
              <Text className='at-icon at-icon-sound'></Text>
              {
                playListDetailInfo.playCount < 10000 ?
                playListDetailInfo.playCount : 
                `${Number(playListDetailInfo.playCount/10000).toFixed(1)}万`
              }
            </View>
          </View>
          <View className='playList__header__info'>
            <View className='playList__header__info__title'>
            {playListDetailInfo.name}
            </View>
            <View className='playList__header__info__user'>
              <Image 
                className='playList__header__info__user_avatar'
                src={playListDetailInfo.creator.avatarUrl}
              />{playListDetailInfo.creator.nickname}
            </View>
          </View>
        </View>
        <View className='playList__header--more'>
          <View className='playList__header--more__tag'>
              标签：
              {
                playListDetailInfo.tags.map((tag, index) => <Text key={index} className='playList__header--more__tag__item'>{tag}</Text>)
              }
              {
                playListDetailInfo.tags.length === 0 ? '暂无' : ''
              }
          </View>
          <View className='playList__header--more__desc'>
            简介：{playListDetailInfo.description || '暂无'}
          </View>
        </View>
        <View className='playList__content'>
          <View className='playList__content__title'>
              歌曲列表
          </View>
          {
            playListDetailInfo.tracks.length === 0 ? <CLoading /> : ''
          }
          <View 
            className='playList__content__list'
          >
              {
                playListDetailInfo.tracks.map((track, index) => <View className={classnames({
                  playList__content__list__item: true,
                  disabled: playListDetailPrivileges[index].st === -200
                })}
                key={index}
                onClick={this.playSong.bind(this, track.id, playListDetailPrivileges[index].st !== -200)}
                >
                  <Text className='playList__content__list__item__index'>{index+1}</Text>
                  <View className='playList__content__list__item__info'>
                    <View>
                      <View className='playList__content__list__item__info__name'>
                        {track.name}
                      </View>
                      <View className='playList__content__list__item__info__desc'>
                        {track.ar[0] ? track.ar[0].name : ''} - {track.al.name}
                      </View>
                    </View>
                    <Text className='at-icon at-icon-chevron-right'></Text>
                  </View>
                </View>)
              }
          </View>
        </View>
      </ScrollView>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Page as ComponentClass
