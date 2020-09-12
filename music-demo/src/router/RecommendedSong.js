/*
* 推荐歌单相关路由
* */
export const RecommendedSong = [
	//推荐歌单
	{
		path: 'recommendedSong',
		name: 'recommendedSong',
		component: () => import('../views/RecommendedSong/RecommendedSong')
	},
]