<template>
    <div class="list">
        <table>
            <thead>
                <tr>
                    <td class="index"></td>
                    <td class="pictsImg"></td>
                    <td class="songName">音乐标题</td>
                    <td class="artistsText">歌手</td>
                    <td class="albumName">专辑</td>
                    <td style="width:30px">时长</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,index) in songs" :key="index" @click="startPlay(item)">
                    <td class="index">
                        <span v-show="currentSong.id != item.id">{{index+1 | addZero}}</span>
                        <img class="openImg" v-show="currentSong.id == item.id" src="../../assets/img/opening.png"/>
                    </td>
                    <td class="pictsImg">
                        <div class="tip">
                            <img :src="item.img" />
                            <div class="circle">
                                <img src="../../assets/img/openSong.png"/>
                            </div>
                        </div>
                    </td>
                    <td class="songName">
                        <div class="playVideo"> 
                            <span :class="{playing:currentSong.id == item.id}" v-html='item.name' style=" height:18px;overflow: hidden;"></span>
                            <img :src="isRed?require('../../assets/img/video-red.png'):require('../../assets/img/video.png')" v-show="item.mvId != 0" @click.stop="getDetail(item)"/>
                        </div>
                    </td>
                    <td class="artistsText" v-html="item.artistsText" style=" height:18px;overflow: hidden;"></td>
                    <td class="albumName" style=" height:18px;overflow: hidden;">{{item.albumName}}</td>
                    <td>{{item.durationSecond | songTime}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import {mapState as mapMusicState, mapMutations as mapMusicMusicState, mapActions as mapMusicActions} from '../../store/helper/music'
export default {
    name:'songTable',
    created(){
        if(sessionStorage.getItem('theme_key') == 'red'){
            this.isRed = true
        }else{
            this.isRed = false
        }
    },
    props:['songs'],
    data(){
        return{
            isRed:false
        }
    },
    methods:{
        startPlay(item){
            this.startSong(item)
            this.setPlaylist(this.songs)
        },
        getDetail(item){
            this.$router.push({name:'mvDetail',query:{id:item.mvId}})
        },
        ...mapMusicActions(['startSong']),
        ...mapMusicMusicState(['setPlaylist', "setPlayingState"])
    },
    computed:{
        ...mapMusicState(['currentSong','playing'])
    }
}
</script>

<style scoped lang="scss">
    .list{
        width:100%;

        table{
            width:100%;
            border-collapse: collapse;

            thead{
                color:var(--playlist-thead-font-color);
                height:40px;
                line-height:40px;
                text-align: left;
            }
            tbody{
                color:var(--playlist-table-font-color);
                

                tr{
                    height:72px;
                    cursor: pointer;
                    td{
                        padding:0;
                        text-align: left;
                        padding-bottom: 5px;

                        .playVideo{
                            display: flex;
                            flex-direction: row;
                            align-items: center;

                            img{
                                width:20px;
                                height:20px;
                                margin-left:10px
                            }
                        }

                        .openImg{
                            width:20px;
                            height:20px
                        }

                        &:first-of-type{
                            padding-left:10px
                        }
                    }

                    .index{
                        width:40px;
                    }
                    .pictsImg{
                        width:75px;
                    }
                    .songName,.artistsText,.albumName{
                        width:220px;
                    }

                    &:hover{
                        background-color: var(--list-hover-color);
                    }
                }
            }
        }
    }
    .playing{
        color:#d33a31 !important
    }
</style>