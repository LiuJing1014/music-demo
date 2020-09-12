<template>
    <div class="userContainer">
        <div class="info">
            <el-avatar size="medium" :src="user.avatarUrl?user.avatarUrl:'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"></el-avatar>
            <span @click="toLogin">{{user.nickname?user.nickname:title}}</span>
        </div>
        <login @login = "loginInfo" ref="login"/>
    </div>
</template>

<script>
import { mapState as mapUserState,  mapGetters as mapUserGetters, mapActions as mapUserActions} from '../../store/helper/user' //引入vuex
import {UID_KEY,isDef} from '../../utils' //判断是否登陆
import login from '../../components/Login/login' //登录弹框

export default {
    name:'user',
    components:{
        login
    },
    //自动登录
    created(){
        let uid = sessionStorage.getItem('UID_KEY')
        if (isDef(uid)) {
            this.loginInfo(uid)
        }
    },
    data(){
        return{
            title:'未登录',
        }
    },
    computed:{
        ...mapUserState(['user']), //等价于 this.user = store.state.user
        ...mapUserGetters(['isLogin'])
    },
    methods:{
        //点击登录
        toLogin(){
            if(!this.isLogin){
                this.$refs.login.isShow = true
            }else{
                this.$confirm('确定退出登录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loginOut()
                    this.$router.push({name:'Index'})
                }).catch(() => {         
                });
            }
            
        },
        //登录
        async loginInfo(UID){
            const success = await this.login(UID).then(res=>{
                this.$refs.login.isShow = false
            })
        },
        ...mapUserActions(['login','loginOut'])
    }
}
</script>

<style scoped lang="scss">
    .userContainer{
        background-color: var(--name-bg-color);
    }
    .info{
        width:200px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        color:#909399;
        box-sizing: border-box;
        padding-top:10px;
        padding-bottom: 10px;
        padding-left:5px;
        font-size: 16px;

        .el-avatar{
            cursor: pointer;
        }

        span{
            margin-left:10px;
            cursor: pointer;
        }
    }
</style>