<template>
    <div class="historyContainer">
        <div class="records" v-show="!isSearching">
            <div class="part">
                <span class="title">热门搜索</span>
                <div class="item">
                    <span v-for="(item,index) in hotList" :key="index" @click="toSearch(item)">{{item.first}}</span>
                </div>
            </div>
            <div class="part">
                <span class="title">搜索历史</span>
                <div class="item" v-if="historyList[0]">
                    <span v-for="(item,index) in historyList" :key="index" @click="toSearch(item)">{{item.first}}</span>
                </div>
                <span class="empty" v-else>暂无搜索历史</span>
            </div>
        </div>
        <div class="song" v-show="isSearching">
            <div v-show="normalizedSongs.length">
                <div class="part">
                    <img src="../../assets/img/musicNote.png"/>
                    <span class="title">单曲</span>
                </div>
                <div class="songItem">
                    <div v-for="(item,index) in normalizedSongs" :key="index" class="items" @click="startPlay(item)">
                        <span  v-html="item.name"></span>
                        <span> - </span>
                        <span v-html="item.artistsText"></span>
                    </div>
                </div>
            </div>
            <div v-show="normalizedPlayList.length">
                <div class="part">
                    <img src="../../assets/img/musicNote.png"/>
                    <span class="title">歌单</span>
                </div>
                <div class="songItem">
                    <div v-for="(item,index) in normalizedPlayList" :key="index" class="items" @click="getPlayList(item)">
                        <span  v-html="item.name"></span>
                    </div>
                </div>
            </div>
            <div v-show="!normalizedSongs.length && !normalizedPlayList.length" class="emptyList">暂无相关建议歌曲及歌单</div>
        </div>
    </div>
</template>

<script>
import {heightLight,removeHeightLight} from '../../utils/heightLight' //高亮
import { getSearchHot, getSearchSuggest } from "../../api/search" //搜索接口
import {createSong} from '../../utils/business'
import {isHas} from '../../utils/common'
import {mapState, mapMutations, mapActions} from '../../store/helper/music'
export default {
    name:'searchHistory',
    data(){
        return{
            hotList:[], //热门搜索
            historyList:JSON.parse(sessionStorage.getItem('SEARCH_HISTORY_KEY')) || [], //历史搜索
            isSearching:false,
            songList:[], //搜索的歌曲
            playList:[], //搜索的歌单
            keyword:'',
        }
    },
    async created(){
        const {result} = await getSearchHot()
        this.hotList = result.hots
    },
    methods:{
        //获取搜索结果
        async getSearch(value,key){
            this.keyword = key
            getSearchSuggest(value).then(({result})=>{
                if(result.songs){
                    this.songList = result.songs
                }
                if(result.playList){
                    this.playList = result.playlists
                }
            })
        },
        //整理搜索结果进行显示 歌曲
        nomalizeSong(song) {
            const {id,name,artists,duration,mvid,album: { id: albumId, name: albumName }} = song
            return createSong({id,name,artists,duration,albumId,albumName,mvId: mvid})
        },
        //保存历史记录
        saveHistory(key){
            if(!isHas(JSON.parse(sessionStorage.getItem('SEARCH_HISTORY_KEY')),key) && !isHas(this.historyList,key)){
                this.historyList.push({first:key})
            }
            sessionStorage.setItem('SEARCH_HISTORY_KEY',JSON.stringify(this.historyList))
            // sessionStorage.removeItem('SEARCH_HISTORY_KEY')
        },
        //前往歌单
        getPlayList(item){
            this.$router.push({name:'playlist',query:{id:item.id}})
        },
        //点击歌曲播放
        startPlay(item){
            this.startSong(item)
            this.addToPlaylist(item)
        },
        //点击搜索历史或者热门搜索进行搜索
        toSearch(item){
            this.$router.push({name:'search',query:{keyWords:item.first}})
            this.$emit('closePanel')
        },
        ...mapActions(['startSong',"addToPlaylist"])
    },
    computed:{
        normalizedSongs() {
            let arr =  this.songList.map(song => this.nomalizeSong(song))
            return heightLight(arr,this.keyword)
        },
        normalizedPlayList() {
            return heightLight(this.playList,this.keyword)
            this.$emit('closePanel')
        }
    },
}
</script>

<style scoped lang="scss">
    .historyContainer{
        width:450px;
        height:calc(100vh - 120px);
        background-color: var(--history-bg-color);
        position: fixed;
        right:0px;
        top:60px;
        display: flex;
        flex-direction: column;
        z-index:1000;
        padding:20px 30px;
        box-sizing: border-box;
        overflow: auto;

        .records{
            display: flex;
            flex-direction: column;

            .part{
                display: flex;
                flex-direction: column;

                .title{
                    color:#5c5c5c;
                    font-size: 14px;
                }

                .item{
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    margin-top:10px;

                    span{
                        padding:6px 18px;
                        margin:0 10px 20px 0;
                        color:var(--searchItem-font-color);
                        border:1px solid var(--searchItem-border-color);
                        cursor: pointer;

                        &:hover{
                            background-color: var(--searchItem-hover-bg-color);
                        }
                    }
                }
                
                .empty{
                    color:gray;
                    margin-top:20px;
                }

                &:last-of-type{
                    margin-top:20px;
                }
            }
        }

        .song{
            .part{
                display: flex;
                flex-direction: row;
                align-items: center;

                img{
                    width:15px;
                    height:15px;
                }

                .title{
                    color:#5c5c5c;
                    font-size: 14px;
                    margin-left:5px;
                }
            }

            .songItem{
                display: flex;
                flex-direction: column;
                margin-top:10px;
                margin-bottom: 20px;
                span{
                    color:var(--searchItem-font-color);
                    font-size: 15px;
                }

                .items{
                    padding-top:10px;
                    padding-bottom: 10px;
                    margin-left:-30px;
                    margin-right:-30px;
                    padding-left:30px;
                    padding-right:30px;
                    cursor: pointer;

                    &:hover{
                        background-color:var(--searchItem-hover-bg-color);
                    }
                }
            }

            .emptyList{
                color:var(--searchItem-font-color);
                text-align: center;
                padding-top: 80%;
            }
        }
    }
</style>