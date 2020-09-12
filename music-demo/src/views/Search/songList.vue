<template>
    <div class="listContainer">
        <Loading :loading="loading" v-if="loading"/>
        <div class="songList" v-else>
            <div v-for="(item,index) in songList" :key="index" class="item">
                <div class="songItem">
                    <img :src="item.coverImgUrl" @click="getDetails(item)"/>
                    <div class="text">
                        <span>播放量：{{item.playCount | playCount}}</span>
                    </div>
                    <div class="icon">
                        <div class="circle" @click="getDetails(item)">
                            <img src="../../assets/img/openSong.png"/>
                        </div>
                    </div>
                </div>
                <span>{{item.name}}</span>
            </div>
        </div>
        <el-pagination layout="prev, pager, next" :page-size="50" :total="total" @current-change="handleCurrentChange" v-show="total > 0 && !loading"></el-pagination>
    </div>
</template>

<script>
import Loading from '../../components/Index/loading'
import { getSearch } from "../../api/search"
import { getPageOffset } from '../../utils/common'
export default {
    name:'songList',
    components:{
        Loading
    },
    created(){
        this.getSongLists()
    },
    data(){
        return{
            songList:[],
            total:0,
            loading:false,
            currentPage:1
        }
    },
    methods:{
        //歌单
        async getSongLists() {
            this.loading = true
            const { result } = await getSearch({
                keywords: this.$route.query.keyWords,
                limit: 50,
                offset: getPageOffset(this.currentPage, 30),
                type:1000
            }).finally(() => {
                this.loading = false
            })

            this.songList = result.playlists
            this.total = result.playlistCount
            this.$emit('changeTotal',result.playlistCount)
        },
        //换页
        handleCurrentChange(val){
            this.currentPage = val
            this.getSongLists()
        },
        //详情
        getDetails(item){
            this.$router.push({name:'playlist',query:{id:item.id,type:'recommendedSong'}})
        }
    }
}
</script>

<style scoped lang="scss">
    .listContainer{
        padding-top:30px;
        padding-bottom: 70px;
        .songList{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            flex-wrap: wrap;

            .item{
                padding:5px 5px 30px 5px;
                display: flex;
                flex-direction: column;

                span{
                    width:240px;
                    font-size: $font-size-medium;
                    color: $font-color;
                    margin-top:10px;
                    text-align: left;
                    white-space:nowrap;
                    overflow: hidden;
                    text-overflow:ellipsis;
                }
            }
        }
    }
    .songItem{
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
        cursor: pointer;

        img{
            width:240px;
            height:240px;
            border-radius: 5px;
        }

        .name{
            width:240px;
            font-size: $font-size-medium;
            color: $font-color;
            margin-top:10px;
            text-align: left;
            white-space:nowrap;
            overflow: hidden;
            text-overflow:ellipsis;
        }

        .text{
            width:240px;
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