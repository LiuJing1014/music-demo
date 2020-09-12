<template>
    <div class="playContainer">
        <div class="leftContent"  v-show="this.currentSong.id">
            <div class="songImg">
                <img class="songPict" :src="currentSong.img"/>
                <img class="clickImg" :src="closeWord == true?require('../../assets/img/up.png'):require('../../assets/img/down.png')" @click="openWord"/>
            </div>
            <div class="infoList">
                <span class="name">{{ currentSong.name }} - {{ currentSong.artistsText }}</span>
                <span class="time">{{currentTime | songTime}}/{{currentSong.duration / 1000 | songTime}}</span>
            </div>
        </div>
        <div class="centerContent">
            <i class="el-icon-caret-left" style="cursor: pointer;" @click="prev"></i>
            <div class="playBtn" @click="openPlay">
                <img :src="playing?require('../../assets/img/open.png'):require('../../assets/img/stop.png')"/>
            </div>
            <i class="el-icon-caret-right" style="cursor: pointer;" @click="next"></i>
        </div>
        <div class="rightContent">
            <img class="pict" src='../../assets/img/share.png' style="cursor: pointer;"/>
            <el-tooltip class="item" effect="dark" :content="tip" placement="top" style="z-index:3000">
                <!-- 顺序播放 -->
                <img class="pict" src='../../assets/img/sequencePlay.png' style="cursor: pointer;" v-if="mode == 'sequence'" @click="changeMode('loop')"/> 
                <!-- 单曲播放 -->
                <img class="pict" src='../../assets/img/singleCirculation.png' style="cursor: pointer;" v-if="mode == 'loop'" @click="changeMode('random')"/>
                <!-- 随机播放 -->
                <img class="pict" src='../../assets/img/randomPlay.png' style="cursor: pointer;" v-if="mode == 'random'" @click="changeMode('sequence')"/>
            </el-tooltip>
            <img class="pict" src='../../assets/img/menu.png' style="cursor: pointer;" @click="showList = !showList"/>
            <img class="pict" src='../../assets/img/volume.png' style="cursor: pointer;"/>
            <el-slider v-model="volume" @change="changeVolume"></el-slider>
        </div>
        <div class="progress">
            <ProgressBar :disabled="!hasCurrentSong" :percent="playedPercent" @percentChange="onProgressChange"/>
        </div>
        <audio :src="currentSong.url" @canplay="ready" @ended="end" @timeupdate="updateTime" ref="audio"></audio>
        <historyList v-show="showList"/>
    </div>
</template>

<script>
import historyList from './historyList' //歌单列表以及历史记录
import ProgressBar from './progress-bar'
import { getLyric, getSimiSongs, getSimilarPlaylists } from "../../api/MySongList"
import {mapState, mapMutations, mapGetters, mapActions} from '../../store/helper/music'
import {isDef} from '../../utils/common'
import {playModeMap} from '../../utils/config'
export default {
    name:'play',
    components:{
        ProgressBar,
        historyList
    },
    mounted(){
        this.$refs.audio.volume = sessionStorage.getItem('volume')?sessionStorage.getItem('volume'):0.75
    },
    data(){
        return{
            closeWord:true,
            volume: sessionStorage.getItem('volume')?sessionStorage.getItem('volume')*100:75, //音量
            tip:'顺序播放',
            mode:'sequence', //默认顺序播放
            songReady: false,
            isPlayErrorPromptShow: false,
            showList:false, //展示历史记录
        }
    },
    methods:{
        changeMode(mode){
            if(mode == 'sequence'){
                this.mode = 'sequence'
                this.tip = '顺序播放'
            }else if(mode == 'loop'){
                this.mode = 'loop'
                this.tip = '单曲循环'
            }else if(mode == 'random'){
                this.mode = 'random'
                this.tip = '随机播放'
            }

            const modeKeys = Object.keys(playModeMap)
            const currentModeIndex = modeKeys.findIndex(
                key => playModeMap[key].code === this.mode
            )
            const nextIndex = (currentModeIndex) % modeKeys.length
            const nextModeKey = modeKeys[nextIndex]
            const nextMode = playModeMap[nextModeKey]
            this.setPlayMode(nextMode.code)
        },
        //调音量
        changeVolume(){
            if(this.volume < 5){
                this.audio.volume = 0
            }else{
                this.audio.volume = this.volume / 100
            }
            sessionStorage.setItem('volume',this.volume / 100)
        },
        ready() {
            this.songReady = true
        },
        async play() {
            try {
                await this.audio.play()
                if (this.isPlayErrorPromptShow) {
                    this.isPlayErrorPromptShow = false
                }
            } catch (error) {
                // 提示用户手动播放
                this.isPlayErrorPromptShow = true
                this.setPlayingState(false)
            }
        },
        pause() {
            this.audio.pause()
        },
        //显示歌词
        openWord(){
            this.closeWord = !this.closeWord
            this.setPlayerShow(!this.isPlayerShow)
        },
        //播放音乐
        openPlay(){
            if(!this.currentSong.id){
                return
            }
            this.setPlayingState(!this.playing)
        },
        prev() {
            if (this.songReady) {
                this.startSong(this.prevSong)
            }
        },
        next() {
            if (this.songReady) {
                this.startSong(this.nextSong)
            }
        },
        
        end() {
            this.next()
        },
        onProgressChange(percent) {
            this.audio.currentTime = this.currentSong.durationSecond * percent
            this.setPlayingState(true)
        },
        updateTime(e) {
            const time = e.target.currentTime
            this.setCurrentTime(time)
        },
        ...mapMutations(["setCurrentTime",  "setPlayingState",  "setPlayMode",  "setPlaylistShow",  "setPlayerShow"]),
        ...mapActions(["startSong"])
    },
    watch:{
        playing(newPlaying) {
            this.$nextTick(() => {
                newPlaying ? this.play() : this.pause()
            })
        },
    },
    computed:{
        audio() {
            return this.$refs.audio
        },
        hasCurrentSong() {
            return isDef(this.currentSong.id)
        },
        // 播放的进度百分比
        playedPercent() {
            const { durationSecond } = this.currentSong
            return Math.min(this.currentTime / durationSecond, 1) || 0
        },
        ...mapState(["currentSong", "currentTime", "playing", "playMode", "isPlaylistShow", "isPlaylistPromptShow", "isPlayerShow"]),
        ...mapGetters(["prevSong", "nextSong"])
    },
}
</script>

<style scoped lang="scss">
    .playContainer{
        width:100%;
        height:60px;
        padding:10px;
        padding-left:30px;
        padding-right:30px;
        box-sizing: border-box;
        position: fixed;
        bottom:0;
        background-color: var(--play-bg-color);
        color:#fff;
        z-index:1;

        .leftContent{
            position: absolute;
            left:0;
            top:50%;
            transform: translate(30px,-50%);


            display: flex;
            flex-direction: row;
            align-items: center;

            .songImg{
                position: relative;
                width:40px;
                height:40px;
                border-radius: 4px;
                margin-right:10px;

                .songPict{
                    width:100%;
                    height:100%;
                    border-radius: 4px;
                }

                .clickImg{
                    width:18px;
                    height:18px;
                    position: absolute;
                    top:50%;
                    left:50%;
                    transform: translate(-50%,-50%);
                    cursor: pointer;
                }
            }
            

            .infoList{
                height: 35px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: flex-start;

                .name{
                    display: inline-block;
                    color:#fff;
                    font-size: 12px;
                    margin-bottom: 5px;
                }

                .time{
                    color:gray;
                    font-size: 10px;
                }
            }
        }

        .centerContent{
            display: flex;
            flex-direction: row;
            align-items: center;
            position: absolute;
            left:50%;
            top:50%;
            transform: translate(-50%,-50%);

            .playBtn{
                width:45px;
                height:45px;
                border-radius: 50%;
                background-color: #d33a31;
                margin-left:15px;
                margin-right:15px;
                position: relative;
                cursor: pointer;

                img{
                    width:24px;
                    height:25px;
                    position: absolute;
                    top:50%;
                    left:50%;
                    transform: translate(-50%,-50%);
                }
            }
        }

        .rightContent{
            display: flex;
            flex-direction: row;
            align-items: center;

            position: absolute;
            right:0;
            top:50%;
            transform: translate(-30px,-50%);

            .pict{
                width:25px;
                height:25px;
                margin-right:15px
            }
        }

        .progress{
            position: absolute;
            top:-15px;
            left:0;
            right:0
        }
    }
</style>