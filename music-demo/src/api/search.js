let axios = window.axios

//热门搜索
export const getSearchHot = () => {
	return axios.get('/search/hot')
}

export const getSearchSuggest = (keywords) => {
	return axios.get('/search/suggest', { params: { keywords } })
}

export const getSearch = (params) => {
	return axios.get(`/search`, { params })
}