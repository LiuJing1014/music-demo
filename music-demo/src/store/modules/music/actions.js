import {getSongImg} from '../../../utils/business'

export default {
    // 整合歌曲信息 并且开始播放
    async startSong({ commit, state }, rawSong) {
        await commit('setPlayingState', false) //防止点击其他歌时不播放
        // 浅拷贝一份 改变引用
        // 1.不污染元数据
        // 2.单曲循环为了触发watch
        const song = Object.assign({}, rawSong)
        if (!song.img) {
            if (song.albumId) {
                song.img = await getSongImg(song.id, song.albumId)
            }
        }

        commit('setCurrentSong', song)
        commit('setPlayingState', true)

        // 历史记录
        const { playHistory } = state
        const playHistoryCopy = JSON.parse(playHistory).slice()
        const findedIndex = playHistoryCopy.findIndex(({ id }) => song.id === id)
        // 删除旧那一项, 插入到最前面
        if (findedIndex !== -1) {
            playHistoryCopy.splice(findedIndex, 1)
        }
        playHistoryCopy.unshift(song)
        commit('setPlayHistory', JSON.stringify(playHistoryCopy))
        sessionStorage.setItem('PLAY_HISTORY_KEY', JSON.stringify(playHistoryCopy))
        
    },
    //清除当前歌曲
    clearCurrentSong({ commit }) {
        commit('setCurrentSong', {})
        commit('setPlayingState', false)
        commit('setCurrentTime', 0)
    },
    //清空歌单
    clearPlaylist({ commit, dispatch }) {
        commit('setPlaylist', [])
        dispatch('clearCurrentSong')
    },
    //清除历史记录
    clearHistory({ commit }) {
        const history = []
        commit('setPlayHistory', JSON.stringify(history))
        sessionStorage.setItem('PLAY_HISTORY_KEY', JSON.stringify(history))
    },
    //添加到歌单
    addToPlaylist({ commit, state }, song) {
        const { playlist } = state
        const copy = playlist.slice()
        if (!copy.find(({ id }) => id === song.id)) {
            copy.unshift(song)
            commit('setPlaylist', copy)
        }
    }
}