<template>
    <div class="mvDetailContainer">
        <div class="leftContent">
            <div class="play">
                <span>mv详情</span>
                <div class="player">
                    <VideoPlayer :url = "mvPlayInfo.url" ref="video"></VideoPlayer>
                </div>
            </div>
            <div class="artInfo">
                <div class="avatar">
                    <el-avatar :size="80" :src="artist.picUrl" fit="cover"></el-avatar>
                    <span>{{mvDetail.artistName}}</span>
                </div>
                <span class="name">{{mvDetail.name}}</span>
                <div class="relese">
                    <span>发布：{{mvDetail.publishTime}}</span>
                    <span style="margin-left:20px">播放：{{mvDetail.playCount}} 次</span>
                </div>
            </div>
            <div>
                <div>
                    <songComment :id='id' type="mv"/>
                </div>
            </div>
        </div>
        <div class="rightContent">
            <span class="title">相关推荐</span>
            <div class="listContainer">
                <div class="item" v-for="(item,index) in simiMvs" :key="index">
                    <div class="pict">
                        <img class="imgs" :src="item.cover" />
                        <span class="time">{{item.duration/1000 | songTime}}</span>
                        <div class="open">
                            <img src="../../assets/img/stop.png"/>
                            <span>{{item.playCount | playCount}}</span>
                        </div>
                        <div class="players" @click="goOpen(item)">
                            <img src="../../assets/img/openSong.png" />
                        </div>
                    </div>
                    <div class="list">
                        <span class="title">{{item.name}}</span>
                        <span class="name">by {{item.artistName}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getMvDetail, getMvUrl, getSimiMv, getArtists} from '../../api/mv'
import songComment from '../../components/Song/comment' //歌曲评论
import VideoPlayer from '../../components/LatestMV/video-player' //播放器
import {genImgUrl} from '../../utils/common'
export default {
    name:'mvDetail',
    components:{
        VideoPlayer,
        songComment
    },
    computed:{
        id(){
            return Number(this.$route.query.id)
        }
    },
    created(){
        this.init()
    },
    data(){
        return{
            mvDetail:{}, //mv详情
            mvPlayInfo:"",
            artist:{}, //作者信息
            simiMvs:[], //相似MV
        }
    },
    methods:{
        async init(){
            const [ {data:mvDetail}, {data:mvPlayInfo}, {mvs:simiMvs} ] = await Promise.all([
                getMvDetail(this.id),
                getMvUrl(this.id),
                getSimiMv(this.id)
            ])

            const { artist } = await getArtists(mvDetail.artistId)

            this.mvDetail = mvDetail
            this.mvPlayInfo = mvPlayInfo
            this.simiMvs = simiMvs
            this.artist = artist

            this.$nextTick(() => {
                const player = this.$refs.video.player
                player.emit('resourceReady', getResource(this.mvDetail.brs, mvPlayInfo))
            })

        },
        goOpen(item){
            this.$router.push(`/index/mvDetail?id=${item.id}&type=recommended`)
        }
    },
    watch:{
        id:'init'
    }
}

function getResource (brs, mvPlayInfo) {
    const { url: mvPlayInfoUrl, r: mvPlayInfoBr } = mvPlayInfo
    const keyNameMap = {
        "240":'标清',
        "480":'高清',
        "720":'超清',
        "1080":'1080P',
    }

    return brs.map((key) =>{
        // 优先使用mvPlayInfo里的数据
        const findPreferUrl = key.br === mvPlayInfoBr
        const name = keyNameMap[key.br]
        const url = findPreferUrl ? mvPlayInfoUrl : brs[key]
        return {url, name}
    })
}
</script>

<style scoped lang="scss">
    .mvDetailContainer{
        width:100%;
        display: flex;
        flex-direction: row;
        box-sizing: border-box;
        padding-left:130px;

        .leftContent{
            width:800px;

            .play{
                color:var(--playlist-font-color);
                font-size: 20px;
                font-weight: bold;
                text-align: left;

                .player{
                    width:785px;
                    height:435px;
                    border-radius: 8px;
                    margin-top:20px;
                    background-color: #000;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                }
            }

            .artInfo{
                margin-top:20px;
                margin-bottom: 30px;
                display: flex;
                flex-direction: column;

                .avatar{
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    span{
                        color:var(--playlist-font-color);
                        margin-left:15px;
                        font-size: 18px;
                    }
                }

                .name{
                    font-size: 24px;
                    font-weight: bold;
                    color:var(--playlist-font-color);
                    text-align: left;
                    margin-top:30px
                }

                .relese{
                    display: flex;
                    flex-direction: row;
                    color:var(--comment-time-font-color);
                    font-size: 14px;
                    margin-top:20px;
                }
            }
        }

        .rightContent{
            flex:1;
            margin-left:50px;
            text-align: left;


            .title{
                color:var(--playlist-font-color);
                font-size: 20px;
                font-weight: bold;
            }

            .listContainer{
                margin-top:20px;
                display: flex;
                flex-direction: column;

                .item{
                    display: flex;
                    flex-direction: row;
                    margin-bottom: 20px;

                    .pict{
                        position: relative;
                        .imgs{
                            width:180px;
                            height:100px;
                            border-radius: 5px;
                        }

                        .time{
                            color:#fff;
                            position: absolute;
                            right:15px;
                            bottom:10px
                        }

                        .open{
                            position: absolute;
                            right:15px;
                            top:10px;
                            color:#fff;
                            display: flex;
                            flex-direction: row;
                            align-items: center;

                            img{
                                width:20px;
                                height:20px;
                                margin-right:5px;
                            }
                        }

                        .players{
                            position: absolute;
                            top:50%;
                            left:50%;
                            transform: translate(-50%,-50%);
                            width:50px;
                            height:50px;
                            border-radius: 50%;
                            background-color: rgba(255, 255, 255, 0.5);
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            justify-content: center;
                            opacity: 0;
                            transition: all 0.3s;
                            cursor: pointer;

                            img{
                                width:18px;
                                height:18px;
                            }
                        }

                        &:hover{
                            .players{
                                opacity: 1;
                            }
                        }
                    }
                    
                    

                    .list{
                        display: flex;
                        flex-direction: column;
                        margin-left:20px;
                        justify-content: center;

                        .title{
                            color:var(--playlist-font-color);
                            font-size: 18px;
                        }

                        .name{
                            color:var(--comment-time-font-color);
                            font-size: 16px;
                            margin-top:6px;
                        }
                    }

                    &:hover{
                        background-color: var(--list-hover-color);
                    }
                }  
            }
        }
    }
</style>