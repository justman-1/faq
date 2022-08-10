//open to question
$('.newQ').click(e=>{
    if($(e.target).attr('class') != 'qPlus' && $(e.target).attr('class') != 'newQ') return ''
    if($(e.target).attr('class') == 'qPlus') e.target = e.target.parentNode
    $(e.target).css({ 'height': '470px'})
    $(e.target.children[0]).css({ 'display': 'none'})
    $(e.target.children[1]).css({ 'display': 'block'})
    $(e.target.children[2]).css({ 'display': 'block'})
    $(e.target.children[3].children[0]).css({ 'display': 'inline-block'})
})

//save question
$('.qSend').click(e=>{
    const name = $('.qName').val()
    const text = $('.qText').val()
    $('.qSend').css({ 'display': 'none '})
    $(e.target.parentNode.children[1]).css({ 'display': 'inline-block'})
    if(text.replace(/ /g,'') == '' || name.replace(/ /g,'') == ''){
        alert('Заполните все поля(вопрос, ответ)')
        $('.qSend').css({ 'display': 'block'})
        return $(e.target.parentNode.children[1]).css({ 'display': 'none'})
    }
    $.ajax({
        url: '/saveQuestion',
        method: 'post',
        data: { text: text, name: name },
        success: (res)=>{
            if(res == 'ok'){
                $(e.target).css({ 'display': 'block' })
                $(e.target.parentNode.children[1]).css({ 'display': 'none' })
                window.location = '/'
            }
        },
        error: (res)=>{
            if(res.status == 410){
                $(e.target).css({ 'display': 'block' })
                $(e.target.parentNode.children[1]).css({ 'display': 'none' })
                alert(res.responseText)
            }
            else if(res.status == 411){
                localStorage.removeItem('token')
                document.cookie = "token=none; max-age=0"
            }
        }
    })
})

//get questions
function getQuestions(){
    let request = $('.searchQ').val()
    $('.qLoading').css({ 'display': 'flex'})
    console.log(request)
    $('.question').remove()
    $.ajax({
        url: '/getQuestions',
        method: 'get',
        headers: { request: window.btoa(encodeURIComponent(request)) },
        success: (res)=>{
            $('.contUndefined').css({ 'display': 'none'})
            $('.qLoading').css({ 'display': 'none'})
            console.log((res.questions.length < 3) ? res.questions.length : 3)
            res.questions.forEach((e, i)=>{
                let heights = []
                for(m=0;m<3;m++){
                    let l = $(document.querySelector('.contFaq').children[m]).css('height')
                    let height = 0
                    for(k=0;k<document.querySelector('.contFaq').children[m].children.length;k++){
                        height = height + +$(document.querySelector('.contFaq').children[m].children[k]).css('height').match(/\d+/)[0]
                    }
                    heights.push({px: height, i: m})
                }
                heights = heights.sort((a, b)=> a.px - b.px)
                $(document.querySelector('.contFaq').children[heights[0].i]).append(`
                <div class="question">
                    <div class="questionId">${e._id}</div>
                    <div class="questionName">${e.name}</div>
                    <div class="questionText">${e.text}</div>
                </div>
                `)
            })
            if(res.questions.length == 0){
                $('.contUndefined').css({ 'display': 'block'})
            }
        },
        error: (res)=>{
            $('.qLoading').css({ 'display': 'none'})
        }
    })
}
getQuestions()

$('.searchQ').on('input', e=>{
    $('.qLoading').css({ 'display': 'flex'})
    $('.contFaq').css({ 'opacity': '0.2'})
    let request = $('.searchQ').val()
    setTimeout(()=>{
        if(request == $('.searchQ').val()){
            $('.contFaq').css({ 'opacity': '1'})
            getQuestions()
        }
    }, 700)
})