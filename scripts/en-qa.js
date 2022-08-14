//open to question
$('.newQ').click(e=>{
    if($(e.target).attr('class') != 'qPlus' && $(e.target).attr('class') != 'newQ') return ''
    if($(e.target).attr('class') == 'qPlus') e.target = e.target.parentNode
    $(e.target).css({ 'height': '470px'})
    $(e.target.children[0]).css({ 'display': 'none'})
    $(e.target.children[1]).css({ 'display': 'block'})
    $(e.target.children[2]).css({ 'display': 'block'})
    $(e.target.children[3].children[0]).css({ 'display': 'inline-block'})
    $(e.target.children[4]).css({ 'display': 'block'})
    $(e.target.children[5]).css({ 'display': 'block'})
})

//save question
$('.qSend').click(e=>{
    const name = $('.qName').val()
    const text = $('.qText').val()
    $('.qSend').css({ 'display': 'none '})
    $(e.target.parentNode.children[1]).css({ 'display': 'inline-block'})
    if(text.replace(/ /g,'') == '' || name.replace(/ /g,'') == ''){
        alert('Fill in all fields (question, answer)')
        $('.qSend').css({ 'display': 'block'})
        return $(e.target.parentNode.children[1]).css({ 'display': 'none'})
    }
    $.ajax({
        url: '/en/saveQuestion',
        method: 'post',
        data: { text: text, name: name },
        success: (res)=>{
            if(res == 'ok'){
                $(e.target).css({ 'display': 'block' })
                $(e.target.parentNode.children[1]).css({ 'display': 'none' })
                window.location = '/en'
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

//delete question
function addDeleteEvent(){
    $('.qDelete').click(e=>{
        const request = window.confirm('Do you really want to permanently delete this card?')
        if(!request) return false
        $(e.target.parentNode.children).css({ display: 'none' })
        e.target.parentNode.parentNode.children[1].innerHTML = 'Deleting...'
        e.target.parentNode.parentNode.children[2].innerHTML = ''
        const id = e.target.parentNode.parentNode.children[0].innerHTML
        console.log(id)
        $.ajax({
            url: '/en/deleteQuestion',
            method: 'post',
            data: { id: id },
            success: (res)=>{
                if(res == 'ok'){
                    $(e.target.parentNode.parentNode).remove()
                }
            },
            error: (res)=>{
                if(res.status == 410){
                    $(e.target.parentNode.parentNode).remove()
                }
                else if(res.status == 411){
                    localStorage.removeItem('token')
                    document.cookie = "token=none; max-age=0"
                }
            }
        })
    })
}

//change question
function addChangeEvent(){
    $('.qChange').click(e=>{
        let block = e.target.parentNode.parentNode
        block.children[4].children[0].value = block.children[1].innerHTML
        block.children[4].children[1].value = block.children[2].innerHTML.replace(/<br>/g, '').replace(/•/g, '')
        for(i=0;i<4;i++){
            $(block.children[i]).css({ 'display': 'none'})
        }
        $(block.children[4]).css({ 'display': 'block'})
        block.children[4].children[3].children[0].innerHTML = block.children[4].children[1].value.length
        block.children[4].children[4].children[0].innerHTML = block.children[4].children[0].value.length
    })
    $('.questionChangeCross').click(e=>{
        let block = e.target.parentNode.parentNode.parentNode
        for(i=1;i<4;i++){
            $(block.children[i]).css({ 'display': 'block'})
        }
        $(block.children[4]).css({ 'display': 'none'})
    })
    $('.questionChangeSend').click(e=>{
        const block = e.target.parentNode.parentNode.parentNode
        const id = block.children[0].innerHTML
        const name = block.children[4].children[0].value
        const text = block.children[4].children[1].value
        if(text.replace(/ /g,'') == '' || name.replace(/ /g,'') == ''){
            alert('Fill in all fields (question, answer)')
        }
        $(e.target.parentNode.children[0]).css({ 'display': 'none'})
        $(e.target.parentNode.children[1]).css({ 'display': 'none'})
        $(e.target.parentNode.children[2]).css({ 'display': 'inline-block'})
        console.log(text)
        console.log(name)
        $.ajax({
            url: '/en/changeQuestion',
            method: 'post',
            data: { text: text, name: name, id: id },
            success: (res)=>{
                if(res == 'ok'){
                    window.location = '/en'
                }
            },
            error: (res)=>{
                if(res.status == 410){
                    $(e.target.parentNode.children[0]).css({ 'display': 'block'})
                    $(e.target.parentNode.children[1]).css({ 'display': 'block'})
                    $(e.target.parentNode.children[2]).css({ 'display': 'none'})
                    alert(res.responseText)
                }
                else if(res.status == 411){
                    localStorage.removeItem('token')
                    document.cookie = "token=none; max-age=0"
                }
            }
        })
    })
}

//addChangeText event
function addChangeTextEvent(){
    $('.questionTextChange').on('input', e=>{
        e.target.parentNode.children[3].children[0].innerHTML = e.target.value.length
    })
    $('.questionNameChange').on('input', e=>{
        e.target.parentNode.children[4].children[0].innerHTML = e.target.value.length
    })
}
addChangeTextEvent()

//get questions
function getQuestions(){
    let request = $('.searchQ').val()
    $('.qLoading').css({ 'display': 'flex'})
    console.log(request)
    $('.question').remove()
    $.ajax({
        url: '/en/getQuestions',
        method: 'get',
        headers: { request: window.btoa(encodeURIComponent(request)) },
        success: (res)=>{
            $('.contUndefined').css({ 'display': 'none'})
            $('.qLoading').css({ 'display': 'none'})
            const actions = `<div style='height: 0px'>
            <img class="qDelete" src="/imgs/delete.png">
            <img class="qChange" src="/imgs/pencil.png">
            </div>`
            const changeBl = `
            <div style='display: none'>
                <textarea class="questionNameChange" placeholder="Question (up to 100 characters)" maxlength="100"></textarea>
                <textarea class="questionTextChange" maxlength="2000" style='border: 1px solid black'></textarea>
                <div class="justify-content-center d-flex">
                    <img class='questionChangeCross' src='/imgs/cross.png'>
                    <input type="button" value='Save' class='questionChangeSend'>
                    <div class="spinner-border" role="status" style="display: none; margin-top: 10px;"></div>
                </div>
                <div class='qSymbols'>Printed characters: <span class='qSymbolsSp'>0</span>/2000</div>
                <div class='qSymbols2'>Printed characters: <span class='qSymbolsSp'>0</span>/100</div>
            </div>
            `
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
                    ${(res.admin) ? actions + changeBl : ''}
                </div>
                `)
            })
            addDeleteEvent()
            addChangeEvent()
            addChangeTextEvent()
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

//search questions
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

function changeTextSymbols(){
    $('.qText').on('input', e=>{
        e.target.parentNode.children[4].children[0].innerHTML = e.target.value.length
    })
    $('.qName').on('input', e=>{
        e.target.parentNode.children[5].children[0].innerHTML = e.target.value.length
    })
}
changeTextSymbols()