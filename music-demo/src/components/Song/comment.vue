<template>
    <div class="commentContainer">
        <Loading :loading="loading" v-if="loading"/>
        <div v-if="this.hotComments.length > 0 && this.currentPage === 1 && !loading">
            <p v-show="total > 0">精彩评论</p>
            <div class="list">
                <div class="item" v-for="(item,index) in hotComments" :key="index">
                    <div>
                        <img :src="item.user.avatarUrl?item.user.avatarUrl:'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"/>
                    </div>
                    <div class="detail">
                        <div class="title">
                            <span style="color:var(--nickname-font-color);font-size:12px;white-space:nowrap">{{item.user.nickname}}:</span>
                            <span style="color:var(--playlist-font-color);font-size:10px;margin-left:6px;word-break:break-all">{{item.content}}</span>
                        </div>
                        <div class="reply" v-for="(content,index) in item.beReplied" :key="index"> 
                            <span style="color:var(--nickname-font-color);font-size:12px;white-space:nowrap">{{content.user.nickname}}:</span>
                            <span style="color:var(--playlist-font-color);font-size:10px;margin-left:6px;word-break:break-all">{{content.content}}</span>
                        </div>
                        <div class="time">
                            <span style="font-size:6px;color:var(--comment-time-font-color)">{{item.time | dateFilter}}</span>
                            <div class="good">
                                <img src="../../assets/img/good.png"/>
                                <span style="margin-left:5px;color:var(--comment-time-font-color)">{{item.likedCount}}</span>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        <div>
            <p v-show="total > 0">最新评论<span style="font-size: 12px;" v-show="total >= 0 && !loading">（{{total}}）</span></p>
            <div class="list">
                <div class="item" v-for="(item,index) in comments" :key="index">
                    <div>
                        <img :src="item.user.avatarUrl?item.user.avatarUrl:'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"/>
                    </div>
                    <div class="detail">
                        <div class="title">
                            <span style="color:var(--nickname-font-color);font-size:12px;white-space:nowrap">{{item.user.nickname}}:</span>
                            <span style="color:var(--playlist-font-color);font-size:10px;margin-left:6px;word-break:break-all">{{item.content}}</span>
                        </div>
                        <div class="reply" v-for="(content,index) in item.beReplied" :key="index"> 
                            <span style="color:var(--nickname-font-color);font-size:12px;white-space:nowrap">{{content.user.nickname}}:</span>
                            <span style="color:var(--playlist-font-color);font-size:10px;margin-left:6px;word-break:break-all">{{content.content}}</span>
                        </div>
                        <div class="time">
                            <span style="font-size:6px;color:var(--comment-time-font-color)">{{item.time | dateFilter}}</span>
                            <div class="good">
                                <img src="../../assets/img/good.png"/>
                                <span style="margin-left:5px;color:var(--comment-time-font-color)">{{item.likedCount}}</span>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        <el-pagination layout="prev, pager, next" :page-size="20" :total="total" @current-change="handleCurrentChange" v-show="total > 0"></el-pagination>
        <div class="noData" v-show="total == 0 && !loading">还没有评论哦~</div>
    </div>
</template>

<script>
import Loading from '../Index/loading'
import {getPlaylistComment,getSongComment,getHotComment,getMvComment} from '../../api/comment' //评论详情
import {getPageOffset} from '../../utils/common'
const SONG_TYPE = "song"
const PLAYLIST_TYPE = "playlist"
const MV_TYPE = "mv"
const PAGE_SIZE = 20
export default {
    name:'songComment',
    components:{
        Loading
    },
    props: {
        id: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            default: SONG_TYPE
        },
    },
    created(){
        this.getComment()
    },
    data(){
        return{
            loading:false,
            hotComments: [],
            comments: [],
            total: 0,
            currentPage: 1
        }
    },
    watch: {
        id: {
            handler(newId) {
                if (newId) {
                    this.currentPage = 1
                    this.getComment()
                }
            }
        }
    },
    methods:{
        //评论
        async getComment() {
            this.loading = true
            const commentRequestMap = {
                [PLAYLIST_TYPE]: getPlaylistComment,
                [SONG_TYPE]: getSongComment,
                [MV_TYPE]: getMvComment
            }
            const commentRequest = commentRequestMap[this.type]
            const { hotComments = [], comments = [], total } = await commentRequest({
                id: this.id,
                pageSize: PAGE_SIZE,
                offset: getPageOffset(this.currentPage, PAGE_SIZE)
            }).finally(() => {
                this.loading = false
            })

            // 歌单的热评需要单独请求接口获取
            if (this.type === PLAYLIST_TYPE && this.currentPage === 1) {
                const { hotComments: exactHotComments = [] } = await getHotComment({
                    id: this.id,
                    type: 2 // 歌单type
                })
                this.hotComments = exactHotComments
            } else {
                this.hotComments = hotComments
            }

            this.comments = comments
            this.total = total
        },
        //换页
        async handleCurrentChange(val) {
            this.currentPage = val
            await this.getComment()
        }
    }
}
</script>

<style scoped lang="scss">
    .commentContainer{
        width: 100%;
        display: flex;
        flex-direction: column;
        padding-bottom: 60px;

        p{
            color:var(--playlist-font-color);
            text-align: left;
            font-size: 16px;
            font-weight: bold;
        }

        .list{
            width:100%;
            display:flex;
            flex-direction: column;
            text-align: left;

            .item{
                display: flex;
                flex-direction: row;
                padding-bottom: 20px;

                img{
                    width:43px;
                    height:43px;
                    border-radius: 50%;
                }

                .detail{
                    flex-grow: 1;
                    margin-left:12px;
                    padding-right:20px;
                    padding-bottom:15px;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    border-bottom: 1px solid var(--comment-border-color);

                    .title{
                        margin-bottom: 10px;
                    }

                    .time{
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;

                        .good{
                            font-size: 6px;
                            display: flex;
                            flex-direction: row;
                            align-items: center;

                            img{
                                width:15px;
                                height:15px;
                                cursor: pointer;
                            }
                        }
                    }

                    .reply{
                        width:100%;
                        background-color: var(--comment-bg-color);
                        padding:8px;
                        margin-bottom: 10px;
                    }
                }

            }
        }
    }
</style>