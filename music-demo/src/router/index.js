import Vue from 'vue'
import VueRouter from 'vue-router'
import {RecommendedSong} from './RecommendedSong' //推荐歌单
import {LatestMusic} from './LatestMusic' //最新音乐
import {LatestMV} from './LatestMV' //推荐MV
import {MySongList} from './MySongList' //用户的歌单

Vue.use(VueRouter)

    const routes = [
        {
            path:'/',
            redirect:'/index'
        },
        {
            path: '/index',
            name: 'Index',
            component: () => import('../views/Index/index.vue'),
            redirect: '/index/content',
            children: [
                //内容首页
                {
                    path: 'content',
                    name: 'content',
                    component: () => import('../views/Content/index.vue')
                },
                //搜索结果页面
                {
                    path: 'search',
                    name: 'search',
                    component: () => import('../views/Search/search.vue')
                },
                ...RecommendedSong,
                ...LatestMusic,
                ...LatestMV,
                ...MySongList
            ]
        },
    ]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
