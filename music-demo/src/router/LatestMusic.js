/*
* 最新音乐相关路由
* */
export const LatestMusic = [
	//推荐歌单
	{
		path: 'latestMusic',
		name: 'latestMusic',
		component: () => import('../views/LatestMusic/LatestMusic')
	},
]