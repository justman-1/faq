

function parseCusrseText(text){
    const httpReg = /([\s]http:\/\/[^\s]+)/g
    const httpsReg = /([^"'\w\d]https:\/\/[^\s]+)/g
    const replaceStr = ' <a href="$1" target="_blank">$1</a> '
    if(text[0] != ' ') text = ' ' + text
    //text.replace(/<a \w+\s>/, ' <a>')
    text = text.replace(httpReg, replaceStr).replace(httpsReg, replaceStr)
    text = text.replace(/(http:\/\/[^\s]+)/g, "<a href='$1'>$1</a> ").replace(/(https:\/\/[^\s]+)/g, "<a href='$1' target='_blank'>$1</a>")
    console.log(text)
    return text
}

module.exports = parseCusrseText