<template>
    <div class="musicContainer">
        <div class="titleTip">
            <ul v-for="(item,index) in tips" :key="index">
                <li :class="{active:index == activeTabIndex}" @click="getKindList(index)">{{item.title}}</li>
            </ul>
        </div>
        <Loading :loading="loading" v-if="loading"/>
        <div class="songList" v-else>
            <table>
                <tr v-for="(item,index) in musicList" :key="index" @click="startPlay(item)">
                    <td class="index">
                        <span v-show="currentSong.id != item.id">{{index+1 | addZero}}</span>
                        <img class="openImg" v-show="currentSong.id == item.id" :src="isRed?require('../../assets/img/opening-red.png'):require('../../assets/img/opening.png')"/>
                    </td>
                    <td class="pictImg">
                        <div class="tip">
                            <img :src="item.img" />
                            <div class="circle">
                                <img src="../../assets/img/openSong.png"/>
                            </div>
                        </div>
                    </td>
                    <td class="songName">
                        <div class="playVideo">
                            <span :class="{playing:currentSong.id == item.id}">{{item.name}}</span>
                            <img class="video" :src="isRed?require('../../assets/img/video-red.png'):require('../../assets/img/video.png')" v-show="item.mvId != 0" @click.stop="getDetail(item)"/>
                        </div>
                    </td>
                    <td class="artistsText">{{item.artistsText}}</td>
                    <td class="albumName">{{item.albumName}}</td>
                    <td>{{item.durationSecond | songTime}}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import Loading from '../../components/Index/loading' //加载中
import {mapState, mapMutations, mapActions} from '../../store/helper/music'
import {createSong} from '../../utils/business'
import {getTopSongs} from '../../api/MySongList' //最新音乐
export default {
    name:'LatestMusic',
    components:{
        Loading
    },
    async created(){
        this.getSongsList()
        if(sessionStorage.getItem('theme_key') == 'red'){
            this.isRed = true
        }else{
            this.isRed = false
        }
    },
    data(){
        return{
            loading:false,
            activeTabIndex:0,
            tips:[{ title: "全部", type: 0 },{ title: "华语", type: 7 },{ title: "欧美", type: 96 },{ title: "日本", type: 8 },{ title: "韩国", type: 16 }],
            musicList:[],
            isRed:false
        }
    },
    methods:{
        async getSongsList(){
            this.loading = true
            const {data} = await getTopSongs(this.tips[this.activeTabIndex].type).finally(() => {
                this.loading = false
            })
            this.musicList = data.map(song => {
                const {id,name,artists,duration,mvid,album: { picUrl, name: albumName }} = song
                return createSong({id,name,artists,duration,albumName,img: picUrl,mvId: mvid})
            })
        },
        getKindList(index){
            this.activeTabIndex = index
            this.getSongsList()
        },
        getDetail(item){
            this.$router.push({name:'mvDetail',query:{id:item.mvId}})
        },
        startPlay(item){
            this.startSong(item)
            this.setPlaylist(this.musicList)
        },
        ...mapActions(['startSong']),
        ...mapMutations(['setPlaylist'])
    },
    computed:{
        ...mapState(['currentSong'])
    }
}
</script>

<style scoped lang="scss">
    .musicContainer{
        width:100%;
        display: flex;
        flex-direction: column;
        padding-bottom: 70px;

        .titleTip{
            display: flex;
            flex-direction: row;
            color:var(--playlist-table-font-color);
            justify-content: flex-end;
            margin-bottom: 20px;
            font-size: 15px;

            ul{
                padding-left:20px;
                li{
                    cursor: pointer;
                }
            }
        }

        .songList{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            flex-wrap: wrap;

            table{
                border:none;
                border-collapse: collapse;
                tr{
                    height:80px;
                    color:var(--playlist-table-font-color);
                    padding:0;

                    td{
                        padding:0;
                        margin:0;
                        box-sizing: border-box;
                        padding-bottom: 6px;
                        
                        .playVideo{
                            display: flex;
                            flex-direction: row;
                            align-items: center;

                            span{
                                white-space: nowrap;
                                overflow: hidden;
                            }

                            .video{
                                width:20px;
                                height:20px;
                                margin-left:10px;
                                cursor: pointer;
                            }
                        }

                        .openImg{
                            width:20px;
                            height:20px
                        }

                        &:last-of-type{
                            padding-right:10px
                        }
                    }

                    .index{
                        width:60px;
                        padding-left:10px;
                    }
                    .pictImg{
                        width:80px;
                    }

                    .songName{
                        width:420px;
                        color:var(--searchList-title-color);
                        padding-left:20px;
                    }

                    .artistsText{
                        width:420px;
                        padding-left:20px;
                    }

                    .albumName{
                        width:420px;
                        padding-left:20px;
                    }

                    &:hover{
                        background-color: var(--list-hover-color);
                    }
                }
            }
        }
    }
    .active{
        color:var(--comment-active-font-color)
    }
    .playing{
        color:var(--comment-active-font-color) !important
    }
</style>