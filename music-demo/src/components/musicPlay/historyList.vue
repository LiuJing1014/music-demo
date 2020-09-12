<template>
    <div class="historyContainer">
        <ul class="title">
            <li v-for="(item,index) in list" :key="index" :class="{active:activeIndex == index}" @click="changeTip(index)">{{item}}</li>
        </ul>
        <div class="content">
            <div class="note">
                <span>总共{{total}}首</span>
                <div class="clear" v-show="isEmpty">
                    <img src="../../assets/img/delete.png"/>
                    <span @click="clear">清空</span>
                </div>
            </div>
        </div>
        <div class="songList">
            <table  v-show="isEmpty">
                <tr>
                    <td style="width:240px;color:var(--searchList-title-color);">音乐标题</td>
                    <td style="width:200px">歌手</td>
                    <td>时长</td>
                </tr>
                <tr v-for="(item,index) in dataSource" :key="index" @click="startPlay(item)">
                    <td style="width:240px;color:var(--searchList-title-color);" :class="{playing:currentSong.id == item.id}">
                        <div class="playVideo">
                            <span>{{item.name}}</span>
                            <img src="../../assets/img/video.png" v-show="item.mvId != 0" @click="getDetail(item)"/>
                        </div>
                    </td>
                    <td style="width:200px">{{item.artistsText}}</td>
                    <td >{{item.durationSecond | songTime}}</td>
                </tr>
            </table>
            <div class="noDatas" v-show="!isEmpty">你还没有添加任何歌曲</div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "../../store/helper/music"
export default {
    name:'historyList',
    data(){
        return{
            list:['播放列表','历史记录'],
            activeIndex:0
        }
    },
    methods:{
        //清空
        clear() {
            if (this.isPlaylist) {
                this.clearPlaylist()
            } else {
                this.clearHistory()
            }
        },
        changeTip(index){
            this.activeIndex = index
        },
        startPlay(item){
            this.startSong(item)
            this.setPlaylist(this.dataSource)
            console.log(this.dataSource)
        },
        getDetail(item){
            this.$router.push({name:'mvDetail',query:{id:item.mvId}})
        },
        ...mapMutations(["setPlaylistShow", "setPlaylist",'setPlaylist','setPlayingState']),
        ...mapActions(["clearCurrentSong", "clearPlaylist", "clearHistory",'startSong'])
    },
    computed:{
        isEmpty(){
            if(this.activeIndex == 0 && this.playlist.length == 0){
                return false
            }else if(this.activeIndex == 0 && this.playlist.length != 0){
                return true
            }else if(this.activeIndex == 1 && JSON.parse(this.playHistory).length == 0){
                return false
            }else if(this.activeIndex == 1 && JSON.parse(this.playHistory).length != 0){
                return true
            }
        },
        total(){
            if(this.isPlaylist){
                if(this.playlist.length != 0){
                    return this.playlist.length
                }else{
                    return 0
                }
            }else{
                if(JSON.parse(this.playHistory) != null){
                    return JSON.parse(this.playHistory).length
                }else{
                    return 0
                }
            }
        },
        dataSource() {
            return this.isPlaylist ? this.playlist : JSON.parse(this.playHistory)
        },
        isPlaylist() {
            return this.activeIndex === 0
        },  
        ...mapState(["isPlaylistShow", "playlist", "playHistory",'currentSong'])
    }
}
</script>

<style scoped lang="scss">
    .historyContainer{
        width:515px;
        height:calc(100vh - 60px);
        background-color: var(--history-bg-color);
        position: fixed;
        right:0px;
        top:0px;
        display: flex;
        flex-direction: column;
        z-index:1001;
        

        .title{
            width:100%;
            height:60px;
            line-height:40px;
            padding-top:10px;
            padding-bottom: 10px;
            font-size: 20px;
            text-align: center;
            box-sizing: border-box;
            color:#797979;
            
            li{
                display: inline-block;
                margin-right:20px;
                cursor: pointer;
            }
        }

        .content{
            width:100%;
            padding-left:20px;
            padding-right:20px;
            box-sizing: border-box;
            color:#b1b1b1;
            font-size: 15px;
            
            .note{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                border-bottom: 1px solid #3F3F3F;
                padding-bottom: 10px;

                .clear{
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    img{
                        width:16px;
                        height:16px;
                        margin-right:5px
                    }

                    span{
                        cursor: pointer;
                    }
                }
            }
        }

        .songList{
            width:515px;
            min-height:800px;
            overflow: auto;
            position: relative;
            
            table{
                width:515px;
                border-collapse: collapse;
                font-size: 15px;
                text-align: left;
                table-layout: fixed;

                tr{
                    width:100%;
                    padding:0;
                    margin:0;
                    height:40px;
                    cursor: pointer;
                    
                    td{
                        height:40px;
                        color:#606266;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                        padding-left:10px;
                        box-sizing: border-box;

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
                    
                        &:first-child{
                            padding-left:25px;
                        }
                    }
                    

                    &:hover{
                        background-color: var(--searchList-hover-color);
                    }
                }
            }

            .noDatas{
                position: absolute;
                top:50%;
                left:50%;
                transform: translate(-50%,-50%);
                color:#909399;
                font-size: 16px;
            }
        }
    }
    .active{
        color:#fff
    }
    .playing{
        color:#d33a31 !important
    }
    
</style>