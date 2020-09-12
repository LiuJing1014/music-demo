<template>
    <div class="mvContainer">
        <h1>推荐MV</h1>
        <div class="songList">
            <div class="songItem" v-for="(item,index) in result" :key="index" @click="getDetails(item)">
                <div class="items">
                    <div class="pict">
                        <img class="pictUrl" :src="item.picUrl" />
                        <div class="open">
                            <img src="../../assets/img/stop.png"/>
                            <span>{{item.playCount | playCount}}</span>
                        </div>
                        <div class="players">
                            <img src="../../assets/img/openSong.png" />
                        </div>
                    </div>
                    
                    <span class="name">{{item.name}}</span>
                    <span class="name">{{item.artistName}}</span>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
import {getPersonalizedMv} from '../../api/discovery' //推荐MV
export default {
    name:'recommendedMV',
    async created(){
        const {result} = await getPersonalizedMv()
        this.result = result
    },
    data(){
        return{
            result:[]
        }
    },
    methods:{
        getDetails(item){
            this.$router.push({name:'mvDetail',query:{id:item.id,type:'recommended'}})
        }
    }
}
</script>

<style scoped lang="scss">
    .mvContainer{
        width:100%;
        
        h1{
            font-size: 24px;
            font-weight: normal;
            color:var(--h1-font-color);
            text-align: left;
        }

        .songList{
            width:100%;
            display: flex;

            .songItem{
                width:25%;
                padding:0 12px;
                margin-bottom: 70px;
                box-sizing: border-box;

                .items{
                    min-width:140px;
                    display: flex;
                    flex-direction: column;

                    .pict{
                        position: relative;
                        padding-top:56%;

                        .pictUrl{
                            position: absolute;
                            top:0;
                            left:0;
                            right:0;
                            bottom:0;
                            width:100%;
                            height:100%;
                            border-radius: 5px;
                            cursor: pointer;
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
                }

                .name{
                    font-size: $font-size-medium;
                    color: var(--playlist-font-color);
                    margin-top:10px;
                    text-align: left;
                    @include text-ellipsis
                }
            }
            
        }
    }

</style>