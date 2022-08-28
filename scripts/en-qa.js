//open to question
$('.newQ').click(e=>{
    if($(e.target).attr('class') != 'qPlus' && $(e.target).attr('class') != 'newQ') return ''
    if($(e.target).attr('class') == 'qPlus') e.target = e.target.parentNode
    $(e.target).css({ 'height': 'auto'})
    $(e.target.children[0]).css({ 'display': 'none'})
    $(e.target.children[1]).css({ 'display': 'block'})
    $(e.target.children[2]).css({ 'display': 'block'})
    $(e.target.children[3].children[0]).css({ 'display': 'inline-block'})
    $(e.target.children[4]).css({ 'display': 'block'})
    $(e.target.children[5]).css({ 'display': 'block'})
    $(e.target.children[6]).css({ 'display': 'block'})
})

//save question
$('.qSend').click(e=>{
    const name = $('.qName').val()
    const text = $('.qText').val()
    $('.qSend').css({ 'display': 'none '})
    $(e.target.parentNode.children[1]).css({ 'display': 'inline-block'})
    if(text.replace(/ /g,'') == '' || name.replace(/ /g,'') == ''){
        alert('Fill in all the necessary fields (question, answer)')
        $('.qSend').css({ 'display': 'block'})
        return $(e.target.parentNode.children[1]).css({ 'display': 'none'})
    }
    let formData = new FormData()
    formData.append('text', text)
    formData.append('name', name)
    if($(e.target.parentNode.parentNode.children[6].children[1]).css('margin-left') == '0px') formData.append('image', e.target.parentNode.parentNode.children[6].children[0].files[0])
    $.ajax({
        url: '/en/saveQuestion',
        method: 'post',
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            text: encodeURIComponent(text),
            name: encodeURIComponent(name),
            height: (e.target.parentNode.parentNode.children[6].children[0].files[0] && $(e.target.parentNode.parentNode.children[6].children[1]).css('margin-left') == '0px') ? encodeURIComponent($(e.target.parentNode.parentNode.children[6].children[1]).css('height')) : null
        },
        success: (res)=>{
            if(res == 'ok'){
                $(e.target).css({ 'display': 'block' })
                $(e.target.parentNode.children[1]).css({ 'display': 'none' })
                window.location.href = window.location.href
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
        e.target.parentNode.parentNode.children[1].innerHTML = 'Удаление...'
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
    //open to change question
    $('.qChange').click(e=>{
        let block = e.target.parentNode.parentNode
        block.children[5].children[0].value = block.children[1].innerHTML
        block.children[5].children[1].value = block.children[2].innerHTML.replace(/<br>/g, '').replace(/•/g, '')
        for(i=0;i<5;i++){
            $(block.children[i]).css({ 'display': 'none'})
        }
        $(block.children[5]).css({ 'display': 'block'})
        block.children[5].children[3].children[0].innerHTML = block.children[5].children[1].value.length
        block.children[5].children[4].children[0].innerHTML = block.children[5].children[0].value.length
    })
    //close to change question
    $('.questionChangeCross').click(e=>{
        let block = e.target.parentNode.parentNode.parentNode
        for(i=1;i<5;i++){
            $(block.children[i]).css({ 'display': 'block'})
        }
        $(block.children[5]).css({ 'display': 'none'})
    })
    //send changed question
    $('.questionChangeSend').click(e=>{
        const block = e.target.parentNode.parentNode.parentNode
        const id = block.children[0].innerHTML
        const name = block.children[5].children[0].value
        const text = block.children[5].children[1].value
        if(text.replace(/ /g,'') == '' || name.replace(/ /g,'') == ''){
            alert('Fill in all the necessary fields (question, answer)')
        }
        $(e.target.parentNode.children[0]).css({ 'display': 'none'})
        $(e.target.parentNode.children[1]).css({ 'display': 'none'})
        $(e.target.parentNode.children[2]).css({ 'display': 'inline-block'})
        console.log(text)
        console.log(name)
        let formData = new FormData()
        console.log($(e.target.parentNode.parentNode.children[5].children[1]).css('margin-left'))
        if($(e.target.parentNode.parentNode.children[5].children[1]).css('margin-left') == '0px') formData.append('image', e.target.parentNode.parentNode.children[5].children[0].files[0])
        $.ajax({
            url: '/en/changeQuestion',
            method: 'post',
            data: { text: text, name: name, id: id },
            data: formData,
            processData: false,
            contentType: false,
            headers: {
            text: encodeURIComponent(text),
            name: encodeURIComponent(name),
            id: encodeURIComponent(id),
            height: (e.target.parentNode.parentNode.children[5].children[0].files[0] && $(e.target.parentNode.parentNode.children[5].children[1]).css('margin-left') == '0px') ? encodeURIComponent($(e.target.parentNode.parentNode.children[5].children[1]).css('height')) : null
        },
            success: (res)=>{
                if(res == 'ok'){
                    window.location.href = window.location.href
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
            function changeBl(image){
                if(image){
                    return `
                <div style='display: none'>
                    <textarea class="questionNameChange" placeholder="Question (up to 100 characters)" maxlength="100"></textarea>
                    <textarea class="questionTextChange" maxlength="2000" style='border: 1px solid black'></textarea>
                    <div class="justify-content-center d-flex" style='top: ${+20 + +image.height.match(/\d+/)[0] + 'px'}; position: relative'>
                        <img class='questionChangeCross' src='/imgs/cross.png'>
                        <input type="button" value='Save' class='questionChangeSend'>
                        <div class="spinner-border" role="status" style="display: none; margin-top: 10px;"></div>
                    </div>
                    <div class='qSymbols'>Printed characters: <span class='qSymbolsSp'>0</span>/2000</div>
                    <div class='qSymbols2'>Printed characters: <span class='qSymbolsSp'>0</span>/100</div>
                    <label class="addImageLable" style='top: -50px'>
                        <input type="file" class="addImageInpChange">
                        <img src="/getImage/${image.id}" class="addImageImgChange" 
                        style='width: 100%; margin-left: 0px; margin-top: 0px;
                        margin-bottom: 0px; opacity: 1 '>
                    </label>
                </div>
                `
                }
                return `
                <div style='display: none'>
                    <textarea class="questionNameChange" placeholder="Question (up to 100 characters)" maxlength="100"></textarea>
                    <textarea class="questionTextChange" maxlength="2000" style='border: 1px solid black'></textarea>
                    <div class="justify-content-center d-flex" style='top: 150px; position: relative'>
                        <img class='questionChangeCross' src='/imgs/cross.png'>
                        <input type="button" value='Save' class='questionChangeSend'>
                        <div class="spinner-border" role="status" style="display: none; margin-top: 10px;"></div>
                    </div>
                    <div class='qSymbols'>Printed characters: <span class='qSymbolsSp'>0</span>/2000</div>
                    <div class='qSymbols2'>Printed characters: <span class='qSymbolsSp'>0</span>/100</div>
                    <label class="addImageLable" style='top: -50px'>
                        <input type="file" class="addImageInpChange">
                        <img src="/imgs/image.png" class="addImageImgChange">
                    </label>
                </div>
                `
            }
            console.log(res.questions)
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
                    ${(e.image) ? `<img src='/getImage/${e.image.id}' class='questionImg' style='height: ${e.image.height}'>` : '<img style="display: none">'}
                    ${(res.admin) ? actions + changeBl(e.image) : ''}
                </div>
                `)
            })
            addDeleteEvent()
            addChangeEvent()
            addChangeTextEvent()
            addPhotoEvents()
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

function addPhotoEvents(){
//add photo to question
$('.addImageInp').change(e=>{
    console.log(111)
    const file = e.target.files[0]
    const image = e.target.parentNode.children[1]

        if(file.size > 2097152){
            e.target = e.target.parentNode.children[1]
            e.target.value = null
            alert('Select an image up to 2mb in size.')
            setTimeout(()=>{
                e.target.src = '/imgs/image.png'
            $(e.target).css({
                'width': '30%',
                'margin-left': '35%',
                'margin-top': '25px',
                'margin-bottom': '25px',
                'opacity': '0.2',
            })
            console.log(e.target.parentNode.parentNode.children[3].children[0])
            $(e.target.parentNode.parentNode.children[3].children[0]).css({
                'top': '150px'
            })
            $(e.target.parentNode.parentNode.children[3].children[1]).css({
                'top': '150px'
            })
            }, 51)
        }
        else if(file != undefined){
            const fileReader = new FileReader()
            fileReader.onload = fileLoad =>{
                const result = fileLoad.target.result
                image.src = result
                $(image).css({
                    'width': '100%',
                    'margin-top': '0px',
                    'margin-left': '0px',
                    'margin-bottom': '0px',
                    'opacity': '1',
                })
                setTimeout(()=>{
                $(e.target.parentNode.parentNode.children[3].children[0]).css({
                    'top': +10 + +$(image).css('height').match(/\d+/)[0] + 'px'
                })
                $(e.target.parentNode.parentNode.children[3].children[1]).css({
                    'top': +10 + +$(image).css('height').match(/\d+/)[0] + 'px'
                })
                const fd = new FormData()
                fd.append('photo', file)
                }, 50)
            }
            fileReader.readAsDataURL(file)
        }
})

//delete photo if file is not image
$(".addImageImg").on('error', e=>{
    let photoSrc = e.target.src
    e.target.parentNode.children[0].value = null
    if(photoSrc != null){
        setTimeout(()=>{
            e.target.src = '/imgs/image.png'
        $(e.target).css({
            'width': '30%',
            'margin-left': '35%',
            'margin-top': '25px',
            'margin-bottom': '25px',
            'opacity': '0.2',
        })
        console.log(e.target.parentNode.parentNode.children[3].children[0])
        $(e.target.parentNode.parentNode.children[3].children[0]).css({
            'top': '150px'
        })
        $(e.target.parentNode.parentNode.children[3].children[1]).css({
            'top': '150px'
        })
        alert('This photo format is not supported.')
        }, 51)
    }
})
//add photo to question(change)
$('.addImageInpChange').change(e=>{
    console.log(111)
    const file = e.target.files[0]
    const image = e.target.parentNode.children[1]

        if(file.size > 2097152){
            e.target = e.target.parentNode.children[1]
            e.target.value = null
            console.log(e.target.files)
            alert('Select an image up to 2mb in size.')
            setTimeout(()=>{
                e.target.src = '/imgs/image.png'
            $(e.target).css({
                'width': '30%',
                'margin-left': '35%',
                'margin-top': '25px',
                'margin-bottom': '25px',
                'opacity': '0.2',
            })
            $(e.target.parentNode.parentNode.children[2]).css({
                'top': '150px'
            })
            }, 51)
        }
        else if(file != undefined){
            const fileReader = new FileReader()
            fileReader.onload = fileLoad =>{
                const result = fileLoad.target.result
                image.src = result
                $(image).css({
                    'width': '100%',
                    'margin-top': '0px',
                    'margin-left': '0px',
                    'margin-bottom': '0px',
                    'opacity': '1',
                })
                setTimeout(()=>{
                $(e.target.parentNode.parentNode.children[2]).css({
                    'top': +10 + +$(image).css('height').match(/\d+/)[0] + 'px'
                })
                const fd = new FormData()
                fd.append('photo', file)
                }, 50)
            }
            fileReader.readAsDataURL(file)
        }
})

//delete photo if file is not image(change)
$(".addImageImgChange").on('error', e=>{
    console.log(11111111)
    let photoSrc = e.target.src
    e.target.parentNode.children[0].value = null
    console.log(e.target.parentNode.children[0].files[0])
    if(photoSrc != null){
        setTimeout(()=>{
            e.target.src = '/imgs/image.png'
        $(e.target).css({
            'width': '30%',
            'margin-left': '35%',
            'margin-top': '25px',
            'margin-bottom': '25px',
            'opacity': '0.2',
        })
        console.log(e.target.parentNode.parentNode.children[3].children[0])
        $(e.target.parentNode.parentNode.children[2].children[0]).css({
            'top': '150px'
        })
        $(e.target.parentNode.parentNode.children[2].children[1]).css({
            'top': '150px'
        })
        alert('This photo format is not supported.')
        }, 51)
    }
})
}