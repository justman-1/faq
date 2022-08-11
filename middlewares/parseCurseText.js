

function parseCusrseText(text){
    const httpReg = /(http:\/\/[^\s<>]+)/gm
    const httpsReg = /(https:\/\/[^\s<>]+)/gm
    const replaceStr = ` <a href="$1" target='_blank' contenteditable='false'>$1</a> `
    if(text[0] != ' ') text = ' ' + text
    console.log(text)
    text = text.replace(/<a [^>]+>/, '').replace(/<\/a>/, ' ')
    console.log(11111)
    console.log(text)
    console.log(22222)
    text = text.replace(httpReg, replaceStr).replace(httpsReg, replaceStr)
    //text = text.replace(/(http:\/\/[^\s]+)/g, "<a href='$1'>$1</a> ").replace(/(https:\/\/[^\s]+)/g, `<a href='$1' target='_blank'>$1</a>`)
    console.log(text)
    return text
}

module.exports = parseCusrseText