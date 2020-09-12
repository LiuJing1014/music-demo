/*
* 用户歌单相关路由
* */
export const MySongList = [
	//用户的歌单
	{
		path: 'playlist',
		name: 'playlist',
		component: () => import('../views/MySongList/MySongList')
	},
]