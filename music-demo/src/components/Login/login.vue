<template>
    <div id="login">
        <el-dialog  title="登录" :visible.sync="isShow"  width="450px" top='20vh' :before-close="handleClose" :close-on-click-modal = 'false'>
            <el-form status-icon  ref="modalData" :model="modalData"  :rules="rules" class="demo-ruleForm">
                <el-form-item label="" prop="UID">
                    <el-input v-model="modalData.UID"  autocomplete="off" placeholder="请输入您的网易云uid" style="width:410px"></el-input>
                </el-form-item>
                <el-form-item>
                    <div class="textList">
                        <span>1、请 <a href="http://music.163.com">点我（http://music.163.com）</a> 打开网易云音乐官网</span>
                        <span>2、点击页面右上角的“登录”</span>
                        <span>3、点击您的头像，进入我的主页</span>
                        <span>4、复制浏览器地址栏/user/home?id=后面的数字（网易云UID）</span>
                    </div>
                </el-form-item>
                <div style="margin-top:20px">
                    <el-form-item>
                        <el-button class="loginBtn" @click="submitForm('modalData')">登 录</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:'login',
    data(){
        return{
            isShow:false,
            modalData:{
                UID:'', //网易云UID
            },
            rules: {
                UID: [
                    { required: true, message: '请输入UID', trigger: 'blur' },
                ]
            },
        }
    },
    methods:{
        //关闭弹出框
        handleClose() {
            this.modalData = {}
            this.isShow = false
        },
        //登录
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$emit('login',this.modalData.UID)
                    this.$router.push({name:'Index'})
                } else {
                    return false;
                }
            });
        },
    }
}
</script>

<style scoped lang="scss">
    .textList{
        display: flex;
        flex-direction: column;
        color:#909399
    }
     .el-dialog__title{
        color:#909399
    }
    a{
        color:#d33a31
    }
    .loginBtn{
        background-color: #d33a31;
        border-color:#d33a31;
        color:#fff;
        width:100%;
    }
</style>