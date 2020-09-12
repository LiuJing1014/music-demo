<template>
    <div class="latestContainer">
        <h1>最新音乐</h1>
        <div class="songList">
            <div class="list">
                <div class="songItem" v-for="(item,index) in result.slice(0,result.length / 2)" :key="index"  @click="startPlay(index)">
                    <span class="textColor">{{index+1 | addZero}}</span>
                    <div class="imgInfo">
                        <div class="imgs">
                            <img :src="item.picUrl"/>
                        </div>
                        <div class="tips">
                            <img src="../../assets/img/openSong.png"/>
                        </div>
                    </div>
                    <div class="nameInfo">
                        <span class="whiteColor">{{item.name}}</span>
                        <span class="textColors">{{item.song.artists | mergerName}}</span>
                    </div>
                </div>
            </div>
            <div class="list">
                <div class="songItem" v-for="(item,index) in result.slice(result.length / 2,result.length)" :key="index" @click="startPlay(index)">
                    <span class="textColor">{{index+6 | addZero}}</span>
                    <div class="imgInfo">
                        <div class="imgs">
                            <img :src="item.picUrl"/>
                        </div>
                        <div class="tips">
                            <img src="../../assets/img/openSong.png"/>
                        </div>
                    </div>
                    <div class="nameInfo">
                        <span class="whiteColor">{{item.name}}</span>
                        <span class="textColors">{{item.song.artists | mergerName}}</span>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
import {mapState as mapMusicState, mapMutations as mapMusicMusicState, mapActions as mapMusicActions} from '../../store/helper/music'
import {getNewSongs} from '../../api/discovery' //最新音乐
import {createSong} from '../../utils/business'
export default {
    name:'latestMusic',
    async created(){
        const {result} = await getNewSongs()
        // this.cutList(result)
        this.result = result
    },
    data(){
        return{
            result:[],
            resultCopy:[]
        }
    },
    methods:{
        startPlay(index){
            this.startSong(this.normalizedSongs[index])
            this.setPlaylist(this.normalizedSongs)
        },
        nomalizeSong(song) {
            const {id, name, song: { mvid, artists, album: { blurPicUrl }, duration} } = song
            return createSong({ id, name, img: blurPicUrl, artists, duration, mvId: mvid})
        },
        cutList(arr){
            arr.forEach((element,index) => {
                if(index < 5){
                    this.result.push(element)
                }else{
                    this.resultCopy.push(element)
                }
            });
        },
        ...mapMusicActions(['startSong']),
        ...mapMusicMusicState(['setPlaylist'])
    },
    computed:{
        normalizedSongs() {
            return this.result.map(song => this.nomalizeSong(song))
        }
    },
}
</script>

<style scoped lang="scss">
    .latestContainer{
        width:100%;

        h1{
            font-size: 24px;
            font-weight: normal;
            color:var(--h1-font-color);
            text-align: left;
        }

        .songList{
            display: flex;

            .list{
                width:50%;
                overflow: hidden;
                
                .songItem{
                    padding:10px;
                    display: flex;
                    cursor: pointer;

                    .imgInfo{
                        width:78px;
                        height:78px;
                        margin-left:20px;
                        position: relative;
                        cursor: pointer;

                        .imgs{
                            width:78px;

                            img{
                                width:78px
                            }
                        }

                        .tips{
                            width:24px;
                            height:24px;
                            border-radius: 50%;
                            background: rgba(255, 255, 255, 0.5);
                            position: absolute;
                            top:50%;
                            left:50%;
                            transform: translate(-50%,-50%);
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            justify-content: center;

                            img{
                                width:10px;
                                height:10px
                            }
                        }
                    }

                    .nameInfo{
                        flex-grow: 1;
                        display: flex;
                        flex-direction: column;
                        justify-content:space-around;
                        margin-left:20px;
                        overflow: hidden;

                        .whiteColor{
                            text-align: left;
                            color:var(--music-font-color);
                            @include text-ellipsis
                        }

                        .textColors{
                            text-align: left;
                            font-size: $font-size-medium;
                            color: var(--playlist-font-color);
                            @include text-ellipsis
                        }
                    }

                    &:hover{
                        background-color:var(--list-hover-color);
                    }
                }
            } 
        }
    }
    .textColor{
        width:20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        text-align: left;
        font-size: $font-size-medium;
        color: var(--playlist-font-color);
    }
</style>