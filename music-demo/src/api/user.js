let axios = window.axios

//用户信息
export const userDetail = (uid) => {
	return axios.get("/user/detail", { params:{ uid } })
}

//用户歌单
const PLAYLIST_LIMIT = 1000
export const userPlayList = (uid) => {
	return axios.get("/user/playlist", { params:{ uid,limit:PLAYLIST_LIMIT } })
}

