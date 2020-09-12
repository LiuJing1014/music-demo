let axios = window.axios

//用户歌单列表信息
export const getListDetail = (params) => {
	return axios.get("/playlist/detail", { params })
}

export const getAlbum = (id) => {
	return axios.get(`/album?id=${id}`)
}

export const getMvDetail = (id) => {
	return axios.get(`/mv/detail?mvid=${id}`)
}

// 获取音乐详情
export const getSongDetail = (ids) => {
	return axios.get(`/song/detail?ids=${ids}`)
}

// 获取歌单
export const getPlaylists = (params) => {
	return axios.get(`/top/playlist`, { params })
}

// 精品歌单
export const getTopPlaylists = (params) => {
	return axios.get(`/top/playlist/highquality`, { params })
}

// 获取相似歌单
export const getSimilarPlaylists = (id, option) => {
	return axios.get(`/simi/playlist?id=${id}`,option)
}

// 最新音乐
export const getTopSongs = (type) => {
	return axios.get(`/top/song?type=${type}`)
}


// 相似音乐
export const getSimiSongs = (id, option) => {
	return axios.get(`/simi/song?id=${id}`, option)
}

// 歌词
export const getLyric = (id) => {
	return axios.get(`/lyric?id=${id}`)
}
