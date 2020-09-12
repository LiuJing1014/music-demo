<template>
    <div class="latestMVContainer">
        <div class="topArea">
            <div class="item">
                <span>地区：</span>
                <ul>
                    <li v-for="(item,index) in area" :key="index" :class="{active:areaIndex == index}" @click="getArea(index)">{{item}}</li>
                </ul>
            </div>
            <div class="item">
                <span>类型：</span>
                <ul>
                    <li v-for="(item,index) in kind" :key="index" :class="{active:kindIndex == index}" @click="getKind(index)">{{item}}</li>
                </ul>
            </div>
            <div class="item">
                <span>排序：</span>
                <ul>
                    <li v-for="(item,index) in sort" :key="index" :class="{active:sortIndex == index}" @click="getSort(index)">{{item}}</li>
                </ul>
            </div>
        </div>
        <Loading :loading="loading" v-if="loading"/>
        <div class="mvList" v-else>
            <div v-for="(item,index) in data" :key="index" class="item">
                <div class="pict">
                    <img class="cover" :src="item.cover"/>
                     <div class="players" @click="goOpen(item)">
                        <img src="../../assets/img/openSong.png" />
                    </div>
                </div>
                <span class="name">{{item.name}}</span>
                <span class="artistName">{{item.artistName}}</span>
            </div>
        </div>
        <el-pagination layout="prev, pager, next" :page-size="40" :total="total" @current-change="handleCurrentChange" v-show="total > 0"></el-pagination>
    </div>
</template>

<script>
import {getAllMvs} from '../../api/mv'
import {getPageOffset} from '../../utils/common'
import Loading from '../../components/Index/loading' //加载中
export default {
    name:'LatestMV',
    components:{
        Loading
    },
    created(){
        this.getMVList()
    },
    data(){
        return{
            loading:false,
            data:[], //列表
            currentPage:1,
            total:0,
            area:['全部','内地','港台','欧美','日本','韩国'], //地区
            kind:['全部','官方版','原声','现场版','网易出品'], //类型
            sort:['上升最快','最热','最新'], //排序
            areaIndex:0,
            kindIndex:0,
            sortIndex:0
        }
    },
    methods:{
        //获取MV列表
        async getMVList(){
            this.loading = true
            const {data,count} = await getAllMvs({limit:40,offset:getPageOffset(this.currentPage,40),area:this.area[this.areaIndex],order:this.sort[this.sortIndex],type:this.kind[this.kindIndex]}).finally(() => {
                this.loading = false
            })
            this.data = data
            if(count){
                this.total = count
            }
        },
        getArea(index){
            this.areaIndex = index
            this.getMVList()
        },
        getKind(index){
            this.kindIndex = index
            this.getMVList()
        },
        getSort(index){
            this.sortIndex = index
            this.getMVList()
        },
        //换页
        handleCurrentChange(val){
            this.currentPage = val
            this.getMVList()
        },
        //mv详情
        goOpen(item){
            this.$router.push({name:'mvDetail',query:{id:item.id}})
        }
    }
}
</script>

<style scoped lang="scss">
    .latestMVContainer{
        width:100%;
        display: flex;
        flex-direction: column;
        padding-bottom: 70px;

        .topArea{
            display: flex;
            flex-direction: column;
            font-size: 14px;
            .item{
                display: flex;
                flex-direction: row;
                &:nth-of-type(n+1){
                    margin-top:20px
                }

                span{
                    color:var(--playlist-font-color)
                }

                ul{
                    padding:0;
                    display: flex;
                    flex-direction: row;
                    &:last-child{
                        border-right:none;
                    }

                    li{
                        padding-right:30px;
                        padding-left:30px;
                        color:var(--comment-time-font-color);
                        border-right:1px solid #3F3F3F;
                        cursor: pointer;
                        &:last-of-type{
                            border-right:none
                        }
                       
                    }
                }
            }
        }

        .mvList{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-top:20px;

            .item{
                width:calc(25% - 10px);
                padding:0px 5px 50px 5px;
                display: flex;
                flex-direction: column;
                text-align: left;

                .name{
                    color:var(--playlist-font-color);
                    margin-top:10px;
                    height: 20px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow:ellipsis ;
                }

                .artistName{
                    color:var(--comment-time-font-color);
                    margin-top:10px
                }
            }
            
        }
    }
    .active{
        color:var(--comment-active-font-color) !important;

    }

    .pict{
        position: relative;

        .cover{
            width:100%;
            border-radius: 5px;
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
</style>