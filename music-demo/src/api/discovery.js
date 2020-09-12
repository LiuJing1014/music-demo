let axios = window.axios

//轮播图
export const getBanner = () => {
	return axios.get("/banner?type=0")
}

//最新音乐
export const getNewSongs = () => {
	return axios.get("/personalized/newsong")
}

//推荐歌单
export const getPersonalized = (params) => {
	return axios.get("/personalized",{ params })
}

//推荐MV
export const getPersonalizedMv = () => {
	return axios.get(`/personalized/mv`)
}