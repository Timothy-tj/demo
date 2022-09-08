// 工具函数  ； 通常我们说的时间戳，就是指格林威治时间（GMT）1970年01月01日00时00分00秒起至现在的总秒数。
function formatToTime(time){
    var date = new Date(time*1000)  //Date()参数只接收毫秒
    const year = date.getFullYear()
    const month = (date.getMonth()+1).toString().padStart(2,'0')    //getMonth()返回0-11,海内外不同 ; padStart()保留两位，不够左补0 
    const day = date.getDate().toString().padStart(2,'0')
    const hour = date.getHours().toString().padStart(2,'0')
    const minute = date.getMinutes().toString().padStart(2,'0')
    const second = date.getSeconds().toString().padStart(2,'0')
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`    //注意有坑：这里不是单引号，是esc下面的点符号
}

function formatToDate(time){
    var date2 = new Date(time*1000)  
    const year = date2.getFullYear()
    const month = (date2.getMonth()+1).toString().padStart(2,'0')   
    const day = date2.getDate().toString().padStart(2,'0')
    return `${year}-${month}-${day}`
}

// 导出
export default{
    formatToTime,
    formatToDate
}