import ajax from './ajax'

export async function getRecommendPlayList (data={}) {
  return ajax.get('/personalized',data)
}
export async function getRecommendDj (data={}) {
  return ajax.get('/personalized/djprogram',data)
}
export async function getRecommendNewSong (data={}) {
  return ajax.get('/personalized/newsong',data)
}
export async function getRecommend (data={}) {
  return ajax.get('/personalized/recommend',data)
}
export async function getPlayListDetail (data={}) {
  return ajax.get('/playlist/detail', data)
}
export async function getLikeMusicList (data={}) {
  return ajax.get('/likelist', data)
}

export async function likeMusic (data={}) {
  return ajax.get('/like', data)
}
export async function getSongInfo (data={}) {
  return ajax.get('/song/detail', data)
}
export async function getSongUrl (data={}) {
  return ajax.get('/song/url', data)
}

export async function getSongLyric (data={}) {
  return ajax.get('/lyric', data)
}
export async function getBanners (data={}) {
  return ajax.get('/banner', data)
}
export async function getSearchHot (data={}) {
  return ajax.get('/search/hot', data)
}

export async function getSearch (data={}) {
  return ajax.get('/search', data)
}

export async function getSearchSuggest (data={}) {
  return ajax.get('/search/suggest', data)
}




