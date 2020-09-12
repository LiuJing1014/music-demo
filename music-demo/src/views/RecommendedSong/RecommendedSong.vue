<template>
    <div class="recommendContainer">
        <template v-if="loading">
            <Loading :loading="loading" />
        </template>
        <template v-else>
            <div class="topInfo" v-if="playlists[0]">
                <div class="pictsArea">
                    <div class="qualityContainer">
                        <div class="pict">
                            <img :src="playlists[0].coverImgUrl"/>
                        </div>
                        <div class="songInfo">
                            <div class="title">
                                <span>精品歌单</span>
                            </div>
                            <div class="name">
                                <span>{{playlists[0].name}}</span>
                            </div>
                            <div class="detail">
                                <p>{{playlists[0].description}}</p>
                            </div>
                        </div>
                    </div>
                    <div class="background" :style="{ backgroundImage: `url(${playlists[0].coverImgUrl})` }"></div>
                    <div class="background-mask"></div>
                </div>
            </div>
            <div class="bottomContent">
                <div class="listContainer">
                    <div class="titleTip">
                        <ul v-for="(item,index) in tips" :key="index">
                            <li @click="getKindList(index)" :class="{active:index == activeTabIndex}">{{item}}</li>
                        </ul>
                    </div>
                    <div class="songList">
                        <div v-for="(item,index) in songList" :key="index" class="item">
                            <div class="songItem">
                                <img :src="item.coverImgUrl" @click="getDetails(item)"/>
                                <div class="text">
                                    <span>播放量：{{item.playCount | playCount}}</span>
                                </div>
                                <div class="icon">
                                    <div class="circle">
                                        <img src="../../assets/img/openSong.png"/>
                                    </div>
                                </div>
                            </div>
                            <span>{{item.name}}</span>
                        </div>
                    </div>
                    <el-pagination layout="prev, pager, next" :page-size="50" :total="total" @current-change="handleCurrentChange" v-show="total > 0"></el-pagination>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import Loading from '../../components/Index/loading' //加载中
import {getTopPlaylists, getPlaylists} from '../../api/MySongList' //精品歌单 歌曲列表
import {getPageOffset} from '../../utils/common'
export default {
    name:'RecommendedSong',
    components:{
        Loading
    },
    async created(){
        this.getPlayList()
        this.getSongList()
    },
    data(){
        return{
            loading:false,
            currentPage:1,
            activeTabIndex:0,
            total:0,
            tips:['全部','欧美','华语','流行','说唱','摇滚','民谣','电子','轻音乐','影视原声','ACG','怀旧','治愈','旅行'],
            playlists:[], //精品歌单
            songList:[], //歌单列表
        }
    },
    methods:{
        //精品歌单
        async getPlayList(){
            this.loading = true
            const {playlists} = await getTopPlaylists({limit:1,cat: this.tips[this.activeTabIndex]}).finally(() => {
                this.loading = false
            })
            this.playlists = playlists
        },
        //歌曲列表
        async getSongList(){
            this.loading = true
            const {playlists,total} = await getPlaylists({limit:50,offset: getPageOffset(this.currentPage, 50),cat: this.tips[this.activeTabIndex]}).finally(() => {
                this.loading = false
            })
            this.songList = playlists
            this.total = total
        },
        //更换类型
        getKindList(index){
            this.activeTabIndex = index
            this.currentPage = 1
            this.getPlayList()
            this.getSongList()
        },
        //换页
        handleCurrentChange(val){
            this.currentPage = val
            this.getSongList()
        },
        //详情
        getDetails(item){
            this.$router.push({name:'playlist',query:{id:item.id,type:'recommendedSong'}})
        }
    }
}
</script>

<style scoped lang="scss">
    .recommendContainer{
        width:100%;
        height:100%;
        display: flex;
        flex-direction: column;

        .topInfo{
            width: 100%;
            position: relative;
            border-radius: 4px;
            cursor: pointer;

            .pictsArea{ 
                position: relative;
                overflow: hidden;
                .background {
                    @include abs-stretch;
                    filter: blur(16px);
                    z-index: 0;
                }

                .background-mask {
                    @include abs-stretch;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 0;
                    border-radius: 4px;
                }

                .qualityContainer{
                    position: relative;
                    z-index: 1;
                    display: flex;
                    padding: 16px;
                    

                    .pict{
                        widows: 200px;
                        height: 204px;
                        border-radius: 4px;

                        img{
                            width:200px;
                            height:204px;
                            border-radius: 4px;
                        }
                    }

                    .songInfo{
                        flex-grow: 1;
                        display: flex;
                        flex-direction: column;
                        margin-left:20px;

                        .title{
                            border:1px solid #e7aa5a;
                            color:#e7aa5a;
                            width:120px;
                            border-radius: 4px;
                            text-align: center;
                            font-size: 18px;
                            padding-top:5px;
                            padding-bottom: 5px;
                            margin-bottom: 15px;
                        }

                        .name{
                            color:#fff;
                            font-size: 20px;
                            text-align: left;
                        }

                        .detail{
                            color:#909399;
                            text-align: left;

                            p{
                                margin-bottom: 0;
                                margin-top:15px;
                                display: -webkit-box;
                                -webkit-box-orient: vertical;
                                -webkit-line-clamp: 6;
                                overflow: hidden;
                            }
                        }
                    }
                }
            }
        }

        .bottomContent{
            flex-grow: 1;
            margin-top:30px;

            .listContainer{
                width:100%;
                display: flex;
                flex-direction: column;
                padding-bottom: 70px;

                .titleTip{
                    display: flex;
                    flex-direction: row;
                    color:var(--recommend-font-color);
                    justify-content: flex-end;
                    margin-bottom: 20px;

                    ul{
                        padding-left:20px;
                        li{
                            cursor: pointer;
                            white-space: nowrap;
                            &:hover{
                                color:rgb(199, 194, 194)
                            }
                        }
                    }
                }

                .songList{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    flex-wrap: wrap;

                    .item{
                        width:calc(20% - 10px);
                        padding:5px 5px 30px 5px;
                        display: flex;
                        flex-direction: column;

                        span{
                            height:25px;
                            font-size: $font-size-medium;
                            color: var(--playlist-font-color);
                            margin-top:10px;
                            text-align: left;
                            white-space:nowrap;
                            overflow: hidden;
                            text-overflow:ellipsis;
                        }
                    }
                }
            }
    
        }
    }
    .active{
        color:var(--comment-active-font-color)
    }
    .songItem{
        width:100%;
        height:100%;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
        cursor: pointer;

        img{
            width:100%;
            height:100%;
            border-radius: 5px;
        }

        .name{
            font-size: $font-size-medium;
            color: $font-color;
            margin-top:10px;
            text-align: left;
            white-space:nowrap;
            overflow: hidden;
            text-overflow:ellipsis;
        }

        .text{
            text-align: left;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            word-break: break-all;
            word-wrap:break-word;
            position: absolute;
            padding:6px 5px;
            left:0;
            top:0;
            right:0;
            background-color:  rgba(0, 0, 0, 0.4);
            transform: translateY(-100%);
            transition: all 0.3s;
            box-sizing: border-box;

            span{
                color:#fff !important
            }
        }

        .icon{
            width:40px;
            height:40px;
            position: absolute;
            bottom:10px;
            right:20px;
            opacity: 0;
            transition: all 0.3s;

            .circle{
                width:40px;
                height:40px;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.5);
                position: absolute;
                top:50%;
                left:50%;
                transform: translate(-50%,-50%);

                img{
                    width:15px;
                    height:15px;
                    position: absolute;
                    top:50%;
                    left:50%;
                    transform: translate(-50%,-50%);   
                }
            }  
        }

        &:hover{  //滑下动画
            .text{
                transform:translateY(0);
            }
            .icon{
                opacity: 1;
            }
        }
    }
</style>