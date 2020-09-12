<template>
    <div class="video-player" ref="player"></div>
</template>

<script>
import Player from 'xgplayer'
export default {
    name:'VideoPlayer',
    props:['url'],
    methods:{
        initPlayer(){
            if(!this.url) return
            this.player = new Player({
                el:this.$refs.player,
                url:this.url,
                videoInit:true,
                lang:'zh-cn',
                width:"100%",
                playbackRate:[0.5, 1, 1.5, 2]
            })
        }
    },
    watch:{
        url(url, oldUrl){
            if(url && url !== oldUrl){
                if(!this.player){
                    this.initPlayer()
                }else{
                    this.player.src=  url
                    this.player.reload()
                }
            }
        }
    }

}
</script>

<style scoped>
    .xgplayer-error {
        display: none;
    }
    .xgplayer-skin-default{
        height:435px !important;
    }
</style>