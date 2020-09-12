import Vue from 'vue'
import moment from "moment";


//时间格式 无时分秒
Vue.filter("dateFilter", function(value, formatString) {
    if(value){
        formatString = formatString || "YYYY-MM-DD HH:mm:ss";
        return moment(value).format(formatString);
    }else{
        return "";
    }
});
Vue.filter("timeFilter", function(value, formatString) {
    if(value){
        formatString = formatString || "YYYY-MM-DD";
        return moment(value).format(formatString);
    }else{
        return "";
    }
});

//加0
Vue.filter('addZero', (value) => {
    if(value < 10){
        return '0'+value
    }else{
        return value
    }
	
})

//标签
Vue.filter('tag', (array) => {
    return array.toString().replace(/,/g,'/')
})

//合并多作者名称
Vue.filter('mergerName', (array) => {
    let arr = []
    array.forEach((current) => {
        arr.push(current.name)
    })
    let result = arr.toString().replace(/,/g,'/')
    return result
})

//音乐时长
function pad(num, n = 2) {
    let len = num.toString().length
    while (len < n) {
        num = '0' + num
        len++
    }
    return num
}

//歌曲时间
Vue.filter('songTime', (interval) => {
    interval = interval | 0
    const minute = pad((interval / 60) | 0)
    const second = pad(interval % 60)
    return `${minute}:${second}`
})

//mv播放量
Vue.filter('playCount', (value) => {
    if(parseInt(value) > 100000){
        return Math.floor(value/10000)+''+'万'
    }else{
        return value
    }
})