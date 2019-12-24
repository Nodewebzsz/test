
    // import Taro from '@tarojs/taro';
    import * as api from '../services/api';
    import { parse_lrc, createRecommendSong } from '../utils/common'

    export default {
        namespace: 'song',
        state: {
            playListDetailInfo: {
                coverImgUrl: '',
                name: '',
                playCount: 0,
                tags: [],
                creator: {
                    avatarUrl: '',
                    nickname: ''
                },
                tracks: []
            },
            canPlayList: [],
            playListDetailPrivileges: [],
            recommendPlayList: [],
            recommendDj: [],
            recommendNewSong: [],
            recommend: [],
            myCreateList: [],
            myCollectList: [],
            currentSongId: '',
            currentSongInfo: {
            id: 0,
            name: '',
            ar: [],
            al: {
                picUrl: '',
                name: ''
            },
            url: '',
            lrcInfo: '',
            dt: 0, // 总时长，ms
            st: 0 // 是否喜欢
            },
            currentSongIndex: 0,
            playMode: 'loop',
            likeMusicList: [],
            isPlaying: false,
            recentTab: 0,
            banners: [],
            hotList: [],
            searchList: [],
            searchSuggest: {
                albums: [],
                artists: [],
                mvs:[],
                order: [],
                playlists: [],
                songs: []
            },
            fullScreenPlay: false,

        },
        effects: {
            *getPlayListDetail({ payload },{select, call, put}){
                console.log(payload)
                console.log('payload')
                const res = yield call(api.getPlayListDetail,payload)
                let playListDetailInfo = res.data.playlist
                playListDetailInfo.tracks = playListDetailInfo.tracks.map((item) => {
                    let temp: any = {}
                    temp.name = item.name
                    temp.id = item.id
                    temp.ar = item.ar
                    temp.al = item.al
                    temp.copyright = item.copyright
                    return temp
                })
                yield put({
                    type: 'GETPLAYLISTDETAIL',
                    payload: {
                        playListDetailInfo,
                        playListDetailPrivileges: res.data.privileges
                    }
                })
            },
            *getRecommendPlayList({ payload },{select, call, put}){
                const res = yield call(api.getRecommendPlayList)
                console.log(res)
                console.log('res')
                const recommendPlayList = res.data.result

                yield put({
                    type: 'GETRECOMMENDPLAYLIST',
                    payload: {
                        recommendPlayList
                    }
                })
            },
            *getRecommendDj({ payload },{select, call, put}){
                const res = yield call(api.getRecommendDj)
                const recommendDj = res.data.result

                yield put({
                    type: 'GETRECOMMENDDJ',
                    payload: {
                        recommendDj
                    }
                })
            },
            // 获取推荐新音乐
            *getRecommendNewSong({ payload },{select, call, put}){
                const res = yield call(api.getRecommendNewSong)

                let recommendNewSong = res.data.result.map((item) => {
                    return createRecommendSong(item)
                })
                console.log(recommendNewSong)
                console.log('recommendNewSong')
                yield put({
                    type: 'GETRECOMMENDNEWSONG',
                    payload: {
                        recommendNewSong
                    }
                })
            },
            // 获取推荐精彩节目
            *getRecommend({ payload },{select, call, put}){
                const res = yield call(api.getRecommend)
                const recommend = res.data.result
                yield put({
                    type: 'GETRECOMMEND',
                    payload: {
                        recommend
                    }
                })
            },
            // 获取轮播图
            *getBanners({ payload },{select, call, put}){
                const res = yield call(api.getBanners)

                const banners = res.data.banners
                console.log(banners)
                console.log('getBanners')
                yield put({
                    type: 'setData',
                    payload: {
                        banners
                    }
                })
            },
            // 获取搜索热点
            *getSearchHot({ payload },{select, call, put}){
                const res = yield call(api.getSearchHot)

                const hotList = res.data.result.hots
                console.log(hotList)
                console.log('getSearchHot')
                yield put({
                    type: 'setData',
                    payload: {
                        hotList
                    }
                })
            },
            // 获取搜索
            *getSearch({ payload },{select, call, put}){
                const res = yield call(api.getSearch, payload)

                const searchList = res.data.result.songs
                console.log(searchList)
                console.log('getSearch')
                yield put({
                    type: 'setData',
                    payload: {
                        searchList
                    }
                })
            },
            // 获取搜索推荐
            *getSearchSuggest({ payload },{select, call, put}){
                const res = yield call(api.getSearchSuggest, payload)

                const searchSuggest = res.data.result
                console.log(searchSuggest)
                console.log('getSearchSuggest')
                const defaultData = {
                    albums: [],
                    artists: [],
                    mvs:[],
                    order: [],
                    playlists: [],
                    songs: []
                }
                const newSearchSuggest = {
                    ...defaultData,
                    ...searchSuggest
                }
                yield put({
                    type: 'setData',
                    payload: {

                        searchSuggest: newSearchSuggest
                    }
                })
            },
            // 获取歌曲详情信息
            *getSongInfo({ payload },{select, call, put}){

                const res1 = yield call(api.getSongInfo, {
                    ids: payload.id
                })
                console.log('res1')
                console.log(res1)
                let songInfo = res1.data.songs[0]
                try {
                    const res2 = yield call(api.getSongUrl, {
                        id: payload.id
                    })
                    console.log('res2')
                    console.log(res2)
                    songInfo.url = res2.data.data[0].url
                    try {
                        const res3 = yield call(api.getSongLyric, {
                            id: payload.id
                        })
                        const lrc = parse_lrc(res3.data.lrc && res3.data.lrc.lyric ? res3.data.lrc.lyric : '');
                        res3.data.lrclist = lrc.now_lrc;
                        res3.data.scroll = lrc.scroll ? 1 : 0
                        songInfo.lrcInfo = res3.data
                    } catch (error) {
                        console.log('获取歌词失败', error)
                        yield put({
                            type: 'GETSONGINFO',
                            payload: {
                                currentSongInfo: songInfo
                            }
                        })
                    }
                } catch (error) {
                    console.log('获取歌曲url失败', error)
                    yield put({
                        type: 'GETSONGINFO',
                        payload: {
                            currentSongInfo: songInfo
                        }
                    })
                }
                yield put({
                    type: 'GETSONGINFO',
                    payload: {
                        currentSongInfo: songInfo
                    }
                })
            },
            // 喜欢音乐
            *likeMusic({ payload },{select, call, put}){
                const { like, id } = payload
                const res = yield call(api.likeMusic, {
                    id,
                    like
                })
                let changeFlag = res.data.code
                if (changeFlag === 200) {
                    yield put({
                        type: 'UPDATELIKEMUSICLIST',
                        payload: {
                            like,
                            id
                        }
                    })
                }
            },
            // 获取喜欢音乐列表
            *getLikeMusicList({ payload },{select, call, put}){
                const { id } = payload
                const res = yield call(api.getLikeMusicList,{uid: id})
                yield put({
                    type: 'GETLIKEMUSICLIST',
                    payload: {
                        likeMusicList: res.data.ids || []
                    }
                })
            },
        },

        reducers: {
            setData: (state, {payload}) => {
              console.log('payload')
              console.log(payload)
                return {
                  ...state,
                  ...payload
                }
              },
              pushData: (state, {payload}) => {
                for (let [key,val] of Object.entries(payload)) {
                  state[key] = state[key].concat(val)
                }
                return state
              },
              resetData: (state, {payload}) => {
                return {
                  ...state,
                  ...payload
                }
              },
              GETSONGDETAIL: (state,{payload}) => {
                return state
              },
            // 获取歌单详情
            GETPLAYLISTDETAIL: (state, {payload}) => {
                const { playListDetailInfo, playListDetailPrivileges } = payload
                let canPlayList = playListDetailInfo.tracks.filter((_, index) => {
                    return playListDetailPrivileges[index].st !== -200
                })
                return {
                    ...state,
                    playListDetailInfo,
                    playListDetailPrivileges,
                    canPlayList
                }
            },
            RESETPLAYLIST: (state, {payload}) => {
                return {
                    ...state,
                    playListDetailInfo: state.playListDetailInfo,
                    playListDetailPrivileges: [],
                    canPlayList: []
                }
            },
            RESETSEARCH: (state, {payload}) => {
                return {
                    ...state,
                    ...payload
                }
            },
            // 获取推荐歌单
            GETRECOMMENDPLAYLIST: (state, {payload}) => {
                const { recommendPlayList } = payload
                return {
                    ...state,
                    recommendPlayList
                }
            },
            // 获取推荐电台
            GETRECOMMENDDJ: (state, {payload}) => {
                const { recommendDj } = payload
                return {
                    ...state,
                    recommendDj
                }
            },
            // 获取推荐新音乐
            GETRECOMMENDNEWSONG: (state, {payload}) => {
                const { recommendNewSong } = payload
                return {
                  ...state,
                  recommendNewSong
                }
            },
            // 获取推荐精彩节目
            GETRECOMMEND: (state, {payload}) => {
                const { recommend } = payload
                return {
                    ...state,
                    recommend
                }
            },
            RESETSONGINFO: (state,{payload}) => {
                return {
                    ...state,
                    currentSongInfo: payload.currentSongInfo
                }
            },
            // 获取歌曲详情
            GETSONGINFO:  (state, {payload}) => {
                const { currentSongInfo } = payload
                let currentSongIndex = state.canPlayList.findIndex(item => item.id === currentSongInfo.id)
                state.canPlayList.map((item, index) => {
                    item.current = false
                    if (currentSongIndex === index) {
                    item.current = true
                    }
                    return item
                })
                return {
                    ...state,
                    currentSongInfo,
                    currentSongIndex,
                    canPlayList: state.canPlayList
                }
            },

        // 切换播放模式
        CHANGEPLAYMODE: (state, {payload}) => {
            const { playMode } = payload
            return {
              ...state,
              playMode
            }
        },

        // 获取喜欢列表
        GETLIKEMUSICLIST: (state, {payload}) => {
            const { likeMusicList } = payload
            return {
                ...state,
                likeMusicList
            }
        },

        // 更新喜欢列表
        UPDATELIKEMUSICLIST: (state, {payload}) => {
            const { like, id } = payload
            let list: Array<number> = []
            if (like) {
                list = state.likeMusicList.concat([id])
            } else {
                state.likeMusicList.forEach((item) => {
                if (item !== id) list.push(item)
                })
            }
            return {
                ...state,
                likeMusicList: list
            }
        },

        UPDATEPLAYSTATUS: (state, {payload}) => {
            const { isPlaying } = payload
            return {
              ...state,
              isPlaying
            }
        },
        UPDATEPLAYERSHOW: (state, {payload}) => {
            const { fullScreenPlay } = payload
            return {
              ...state,
              fullScreenPlay
            }
        },

        UPDATECANPLAYLIST: (state, {payload}) => {
            const currentSongIndex = payload.canPlayList.findIndex(item => item.id === payload.currentSongId)
            // action.payload.canPlayList.map((item, index) => {
            //   item.current = false
            //   if (currentSongIndex === index) {
            //     item.current = true
            //   }
            //   return item
            // })
            return {
              ...state,
              canPlayList: payload.canPlayList,
              currentSongIndex
            }
        },

        UPDATERECENTTAB: (state, {payload}) => {
            const { recentTab } = payload
            return {
            ...state,
            recentTab
            }
        }

    }

}

