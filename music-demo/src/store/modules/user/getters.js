import { isDef } from '../../../utils/common' //判断是否为null或者undefined

export const isLogin = (state) => isDef(state.user.userId) //判断是否登录

// 根据用户请求的数据整合出菜单
export const userMenus = (state) => {
    const {user,userPlayList} = state
    var retMenus = {userCreateList:[],userCollectList:[]};  //用户创建的歌单 //用户收藏的歌单

    [].map.call(userPlayList,(playlist) => {
        const { userId } = playlist //等价于 const userId = playList.userId
        if(user.userId === userId){
            retMenus.userCreateList.push(playlist)
        }else{
            retMenus.userCollectList.push(playlist)
        }
    })

    const genPlaylistChildren = playlist =>{
        playlist.forEach((item) => {
            item['path'] = `playlist?id=${item.id}`
        });
        return playlist;
    }
    
    retMenus.userCreateList = genPlaylistChildren(retMenus.userCreateList)
    retMenus.userCollectList = genPlaylistChildren(retMenus.userCollectList)
    
    return retMenus
}