/*
* 推荐MVV相关路由
* */
export const LatestMV = [
	//推荐MV
	{
		path: 'latestMV',
		name: 'latestMV',
		component: () => import('../views/LatestMV/LatestMV')
    },
    //MV详情
	{
		path: 'mvDetail',
		name: 'mvDetail',
		component: () => import('../views/LatestMV/mvDetail')
	},
]