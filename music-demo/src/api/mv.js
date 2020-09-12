let axios = window.axios

//mv
export const getMvDetail = (id) => {
	return axios.get(`/mv/detail?mvid=${id}`)
}

export const getMvUrl = (id) => {
	return axios.get(`/mv/url?id=${id}`)
}

export const getSimiMv = (id) => {
	return axios.get(`/simi/mv?mvid=${id}`)
}

export const getAllMvs = (params) => {
	return axios.get(`/mv/all`, {params})
}

//歌手信息
export const getArtists = (id) => {
	return axios.get(`/artists?id=${id}`)
}