<template>
    <el-carousel :interval="4000" type="card" class="banner-carousel">
        <el-carousel-item v-for="(item,index) in banners" :key="index">
            <img class="banner-img" :src="item.imageUrl"/>
        </el-carousel-item>
    </el-carousel>
</template>

<script>
import {getBanner} from '../../api/discovery' //轮播图
export default {
    name:'banner',
    async created(){
        const { banners } = await  getBanner()
        this.banners = banners
    },
    data(){
        return{
            banners:[]
        }
    }
}
</script>

<style lang="scss" scoped>
    .banner-carousel {
        .el-carousel__container {
            height: 260px;
        }

        .banner-img {
            width: 100%;
            height: 100%;
            border-radius: 4px;
        }
    }
</style>