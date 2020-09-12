<template>
    <div>
        <banner />
        <recommendedSong />
        <latestMusic />
        <recommendedMV />
    </div>
</template>

<script>
import banner from '../../components/Content/banner' //轮播图
import recommendedSong from '../../components/Content/recommendedSong' //推荐歌单
import latestMusic from '../../components/Content/latestMusic' //最新音乐
import recommendedMV from '../../components/Content/recommendedMV' //推荐MV
export default {
    name:'rightContent',
    components:{
        banner,
        recommendedSong,
        latestMusic,
        recommendedMV,
    }
}
</script>

<style scoped lang="scss">

</style>