<template>
    <div class="listContainer">
        <div class="listTitle">
            <div class="pict">
                <img :src="playlist.coverImgUrl"/>
            </div>
            <div class="detail">
                <span class="name">{{playlist.name}}</span>
                <div class="info">
                    <img :src="playlist.creator.avatarUrl"/>
                    <span>{{playlist.creator.nickname}} {{playlist.createTime | timeFilter}} 创建</span>
                </div>
                <div>
                    <el-button icon="el-icon-video-play" @click="startAll">播放全部</el-button>
                </div>
                <div class="desciraption" v-show="playlist.tags[0] || playlist.description"> 
                    <div class="tag">
                        <span>标签：</span>
                        <span>{{playlist.tags | tag}}</span>
                    </div>
                    <div class="tag">
                        <span>简介：</span>
                        <span>{{playlist.description}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="listContent">
            <div class="tools">
                <ul>
                    <li style="margin-right:20px" :class="{liActive:num == 1}" @click="num = 1">歌曲列表</li>
                    <li :class="{liActive:num == 2}" @click="num = 2">评论（{{playlist.commentCount}}）</li>
                </ul>
                <el-input style="width:150px" placeholder="搜索歌单音乐" prefix-icon="el-icon-search" v-model="keywords" @input="getSearch"></el-input>
            </div>
            <Loading :loading="loading" v-if="loading"/>
            <songTable :songs="songs" v-if="num == 1 && !loading && !emptyList"/>
            <songComment v-if="num == 2" :id="id" type="playlist" ref="comment" />
            <div v-show="emptyList" class="emptyTip">
                <span>未能找到和“<span style='color:#517eaf'>{{keywords}}</span>”相关的任何音乐</span>
            </div>
        </div>
    </div>
</template>

<script>
import {heightLight} from '../../utils/heightLight' //高亮搜索字
import Loading from '../../components/Index/loading'
import songComment from '../../components/Song/comment' //评论
import songTable from '../../components/Song/songTable' //歌单列表
import {getListDetail, getSongDetail} from '../../api/MySongList' //歌曲列表 歌曲详情
import {getPlaylistComment} from '../../api/comment' //歌曲评论
import {createSong} from '../../utils/business'
import {mapState as mapMusicState, mapMutations as mapMusicMusicState, mapActions as mapMusicActions} from '../../store/helper/music'

const MAX = 500
const SONG_IDX = 0
const COMMENT_IDX = 1
export default {
    name:'MySongList',
    mounted(){
        this.init()
    },
    components:{
        songTable,
        songComment,
        Loading
    },
    data(){
        return{
            emptyList:false,
            loading:false,
            keywords:'', //搜索关键字
            num:1,
            playlist: {}, //头部信息
            songs: [], //歌单列表
            total:0
        }
    },
    computed:{
        id(){
            return Number(this.$route.query.id)
        }
    },
    watch:{
        id:{
            handler(){
                this.init()
            }
        }
    },
    methods:{
        //初始化页面信息
        async init(){
            const { playlist } = await getListDetail({id:this.id})
            this.playlist = playlist
            this.songs = this.getSonglist(playlist)
        },
        async getSonglist(playlist) {
            this.loading = true
            const trackIds = playlist.trackIds.map(({ id }) => id) //map中包含函数
            const songDetails = await getSongDetail(trackIds.slice(0, MAX)).finally(() => {
                this.loading = false
            }) //slice函数（start,end）
            const songs = songDetails.songs.map(({ id, name, al, ar, mv, dt }) =>
                createSong({
                    id,
                    name,
                    artists: ar,
                    duration: dt,
                    mvId: mv,
                    albumName: al.name,
                    img: al.picUrl,
                }),
            )
            
            this.songs = songs
        },
        //搜索关键词
        getSearch(){
            let arr = []
            if(this.keywords){
                this.songs.forEach(element => {
                    if(element.name.includes(this.keywords) || element.artistsText.includes(this.keywords)){
                        arr.push(element)
                    }
                });
               
                if(arr[0]){
                    this.songs = heightLight(arr,this.keywords)
                    this.emptyList = false
                }else{
                    this.emptyList = true
                }
            }else{
                this.init()
                this.emptyList = false
            }
        },
        //播放全部
        startAll(){
            this.startSong(this.songs[0])
            this.setPlaylist(this.songs)
        },
        ...mapMusicActions(['startSong']),
        ...mapMusicMusicState(['setPlaylist'])
    }
}
</script>

<style scoped lang="scss">
    .listContainer{
        width:100%;
        display: flex;
        flex-direction: column;
        padding-bottom: 70px;

        .listTitle{
            width:100%;
            display: flex;
            flex-direction: row;

            .pict{
                width:230px;
                height:240px;

                img{
                    width:100%;
                    height:100%
                }
            }

            .detail{
                margin-left:30px;
                flex: 1;
                display: flex;
                flex-direction: column;
                text-align: left;

                .name{
                    color:var(--list-font-color);
                    font-size: 20px;
                }
                .info{
                    display:flex;
                    flex-direction: row;
                    align-items: center;
                    margin-top:20px;
                    margin-bottom: 20px;

                    img{
                        width:35px;
                        height: 35px;
                        border-radius: 50%;
                    }

                    span{
                        color:var(--playlist-font-color);
                        margin-left:15px;
                    }
                }

                .desciraption{
                    display: flex;
                    flex-direction: column;
                    color:var(--playlist-font-color);
                    margin-top:20px;
                    font-size: 16px;

                    .tag{
                        display: flex;
                        flex-direction: row;

                        &:last-of-type{
                            margin-top:10px;
                            display: -webkit-box;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            word-wrap: break-word;
                            white-space: normal !important;
                            -webkit-line-clamp: 2;
                            /* 行数 2 */
                            -webkit-box-orient: vertical;
                        }
                    }
                }
                
                .el-button{
                    color:#fff;
                    border-color: #d53b32;
                    background: linear-gradient(to right, #fa5143, #f44d41, #d53b32);
                    font-size: 16px;
                }
            }
        }

        .listContent{
            display: flex;
            flex-direction: column;
            margin-top:40px;

            .tools{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                border-bottom: 1px solid #666665;

                ul{
                    display: flex;
                    flex-direction: row;
                    padding:0 0 0 20px;
                    margin:0;

                    li{
                        list-style-type:none;
                        color:var(--recommend-font-color);
                        font-size: 18px;
                        cursor: pointer;
                    }
                }
            }
        }
    }
    .liActive{
        color:var(--comment-active-font-color) !important;
        border-bottom: 3px solid var(--comment-active-font-color);
    }
    td:nth-child(3){
        color:rgb(223, 219, 219)
    }

    .emptyTip{
        width:100%;
        height:300px;
        line-height: 300px;
        color:#909399;
        font-size: 16px;
    }
</style>