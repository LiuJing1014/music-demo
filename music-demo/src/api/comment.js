let axios = window.axios

// 歌单评论
export const getPlaylistComment = (params) => {
	return axios.get("/comment/playlist", { params })
}

// 歌曲评论
export const getSongComment = (params) => {
	return axios.get("/comment/music", { params })
}

// 热门评论
export const getHotComment = (params) => {
	return axios.get("/comment/hot", { params })
}

// mv评论
export const getMvComment = (params) => {
	return axios.get("/comment/mv", { params })
}
