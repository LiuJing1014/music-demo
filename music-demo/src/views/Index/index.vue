<template>
    <div class="mainContainer">
        <!-- <el-container style="width:100%;height:100%">
            <el-aside width="220px" v-if="$route.name != 'mvDetail'">
                <div class="logoImg">lz's Song</div>
                <navList />
            </el-aside>
            <el-container>
                <el-header>
                    <el-input :placeholder="placeholder" prefix-icon="el-icon-search" v-model="keyWords" class="input" @keypress.native.enter="getSearchList" @focus="onFocus" @input="getSearch"></el-input>
                    <el-popover placement="top" width="200" trigger="hover" offset="50">
                        <div class="themes">
                            <div v-for="(themeValue, themeKey, index) in themeMap" :key="index" class="theme-item" @click="changeTheme(themeKey)">
                                <div :style="themeValue.style" class="theme-icon"></div>
                                <span>{{themeValue.title}}</span>
                            </div>
                        </div>
                        <div slot="reference" class="picts">
                            <img src='../../assets/img/skin.png' class="skin"/>
                        </div>
                    </el-popover>
                </el-header>
                <el-main id='main'>
                    <router-view />
                </el-main>
            </el-container>
        </el-container> -->

        <div class="header">
            <div class="logoImg">lz's Song</div>
            <div class="searchTool">
                <el-input :placeholder="placeholder" prefix-icon="el-icon-search" v-model="keyWords" class="input" @keypress.native.enter="getSearchList" @focus="onFocus" @input="getSearch"></el-input>
                <el-popover placement="top" width="200" trigger="hover" offset="50">
                    <div class="themes">
                        <div v-for="(themeValue, themeKey, index) in themeMap" :key="index" class="theme-item" @click="changeTheme(themeKey)">
                            <div :style="themeValue.style" class="theme-icon"></div>
                            <span>{{themeValue.title}}</span>
                        </div>
                    </div>
                    <div slot="reference" class="picts">
                        <img src='../../assets/img/skin.png' class="skin"/>
                    </div>
                </el-popover>
            </div>
        </div>
        <div class="container">
            <div class="side">
                <navList />
            </div>
            <div class="main">
                <router-view />
            </div>
        </div>

        <searchHistory v-show="isSearching" @closePanel="closePanel" ref="searchPanel"/>
    </div>
</template>

<script>
import {debounce} from '../../utils/common'
import searchHistory from '../Search/searchHistory' //搜索历史
import navList from '../../components/Index/nav' //左侧导航
import variables from '../../style/themes/variables'
import variablesWhite from '../../style/themes/variables-white'
import variablesRed from '../../style/themes/variables-red'

const themes = {
    white: "white",
    dark: "dark",
    red: "red"
}

export default {
    name:'index',
    components:{
        navList,
        searchHistory
    },
    created(){
        this.themeMap = {
            [themes.dark]:{
                title:'深色',
                file:variables,
                style:{
                    backgroundColor:'#202020'
                }
            },
            [themes.white]:{
                title:'浅色',
                file:variablesWhite,
                style:{
                    backgroundColor:'#f6f6f6',
                    border:'1px solid #EBEAEA'
                }
            },
            [themes.red]:{
                title:'红色',
                file:variablesRed,
                style:{
                    backgroundColor:'#d33a31'
                }
            }
        },
        //默认浅色
        this.changeTheme(sessionStorage.getItem('theme_key') == null?themes.white:sessionStorage.getItem('theme_key'))
    },
    data(){
        return{
            keyWords:'', //搜索关键字
            isSearching:false,
            placeholder:this.$route.query.keyWords?this.$route.query.keyWords:'搜索'
        }
    },
    methods:{
        //回车
        getSearchList(){
            // if(!value.trim()){
            //     return
            // }
            this.$refs.searchPanel.saveHistory(this.keyWords)
            this.$router.push({name:'search',query:{keyWords:this.keyWords}})
            this.isSearching = false
        },
        //输入框聚焦
        onFocus(){
            this.isSearching = true
        },
        //失焦
        onBlur(){
            this.isSearching = false
        },
        //监听实时输入
        getSearch:debounce(function(value){
            if(!value.trim()){
                this.$refs.searchPanel.isSearching = false
                return
            }
            this.$refs.searchPanel.getSearch(value,this.keyWords)
            this.$refs.searchPanel.isSearching = true
        },500),
        //关闭面板
        closePanel(){
            this.isSearching = false
        },
        //换肤
        changeTheme(themeKey){
            sessionStorage.setItem('theme_key',themeKey)
            const theme = this.themeMap[themeKey].file
            Object.keys(theme).forEach(key => {
                const value = theme[key]
                document.documentElement.style.setProperty(key,value)
            })
        }
    },
    watch:{
        $route(){
            this.placeholder = this.$route.query.keyWords?this.$route.query.keyWords:'搜索'
        }
    }
}
</script>

<style lang="scss" scoped>
    .mainContainer{
        height:100%;

        .header{
            height:60px;
            width:100%;
            display: flex;
            justify-content: space-between;
            background-color: var(--header-bg-color);
            padding-right:50px;
            box-sizing: border-box;

            .logoImg{
                width:225px;
                height:60px;
                line-height: 60px;
                background-image: url('../../assets/img/music.png');
                background-repeat: no-repeat;
                background-size: 18%;
                background-position: 15px;
                color:var(--font-color);
                font-size: 22px;
                text-align: center;
                background-color: var(--logo-bg-color);
            }

            .searchTool{
                display: flex;
                align-items: center;
            }
        }

        .container{
            width:100%;
            height:calc(100% - 60px);
            display: flex;

            .side{
                width:225px;
                height:calc(100% - 60px);
                background-color: var(--side-bg-color);
            }

            .main{
                flex:1;
                padding:20px 120px 60px 120px;
                box-sizing: border-box;
                background-color: var(--main-bg-color);
                overflow-y: auto;
            }

        }
    }
    
    .picts{
        display: flex;
        justify-content: center;
        align-items: center;
        width:38px;
        height:38px;
        border-radius: 50%;
        margin-left:10px;
        background-color: var(--skin-bg-color);
        cursor: pointer;

        .skin{
            width:20px;
            height:20px;
            cursor: pointer;
        }

        &:hover{
            background-color: #373737;
        }
    }
    
    .themes{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding:10px 15px;
        box-sizing: border-box;

        .theme-item{
            display: flex;
            flex-direction: column;
            cursor: pointer;

            .theme-icon{
                width:30px;
                height:30px;
                border-radius: 50%;
                margin-bottom: 10px;
            }
        }
    }
    
</style>