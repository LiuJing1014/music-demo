<template>
    <div class="mvsContainer">
        <div class="songList">
            <div class="songItem" v-for="(item,index) in result" :key="index" @click="getDetails(item)">
                <div class="pict">
                    <img class="pictUrl" :src="item.cover" />
                    <div class="open">
                        <img src="../../assets/img/stop.png"/>
                        <span>{{item.playCount | playCount}}</span>
                    </div>
                    <div class="players">
                        <img src="../../assets/img/openSong.png" />
                    </div>
                    <span class="time">{{item.duration/1000 | songTime}}</span>
                </div>
                <span class="name">{{item.name}}</span>
                <span class="name">{{item.artistName}}</span>
            </div>
        </div>
        <el-pagination layout="prev, pager, next" :page-size="40" :total="total" @current-change="handleCurrentChange" v-show="total > 0 && !loading"></el-pagination>
    </div>
</template>

<script>
import Loading from '../../components/Index/loading'
import { getSearch } from "../../api/search"
import { getPageOffset } from '../../utils/common'
export default {
    name:'mv',
    components:{
        Loading
    },
    created(){
        this.getSongLists()
    },
    data(){
        return{
            total:0,
            loading:false,
            result:[],
            currentPage:1
        }
    },
    methods:{
        //MV
        async getSongLists() {
            this.loading = true
            const { result } = await getSearch({
                keywords: this.$route.query.keyWords,
                limit: 40,
                offset: getPageOffset(this.currentPage, 40),
                type:1004
            }).finally(() => {
                this.loading = false
            })
            this.result = result.mvs
            this.total = result.mvCount
            this.$emit('changeTotal',result.mvCount)
        },
        getDetails(item){
            this.$router.push({name:'mvDetail',query:{id:item.id,type:'recommended'}})
        },
        //换页
        async handleCurrentChange(val) {
            this.currentPage = val
            await this.getSongs()
        },
    }
}
</script>

<style scoped lang="scss">
    .mvsContainer{
        padding-top:30px;
        padding-bottom: 70px;
        .songList{
            width:100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            flex-wrap: wrap;
        }
        .songItem{
            display: flex;
            flex-direction: column;
            padding:0px 5px 50px 5px;

            .pict{
                width:278px;
                height:156px;
                position: relative;

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

                .time{
                    position: absolute;
                    right:10px;
                    bottom:10px;
                    color:#fff
                }

                &:hover{
                    .players{
                        opacity: 1;
                    }
                }
            }

            .pictUrl{
                width:278px;
                height:156px;
                border-radius: 5px;
                cursor: pointer;
            }

            .name{
                width:278px;
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
</style>