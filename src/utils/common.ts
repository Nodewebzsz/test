import Taro  from '@tarojs/taro'
export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 转换歌词字符串为数组
export const parse_lrc = (lrc_content: string) => {
  let now_lrc: Array<{
    lrc_text: string,
    lrc_sec?: number
  }> = []; // 声明一个临时数组
  let lrc_row: Array<string> = lrc_content.split("\n"); // 将原始的歌词通过换行符转为数组
  console.log('lrc_row')
  console.log(lrc_row)
  let scroll = true; // 默认scroll初始值为true
  for (let i in lrc_row) {
    if ((lrc_row[i].indexOf(']') === -1) && lrc_row[i]) {
      now_lrc.push({ lrc_text: lrc_row[i] })
    } else if (lrc_row[i] !== '') {
      let tmp: string[] = lrc_row[i].split("]")
      for (let j in tmp) {
        scroll = false
        let tmp2: string = tmp[j].substr(1, 8)
        let tmp3: any = tmp2.split(":")
        let lrc_sec: any = Number(tmp3[0] * 60 + Number(tmp3[1]))
        if (lrc_sec && (lrc_sec > 0)) {
          let lrc = (tmp[tmp.length - 1]).replace(/(^\s*)|(\s*$)/g, "")
          lrc && now_lrc.push({ lrc_sec: lrc_sec, lrc_text: lrc })
        }
      }
    }
  }
  if (!scroll) {
    now_lrc.sort(function (a: {lrc_sec: number, lrc_text: string}, b: {lrc_sec: number, lrc_text: string}) : number {
      return a.lrc_sec - b.lrc_sec;
    });
  }
  console.log('now_lrc')
  console.log(now_lrc)
  return {
    now_lrc: now_lrc,
    scroll: scroll
  };
}





export class Song {
  constructor({id, mid, singer, name, album, duration, image, url, aliaName}) {
    this.id = id
    this.singer = singer
    this.name = name
    this.album = album
    this.aliaName = aliaName
    this.image = image
  }
}

function singerName(arr) {
  let name = []
  name = arr.map((item) => {
    return item.name
  })
  return name.join('/')
}

export function createRecommendListSong (music) {
  return new Song({
    id: music.id,
    singer: singerName(music.ar),
    name: music.name,
    album: music.al.name,
    image: music.al.picUrl,
  })
}

export function createRecommendSong(music) {
  return new Song({
    id: music.id,
    singer: singerName(music.song.artists),
    name: music.name,
    // aliaName: music.song.alias.join('-'),
    album: music.song.album.name,
    image: music.song.album.picUrl,
  })
}

export function createSong (music) {
  return new Song({
    id: music.id,
    singer: singerName(music.ar),
    name: music.name,
    album: music.al.name,
    image: music.al.picUrl,
  })
}

export function createSearchSong(music) {
  return new Song({
    id: music.id,
    singer: singerName(music.artists),
    name: music.name,
    album: music.album.name,
  })
}

const SEARCH_KEY = 'searchHistory'
const SEARCH_MAX_LEANGTH = 15
function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}
export function getSearch () {
  
  return Taro.getStorageSync(SEARCH_KEY) || []
}
export function clearSearch () {
  Taro.clearStorageSync()
  return []
}
export function deleteSearch (query) {
  // 首先获取
  let searches = Taro.getStorageSync(SEARCH_KEY)

  deleteFromArray(searches, (item) => {
    return item === query
  })
  console.log('delet', searches)

  Taro.setStorageSync(SEARCH_KEY, searches)
  return searches
}
export function saveSearch (query) {
  let searches = Taro.getStorageSync(SEARCH_KEY) || []
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEANGTH)
  Taro.setStorageSync(SEARCH_KEY, searches)
  return searches
}