<template>
    <div class="box">
        <div class="loading" element-loading-background="transparent"  element-loading-text="载入中" v-loading="loading" v-show="loading"></div>
    </div>
</template>

<script>
export default {
    name: "Loading",
    props: ["loading"]
}
</script>

<style lang="scss" scoped>
    .box{
        position: fixed;
        left:220px;
        top:60px;
        bottom:60px;
        right:0;
    }
    .loading {
        height: 100%;
    }
</style>
