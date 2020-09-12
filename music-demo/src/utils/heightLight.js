function heightLight (array,keyword) {
    var reg = new RegExp("(" + keyword + ")", "g");
    array.forEach(element => {
        if(element.name && element.albumName){
            element.name = element.name.replace(reg,"<span style='color:#517eaf'>"+ keyword +"</span>")
            element.albumName = element.albumName.replace(reg,"<span style='color:#517eaf'>"+ keyword +"</span>")
        }else if(element.name && element.artistsText){
            element.name = element.name.replace(reg,"<span style='color:#517eaf'>"+ keyword +"</span>")
            element.artistsText = element.artistsText.replace(reg,"<span style='color:#517eaf'>"+ keyword +"</span>")
        }else{
            element.name = element.name.replace(reg,"<span style='color:#517eaf'>"+ keyword +"</span>")
        }
        
    });
    return array
}

function removeHeightLight (item) {
    if(item.name && item.albumName){
        let name = item.name.replace("<span style='color:#517eaf'>","")
        item.name = name.replace("</span>","")
        let albumName = item.albumName.replace("<span style='color:#517eaf'>","")
        item.albumName = albumName.replace("</span>","")
    }else if(item.name && item.artistsText){
        let name = item.name.replace("<span style='color:#517eaf'>","")
        item.name = name.replace("</span>","")
        let artistsText = item.artistsText.replace("<span style='color:#517eaf'>","")
        item.artistsText = artistsText.replace("</span>","")
    }else{
        let name = item.name.replace("<span style='color:#517eaf'>","")
        item.name = name.replace("</span>","")
    }
    return item
}

function removeAllHeightLight (array) {
    array.forEach(item => {
        if(item.name && item.albumName){
            let name = item.name.replace("<span style='color:#517eaf'>","")
            item.name = name.replace("</span>","")
            let albumName = item.albumName.replace("<span style='color:#517eaf'>","")
            item.albumName = albumName.replace("</span>","")
        }else if(item.name && item.artistsText){
            let name = item.name.replace("<span style='color:#517eaf'>","")
            item.name = name.replace("</span>","")
            let artistsText = item.artistsText.replace("<span style='color:#517eaf'>","")
            item.artistsText = artistsText.replace("</span>","")
        }else{
            let name = item.name.replace("<span style='color:#517eaf'>","")
            item.name = name.replace("</span>","")
        }
        
    });
    return array
}

export { heightLight, removeHeightLight, removeAllHeightLight };