<template>
    <div class="indexContainer" ref="fatherabaox">
        <user />
        <div>
            <el-menu
                default-active="$route.name"
                class="el-menu-vertical-demo"
               
                text-color="#909399"
                active-text-color="#d33a31"
                :router='true'>
                <el-menu-item index="content">
                    <img v-if="$route.name == 'content' || $route.query.type== 'recommendedMusic'" src="../../assets/img/palette-active.png"/>
                    <img v-else src="../../assets/img/palette.png"/>
                    <span slot="title" :class="{active:$route.name == 'content' || $route.query.type== 'recommendedMusic'}">发现音乐</span>
                </el-menu-item>
                <el-menu-item index="recommendedSong">
                    <img v-if="$route.name == 'recommendedSong' || $route.query.type== 'recommendedSong'" src="../../assets/img/musicNote-active.png"/>
                    <img v-else src="../../assets/img/musicNote.png"/>
                    <span slot="title" :class="{active:$route.name == 'recommendedSong' || $route.query.type== 'recommendedSong'}">推荐歌单</span>
                </el-menu-item>
                <el-menu-item index="latestMusic">
                    <img v-if="$route.name == 'latestMusic'" src="../../assets/img/note-active.png"/>
                    <img v-else src="../../assets/img/note.png"/>
                    <span slot="title" :class="{active:$route.name == 'latestMusic'}">最新音乐</span>
                </el-menu-item>
                <el-menu-item index="latestMV">
                    <img v-if="$route.name == 'latestMV'" src="../../assets/img/MV-active.png"/>
                    <img v-else src="../../assets/img/MV.png"/>
                    <span slot="title" :class="{active:$route.name == 'latestMV'}">最新MV</span>
                </el-menu-item>
                <div class="newMenu" v-show="isLogin">
                    <p>创建的歌单</p>
                    <div v-for="(item,index) in userMenus.userCreateList" :key="index">
                        <el-menu-item :index="item.path" >
                            <img v-if="$route.query.id == item.id" src="../../assets/img/musicNote-active.png"/>
                            <img v-else src="../../assets/img/musicNote.png"/>
                            <span slot="title" :class="{active:$route.query.id == item.id}">{{item.name}}</span>
                        </el-menu-item>
                    </div>  
                </div>
                <div class="newMenu" v-show="isLogin">
                    <p>收藏的歌单</p>
                    <div v-for="(item,index) in userMenus.userCollectList" :key="index">
                        <el-menu-item :index="item.path">
                            <img v-if="$route.query.id == item.id" src="../../assets/img/musicNote-active.png"/>
                            <img v-else src="../../assets/img/musicNote.png"/>
                            <span slot="title" :class="{active:$route.query.id == item.id}">{{item.name}}</span>
                        </el-menu-item>
                    </div>
                </div>
            </el-menu>
        </div>
    </div>
</template>

<script>
import user from '../../components/user/user'
import { mapState as mapUserState, mapGetters as mapUserGetters} from '../../store/helper/user'
export default {
    name:'navList',
    components:{
        user
    },
    data(){
        return{
            isOver:true
        }
    },
    computed:{
        ...mapUserState(['userPlayList']),
        ...mapUserGetters(['isLogin','userMenus'])
    }
}
</script>

<style scoped lang="scss">
    .el-menu{
        padding-bottom:70px;
        .el-menu-item{
            width:220px;
            height:40px;
            line-height: 40px;
            font-size: 16px;
        }
        img{
            width:16px;
            height:16px;
            margin-right:10px
        }
        p{
            color:#808080;
            font-size: 14px;
            margin-top:0px;
            margin-bottom: 0px;
            padding-top:10px;
            padding-bottom: 10px;
            padding-left:20px;
            box-sizing: border-box;
        }
    }
    .newMenu{
        .el-menu-item{
            padding:0 8px;
            @include text-ellipsis
        }
    }
    .active{
        color:#d33a31
    }
    .overArea{
        padding-bottom:70px !important;
    }
</style>