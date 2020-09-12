// import storage from 'good-storage' //存储插件
import {UID_KEY} from '../../../utils/config'
import {isDef} from '../../../utils/config'
import {userDetail,userPlayList} from '../../../api/user'

export default {
    async login ( { commit }, uid ) {
        try{
            const user = await userDetail(uid)
            const { profile } = user
            commit('setUser',profile)
            sessionStorage.setItem('UID_KEY', profile.userId)
        } catch (e) {
            return false
        }

        const {playlist} = await userPlayList(uid)
        commit('setUserPlayList',playlist)
        return true
    },
    loginOut({commit}){
        commit('setUser',{})
        commit('setUserPlayList',{})
        sessionStorage.setItem('UID_KEY',null)
    }
}