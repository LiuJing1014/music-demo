<template>
    <div id="app">
        <router-view/>
        <play />
        <songWords />
    </div>
</template>

<script>
import songWords from './components/Song/songWords' //歌词
import play from './components/musicPlay/play' //播放器组件
export default {
    name:'app',
    components:{
        play,
        songWords
    },
}
</script>
<style lang="scss">
    #app {
        height: 100%;
        font-size: $font-size;
        min-width:1300px;
        // background-color: var(--side-bg-color);
    }
    html,body{
        margin:0;
        padding:0;
        width:100%;
        height:100%;
        overflow: hidden;
    }
</style>
