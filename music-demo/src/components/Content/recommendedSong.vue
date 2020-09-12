<template>
    <div class="recommendedContainer">
        <h1>推荐歌单</h1>
        <div class="songList">
            <div class="songItem" v-for="(item,index) in result" :key="index" @click="getDetails(item)">
                <img :src="item.picUrl"/>
                <span class="name">{{item.name}}</span>
                <div class="text">
                    <span>{{item.copywriter}}</span>
                </div>
                <div class="icon">
                    <div class="circle">
                        <img src="../../assets/img/openSong.png"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getPersonalized} from '../../api/discovery' //推荐歌单
export default {
    name:'recommendedSong',
    async created(){
        const {result} = await getPersonalized({limit:10})
        this.result = result
    },
    data(){
        return{
            result:[]
        }
    },
    methods:{
        getDetails(item){
            this.$router.push({name:'playlist',query:{id:item.id,type:'recommendedMusic'}})
        }
    }
}
</script>

<style scoped lang="scss">
    .recommendedContainer{
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
            flex-wrap: wrap;

            //滑动的动画
            .songItem{
                width:calc(20% - 10px);
                display: flex;
                flex-direction: column;
                padding:5px 5px 20px 5px;
                position: relative;
                overflow: hidden;
                cursor: pointer;

                img{
                    width:100%;
                    border-radius: 5px;
                }

                .name{
                    width:240px;
                    font-size: $font-size-medium;
                    color: var(--playlist-font-color);
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
                    margin-left:5px;
                    margin-right:5px;

                    span{
                        color:#fff
                    }
                }

                .icon{
                    width:40px;
                    height:40px;
                    position: absolute;
                    bottom:60px;
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
                        margin-top:5px;
                    }
                    .icon{
                        opacity: 1;
                    }
                }
            }
        }
    }
</style>