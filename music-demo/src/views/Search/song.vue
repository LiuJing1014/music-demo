<template>
    <div class="tableContainer">
        <Loading :loading="loading" v-if="loading"/>
        <table v-else>
            <tr>
                <td style="width:80px"></td>
                <td style="color:var(--searchList-title-color);width:450px">音乐标题</td>
                <td style="width:400px">歌手</td>
                <td style="width:400px">专辑</td>
                <td style="width:30px">时长</td>
            </tr>
            <tbody v-for="(item,index) in normalizedSongs" :key="index" @click="starPlay(item)">
                <tr>
                    <td :rowspan="item.alias.length>0?2:1">
                        <span v-show="currentSong.id != item.id">{{index+1 | addZero}}</span>
                        <img class="openImg" v-show="currentSong.id == item.id" src="../../assets/img/opening.png"/>
                    </td>
                    <div class="video">
                        <td v-html='item.name' style="color:var(--searchList-title-color)" :class="{active:currentSong.id == item.id}"></td>
                        <img :src="isRed?required('../../assets/img/video-red.png'):required('../../assets/img/video.png')" v-show="item.mvId != 0" @click.stop="toMV(item)"/>
                    </div>
                    <td :rowspan="item.alias.length>0?2:1" v-html='item.artistsText'></td>
                    <td :rowspan="item.alias.length>0?2:1" v-html='item.albumName'></td>
                    <td :rowspan="item.alias.length>0?2:1">{{item.durationSecond | songTime}}</td>
                </tr>
                <tr v-if="item.alias.length>0">
                    <td style="padding-left:10px">{{item.alias.length>0?item.alias[0]:''}}</td>
                </tr>
            </tbody>
        </table>
        <el-pagination layout="prev, pager, next" :page-size="30" :total="total" @current-change="handleCurrentChange" v-show="total > 0 && !loading"></el-pagination>
    </div>
</template>

<script>
import {mapState as mapMusicState, mapMutations as mapMusicMusicState, mapActions as mapMusicActions} from '../../store/helper/music'
import { getSearch } from "../../api/search"
import { getPageOffset } from '../../utils/common'
import Loading from '../../components/Index/loading'
import {heightLight,removeHeightLight,removeAllHeightLight} from '../../utils/heightLight'
import {createSong} from '../../utils/business'
export default {
    name:'song',
    components:{
        Loading
    },
    created(){
        this.getSongs()
        if(sessionStorage.getItem('theme_key') == 'red'){
            this.isRed = true
        }else{
            this.isRed = false
        }
    },
    data(){
        return{
            songs:[], //歌曲列表
            total:0,
            currentPage:1,
            loading:false,
            isRed:false
        }
    },
    methods:{
        //歌曲
        async getSongs() {
            this.loading = true
            const { result } = await getSearch({
                keywords: this.$route.query.keyWords,
                limit: 30,
                offset: getPageOffset(this.currentPage, 30)
            }).finally(() => {
                this.loading = false
            })

            this.songs = result.songs
            this.total = result.songCount
            this.$emit('changeTotal',result.songCount)
        },
        //播放歌曲
        starPlay(item){
            this.startSong(removeHeightLight(item))
            this.setPlaylist(removeAllHeightLight(this.normalizedSongs))
        },
        //播放MV
        toMV(item){
            this.$router.push({name:'mvDetail',query:{id:item.mvId,type:'recommended'}})
        },
        //换页
        async handleCurrentChange(val) {
            this.currentPage = val
            await this.getSongs()
        },
        //整理搜索结果进行显示 歌曲
        nomalizeSong(song) {
            const {id,name,artists,alias,duration,mvid,album: { id: albumId, name: albumName }} = song
            return createSong({id,name,alias,artists,duration,albumId,albumName,mvId: mvid})
        },
        ...mapMusicActions(['startSong']),
        ...mapMusicMusicState(['setPlaylist', "setPlayingState"])
    },
    computed:{
        normalizedSongs() {
            let arr =  this.songs.map(song => this.nomalizeSong(song))
            return heightLight(arr,this.$route.query.keyWords)
        },
        ...mapMusicState(['currentSong','playing'])
    },
    watch:{
        $route(){
            this.getSongs()
        }
    }
}
</script>

<style scoped lang="scss">
    .tableContainer{
        color:#b1b1b1;
        padding-bottom: 70px;

        table{
            border-collapse: collapse;
            color:#808080;
            tbody{
                cursor: pointer;
                &:nth-child(odd){
                    background-color: var(--searchList-odd-color);
                }

                &:hover{
                    background-color: var(--searchList-hover-color);
                }
            }
            tr{
                height:20px;
                td{
                    padding-top:10px;
                    padding-bottom: 10px;

                    &:first-of-type{
                        padding-left:10px
                    }
                    &:last-of-type{
                        padding-right:10px
                    }

                    .openImg{
                        width:20px;
                        height:20px
                    }
                }

                .video{
                    width:450px;
                    height:40px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    img{
                        width:16px;
                        height:16px;
                        cursor: pointer;
                    }
                }
            }
        }
    }
    .active{
        color:#d33a31 !important
    }
</style>