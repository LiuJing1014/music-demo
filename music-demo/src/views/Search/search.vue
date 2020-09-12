<template>
    <div class="searchContainer">
        <div class="title">
            <span class="key">{{$route.query.keyWords}}</span>
            <span class="result">找到{{total}}个结果</span>
        </div>
        <div class="content">
            <div class="menu">
                <ul>
                    <li v-for="(item,index) in list" :key="index" :class="{active:activeIndex == index}" @click="changeTab(index)">{{item}}</li>
                </ul>
            </div>
            <div>
                <song v-if="activeIndex == 0" @changeTotal="changeTotal"/>
                <songList v-if="activeIndex == 1" @changeTotal="changeTotal"/>
                <mv v-if="activeIndex == 2" @changeTotal="changeTotal"/>
            </div>
        </div>
    </div>
</template>

<script>
import song from './song' //歌曲
import songList from './songList' //歌单
import mv from './mv' //MV
export default {
    name:'serach',
    components:{
        song,
        songList,
        mv
    },
    data(){
        return{
            total:0, //搜索结果
            list:['歌曲','歌单','MV'],
            activeIndex:0,
        }
    },
    methods:{
        changeTab(index){
            this.activeIndex = index
        },
        //修改总数
        changeTotal(value){
            this.total = value
        }
    },
}
</script>

<style scoped lang="scss">
    .searchContainer{
        width:100%;
        display: flex;
        flex-direction: column;
        text-align: left;

        .title{
            .key{
                color:#b1b1b1;
                font-weight: bold;
                font-size: 22px;
            }
            .result{
                color:#727272;
                font-size: 15px;
                margin-left:8px;
            }
        }

        .content{
            display: flex;
            flex-direction: column;
            margin-top:30px;

            .menu{
                ul{
                    border-bottom:1px solid #666665 ;
                    display: flex;
                    flex-direction: row;
                    padding:0;

                    li{
                        list-style: none;
                        color:#797979;
                        font-size: 16px;
                        padding-right:30px;
                        padding-bottom: 10px;
                        cursor: pointer;

                        &:hover{
                            color:#b4b4b4 !important
                        }
                    }
                }
            }
        }
    }
    .active{
        color:var(--searchList-select-font-color) !important
    }
</style>