<template>
    <transition name="slide">
        <div v-if="hasCurrentSong" :class="getPlayerShowCls()" class="player">
            <div class="wordContainer">
                <div class="topContent">
                    <div class="picts">
                        <img class="play-bar-support"  src="../../assets/img/play-bar-support.png"/>
                        <img :class="{playing}" class="play-bar" src="../../assets/img/play-bar.png"/>
                        <div class="img-outer-border" ref="disc">
                            <div  :class="{paused: !playing}" class="img-outer" ref="discRotate">
                                <div class="img-wrap">
                                    <img :src="currentSong.img"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="words">
                        <div class="name-wrap">
                            <p class="name">{{currentSong.name}}</p>
                            <span @click="onGoMv" class="mv-tag" v-if="currentSong.mvId">MV</span>
                        </div>
                        <div class="desc">
                            <div class="desc-item">
                                <span class="label">歌手：</span>
                                <div class="value">{{currentSong.artistsText}}</div>
                            </div>
                        </div>
                        <div class="noData" v-if="nolyric">还没有评论哦~</div>
                        <Scroller :data="lyric" :options="{disableTouch: true}" @init="onInitScroller" class="lyric-wrap" ref="scroller" v-else>
                            <div>
                                <div :class="getActiveCls(index)" :key="index" class="lyric-item" ref="lyric" v-for="(l,index) in lyricWithTranslation">
                                <p :key="contentIndex" class="lyric-text" v-for="(content, contentIndex) in l.contents">{{content}}</p>
                                </div>
                            </div>
                        </Scroller>
                    </div>
                </div>
                <div class="bottomContent">
                    <div class="comments">
                        <songComment :id="currentSong.id" ref="comments" v-if="currentSong.id"/>
                    </div>
                    <div class="songList">
                        <div class="simi" v-if="simiPlaylists.length">
                            <p class="title">包含这首歌的歌单</p>
                            <div  class="item" v-for="(simiPlaylist,index) in simiPlaylists" :key="index">
                                <img :src="simiPlaylist.coverImgUrl"/>
                                <div class="content">
                                    <span class="name">{{simiPlaylist.name}}</span>
                                    <div class="picts">
                                        <img src="../../assets/img/right.png"/>
                                        <span class="userNames">{{simiPlaylist.playCount | playCount}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="simi" v-if="simiSongs.length">
                            <p class="title">相似歌曲</p>
                            <div class="item" v-for="(simiSong,index) in simiSongs" :key="index">
                                <div class="itemBox">
                                    <img :src="simiSong.img" />
                                    <div class="tip">
                                        <img src="../../assets/img/openSong.png"/>
                                    </div>
                                </div>
                                <div class="content">
                                    <span class="name">{{simiSong.name}}</span>
                                    <span class="userName">{{simiSong.artistsText}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script> 

import songComment from '../../components/Song/comment'
import Scroller from './scroller'
import { getLyric, getSimiSongs, getSimilarPlaylists } from "../../api/MySongList"
import {mapState, mapMutations, mapGetters, mapActions} from '../../store/helper/music'
import lyricParser from "../../utils/lrcparse"
import {isDef} from '../../utils/common'
import {createSong, goMvWithCheck} from '../../utils/business'

const WHEEL_TYPE = "wheel"
const SCROLL_TYPE = "scroll"
// 恢复自动滚动的定时器时间
const AUTO_SCROLL_RECOVER_TIME = 1000
export default {
    name:'songWords',
    components:{
        Scroller,
        songComment
    },
    data(){
        return{
            lyric: [], //歌词
            nolyric: false, //是否有歌词
            simiPlaylists: [],
            simiSongs: [],    
        }
    },
    created() {
        this.lyricScrolling = {
            [WHEEL_TYPE]: false,
            [SCROLL_TYPE]: false
        }
        this.lyricTimer = {
            [WHEEL_TYPE]: null,
            [SCROLL_TYPE]: null
        }
    },
    methods:{
        clearTimer(type) {
            this.lyricTimer[type] && clearTimeout(this.lyricTimer[type])
        },
        onGoMv() {
            this.setPlayerShow(false)
            goMvWithCheck(this.currentSong.mvId)
        },
        async updateSong() {
            this.updateLyric()
            this.updateSimi()
        },
        async updateLyric() {
            const result = await getLyric(this.currentSong.id)
            this.nolyric = !isDef(result.lrc) || !result.lrc.lyric
            if (!this.nolyric) {
                const { lyric, tlyric } = lyricParser(result)
                this.lyric = lyric
                this.tlyric = tlyric
            }
        },
        async updateSimi() {
            this.simiLoading = true
            const [simiPlaylists, simiSongs] = await Promise.all([
                getSimilarPlaylists(this.currentSong.id),
                getSimiSongs(this.currentSong.id)
            ]).finally(() => {
                this.simiLoading = false
            })
            this.simiPlaylists = simiPlaylists.playlists
            this.simiSongs = simiSongs.songs.map(song => {
                const {
                    id,
                    name,
                    artists,
                    mvid,
                    album: { picUrl },
                    duration
                } = song
                return createSong({
                    id,
                    name,
                    artists,
                    duration,
                    img: picUrl,
                    mvId: mvid
                })
            })
        },
        getActiveCls(index) {
            return this.activeLyricIndex === index ? "active" : ""
        },
        onInitScroller(scoller) {
            const onScrollStart = type => {
                this.clearTimer(type)
                this.lyricScrolling[type] = true
            }
            const onScrollEnd = type => {
                // 滚动结束后两秒 歌词开始自动滚动
                this.clearTimer(type)
                this.lyricTimer[type] = setTimeout(() => {
                    this.lyricScrolling[type] = false
                }, AUTO_SCROLL_RECOVER_TIME)
            }
            scoller.on("scrollStart", onScrollStart.bind(null, SCROLL_TYPE))
            scoller.on("mousewheelStart", onScrollStart.bind(null, WHEEL_TYPE))

            scoller.on("scrollEnd", onScrollEnd.bind(null, SCROLL_TYPE))
            scoller.on("mousewheelEnd", onScrollEnd.bind(null, WHEEL_TYPE))
        },
        
        scrollToActiveLyric() {
            if (this.activeLyricIndex !== -1) {
                const { scroller, lyric } = this.$refs
                if (lyric && lyric[this.activeLyricIndex]) {
                scroller
                    .getScroller()
                    .scrollToElement(lyric[this.activeLyricIndex], 200, 0, true)
                }
            }
        },
        getPlayerShowCls() {
            return this.isPlayerShow ? "show" : "hide"
        },
        ...mapMutations(["setPlayerShow"]),
        ...mapActions(["startSong", "addToPlaylist"])
    },
    computed:{
        activeLyricIndex() {
            return this.lyricWithTranslation
                ? this.lyricWithTranslation.findIndex((l, index) => {
                    const nextLyric = this.lyricWithTranslation[index + 1]
                    return (
                        this.currentTime >= l.time &&
                        (nextLyric ? this.currentTime < nextLyric.time : true)
                    )
                })
                : -1
        },
        lyricWithTranslation() {
            let ret = []
            // 空内容的去除
            const lyricFiltered = this.lyric.filter(({ content }) => Boolean(content))
            // content统一转换数组形式
            if (lyricFiltered.length) {
                lyricFiltered.forEach(l => {
                    const { time, content } = l
                    const lyricItem = { time, content, contents: [content] }
                    const sameTimeTLyric = this.tlyric.find(
                        ({ time: tLyricTime }) => tLyricTime === time
                    )
                    if (sameTimeTLyric) {
                        const { content: tLyricContent } = sameTimeTLyric
                        if (content) {
                            lyricItem.contents.push(tLyricContent)
                        }
                    }
                    ret.push(lyricItem)
                })
            } else {
                ret = lyricFiltered.map(({ time, content }) => ({
                    time,
                    content,
                    contents: [content]
                }))
            }
            return ret
        },
        ...mapState(["currentSong", "currentTime", "playing", "isPlayerShow"]),
        ...mapGetters(["hasCurrentSong"])
    },
    watch:{
        activeLyricIndex(newIndex, oldIndex) {
            if (
                newIndex !== oldIndex &&
                !this.lyricScrolling[WHEEL_TYPE] &&
                !this.lyricScrolling[SCROLL_TYPE]
            ) {
                this.scrollToActiveLyric()
            }
        },
        $route() {
            this.setPlayerShow(false)
        },
        isPlayerShow(show) {
            if (show) {
                // 歌词短期内不会变化 所以只拉取相似信息
                this.updateSimi()
                this.$nextTick(() => {
                    this.scrollToActiveLyric()
                })
            }
        },
        currentSong(newSong, oldSong) {
            if (!newSong.id) {
                this.setPlayerShow(false)
                return
            }
            if (newSong.id === oldSong.id) {
                return
            }
            // 如果歌曲详情显示状态切歌 需要拉取歌曲相关信息
            if (this.isPlayerShow) {
                this.updateSong()
            } else {
                // 否则只是更新歌词
                this.updateLyric()
            }
        },
    }
}
</script>

<style scoped lang="scss">
    @keyframes rotate {
        0% {
            transform: rotate(0);
        }

        100% {
            transform: rotate(1turn); //旋转一圈
        }
    }

    $img-left-padding: 36px;
    $img-outer-border-d: 320px;
    $img-outer-d: 300px;

    .player{
        width:100%;
        position: fixed;
        top: 60px;
        bottom: 60px;
        left: 0;
        right: 0;
        padding: 0 36px;
        background: var(--main-bg-color);
        z-index: 2059;
        overflow: hidden;
        overflow-y: auto;
        transition: transform 0.5s;
        box-sizing: border-box;

        &.hide {
            transform: translateY(115%);
        }

        &.show {
            transform: none;
        }

        .wordContainer{
            max-width: 870px;
            display: flex;
            flex-direction: column;
            margin:0 auto;

            .topContent{
                display: flex;
                flex-direction: row;

                .picts {
                    position: relative;
                    padding: 80px 70px 0 $img-left-padding;
                    display: flex;
                    justify-content: center;

                    $support-d: 30px;
                    $support-d-half: $support-d / 2;

                    .play-bar-support {
                        position: absolute;
                        left: $img-left-padding + $img-outer-border-d / 2 - $support-d / 2;
                        top: -$support-d-half;
                        width: $support-d;
                        height: $support-d;
                        z-index: 2;
                    }

                    .play-bar {
                        $w: 100px;
                        $h: 146px;
                        position: absolute;
                        top: 0;
                        left: $img-left-padding + $img-outer-border-d / 2 - 6px;
                        width: $w;
                        height: $h;
                        z-index: 1;
                        transform-origin: 0 0;
                        transform: rotate(-30deg);
                        transition: all 0.3s;

                        &.playing {
                            transform: rotate(5deg);
                        }
                    }

                    .img-outer-border {
                        @include round($img-outer-border-d);
                        @include flex-center;
                        background: var(--song-shallow-grey-bg);

                        .img-outer {
                            @include round($img-outer-d);
                            @include flex-center;
                            background: $black;
                            background: linear-gradient(-45deg, #333540, #070708, #333540);
                            animation: rotate 20s linear infinite;

                            &.paused {
                                animation-play-state: paused;
                            }

                            .img-wrap {
                                @include img-wrap(200px);

                                img {
                                    border-radius: 50%;
                                }
                            }
                        }
                    }
                }

                .words{
                    flex:1;
                    padding-top:45px;

                    .name-wrap {
                        display: flex;
                        align-items: center;
                        margin-bottom: 16px;

                        .name {
                            font-size: 30px;
                            color: #fff;
                            margin:0;
                        }

                        .mv-tag {
                            display: inline-block;
                            margin-left: 8px;
                            padding: 2px;
                            border: 1px solid currentColor;
                            border-radius: 2px;
                            color: var(--comment-active-font-color);
                            cursor: pointer;
                        }
                    }

                    .artists {
                        margin-bottom: 16px;
                    }

                    .desc {
                        display: flex;
                        font-size: 14px;
                        margin-bottom: 30px;

                        .desc-item {
                            display: flex;
                            margin-right: 32px;
                            .label {
                                display: inline-block;
                                margin-right: 4px;
                                color:var(--playlist-font-color);
                            }

                            .value {
                                color: var(--nickname-font-color);
                            }
                        }
                    }

                    .lyric-wrap {
                        width: 380px;
                        height: 350px;
                        -webkit-mask-image: linear-gradient(
                            180deg,
                            hsla(0, 0%, 100%, 0) 0,
                            hsla(0, 0%, 100%, 0.6) 15%,
                            #fff 25%,
                            #fff 75%,
                            hsla(0, 0%, 100%, 0.6) 85%,
                            hsla(0, 0%, 100%, 0)
                        );
                        mask-image: linear-gradient(
                            180deg,
                            hsla(0, 0%, 100%, 0) 0,
                            hsla(0, 0%, 100%, 0.6) 15%,
                            #fff 25%,
                            #fff 75%,
                            hsla(0, 0%, 100%, 0.6) 85%,
                            hsla(0, 0%, 100%, 0)
                        );

                        .lyric-item {
                            margin-bottom: 16px;
                            font-size: $font-size-sm;
                             color:var(--playlist-font-color);

                            .lyric-text {
                                margin-bottom: 8px;
                            }

                            &.active {
                                font-size: $font-size;
                                color: #fff !important;
                                font-weight: $font-weight-bold;
                            }

                            
                        }
                    }
                }
            }

            .bottomContent{
                display: flex;

                .comments{
                    flex:1;
                }

                .songList{
                    padding-left: 36px;
                    width: 28%;
                    overflow: hidden;

                    .simi{
                        display: flex;
                        flex-direction: column;

                        .title{
                            color:var(--playlist-font-color);
                            font-size: 16px;
                            font-weight: bold;
                            text-align: left;
                        }

                        .item{
                            display: flex;
                            flex-direction: row; 
                            margin-bottom: 10px;
                            img{
                                width:65px;
                                height:65px;
                                border-radius: 5px;
                            }

                            .content{
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                margin-left:10px;

                                .name{
                                    color:var(--playlist-font-color);
                                    width:180px;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                }

                                .userName{
                                    color:var(--comment-time-font-color);
                                    padding-top:8px
                                }

                                .picts{
                                    display: flex;
                                    flex-direction: row;
                                    align-items: center;

                                    img{
                                        width:35px;
                                        height:35px;
                                    }

                                    .userNames{
                                        color:var(--comment-time-font-color);
                                    }
                                }
                            }

                            .itemBox{
                                position: relative;

                                .tip{
                                    position: absolute;
                                    top:50%;
                                    left:50%;
                                    transform: translate(-50%,-50%);

                                    width:35px;
                                    height:35px;
                                    border-radius: 50%;
                                    background-color: rgba(255, 255, 255, 0.5);
                                    display: flex;
                                    flex-direction: row;
                                    justify-content: center;
                                    align-items: center;

                                    img{
                                        width:15px;
                                        height:15px;
                                    }
                                }
                            }
                        }
                    }

                    
                }
            }
        }
    }
</style>