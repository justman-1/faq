function SetFocusAtEnd(elem) {
    var elemLen = elem.textContent.length;
    // For IE Only
    if (document.selection) {
        // Set focus
        elem.focus();
        // Use IE Ranges
        var oSel = document.selection.createRange();
        // Reset position to 0 & then set at end
        oSel.moveStart('character', -elemLen);
        oSel.moveStart('character', elemLen);
        oSel.moveEnd('character', 0);
        oSel.select();
    }
    else if (elem.selectionStart || elem.selectionStart == '0') {
        // Firefox/Chrome
        elem.selectionStart = elemLen;
        elem.selectionEnd = elemLen;
        elem.focus();
    } // if
}

//ready text in cards
$(document).ready(e=>{
    const els = $('.curseText')
    for( i = 0; i < els.length; i++ ){
        document.querySelectorAll('.curseText')[i].innerHTML = document.querySelectorAll('.curseText')[i].textContent
    }
})

//open to create new curse
$('.newCurse').on('click', (e)=>{
    if($(e.target).attr('class') != 'newCurse' && $(e.target).attr('class') != 'cursePlus') return 'stop'
    if(localStorage.getItem('curseCreateState') == 'true') return alert('Сохраните изменения на прошлой карточке, чтобы создать новую')
    if($(e.target).attr('class') == 'cursePlus'){
        localStorage.setItem('curseCreateState', 'true')
        $(e.target.parentNode.children[1]).css({
            'display': 'none'
        })
        $(e.target.parentNode.children[0]).css({
            'display': 'block'
        })
        $(e.target.parentNode.children[2]).css({
            'display': 'block'
        })
        $(e.target.parentNode).attr('class', 'curse')
        $(e.target.parentNode.children[0].children[0]).focus()
    }
    else{
        localStorage.setItem('curseCreateState', 'true')
        $(e.target.children[1]).css({
            'display': 'none'
        })
        $(e.target.children[0]).css({
            'display': 'block'
        })
        $(e.target.parentNode.children[2]).css({
            'display': 'block'
        })
        $(e.target).attr('class', 'curse')
        $(e.target.children[0].children[0]).focus()
    }
})

//prevent lot curse text
$('.newCurseText').on('keypress paste', e=>{
    if (e.target.textContent.length >= 180 && !window.getSelection()) {
        $('.newCurseSymbols').css({ 'color': 'red'})
        e.preventDefault()
        return false
    }
})

//check curse text
$('.newCurseText').on('input', e=>{
    if(e.target.textContent.length == 180){
        console.log('>=180')
        $('.newCurseSymbols').css({ 'color': 'red'})
    }
    else if(e.target.textContent.length > 180){
        const text = e.target.textContent.slice(0, 180)
        $(e.target).html(text)
        $('.newCurseSymbols').css({ 'color': 'red'})
        SetFocusAtEnd(e.target)
    }
    else{
        $('.newCurseSymbols').css({ 'color': '#6EE34F'})
    }
    $('.newCurseSymbolsSp').html(e.target.textContent.length)
})

//save curse
$('.newCurseSave').on('click', (e)=>{
    if($(e.target).attr('class') == 'newCurseSaveSp') e.target = e.target.parentNode
    else if($(e.target).attr('class') != 'newCurseSave d-flex justify-content-center') return 0
    if($(e.target.children[0]).css('display') != 'none'){
        $(e.target.children[0]).css({ 'display': 'none' })
        $(e.target.children[1]).css({ 'display': 'block' })
        const text = e.target.parentNode.parentNode.children[0].innerHTML
        const date = e.target.parentNode.children[1].value.replace(/-/g, '.')
        if(text.replace(/ /g,'') == '' || date == ''){
            alert('Заполните все поля(текст карты, дата)')
            $(e.target.children[0]).css({ 'display': 'block' })
            $(e.target.children[1]).css({ 'display': 'none' })
        }
        else{
            $.ajax({
                url: '/saveCurse',
                method: 'post',
                data: { text: text, date1: date},
                success: (res)=>{
                    if(res.id){
                        $(e.target.children[0]).css({ 'display': 'block' })
                        $(e.target.children[1]).css({ 'display': 'none' })
                        window.location = '/'
                    }
                },
                error: (res)=>{
                    if(res.status == 410) alert(res.responseText)
                    else if(res.status == 411){
                        localStorage.removeItem('token')
                        document.cookie = "token=none; max-age=0"
                    }
                }
            })
        }
    }
})

$('.curseDelete').click(e=>{
    const response = window.confirm('Вы точно хотите безвозвратно удалить эту карту?')
    if(response){
        const id = e.target.parentNode.parentNode.children[0].innerText
        $(e.target.parentNode.parentNode.children).css({
            'display': 'none'
        })
        $(e.target.parentNode.parentNode.children[4]).css({
            'display': 'flex'
        })
        console.log(id)
        $.ajax({
            url: '/deleteCurse',
            method: 'post',
            data: { id: id },
            success: (res)=>{
                if(res == 'ok'){
                    $(e.target.parentNode.parentNode).remove()
                    console.log($('.newCurse').length)
                    if($('.newCurse').length == 3){
                        $('.newCurse')[0].remove()
                        $('.newCurse')[0].remove()
                    }
                    else if($('.newCurse').length < 3){
                        console.log('add')
                        $('.cont').append(`
                        <div class="newCurse">
                        <div class="newCurseChange">
                            <div class="newCurseText" contenteditable="true"></div>
                            <div class="d-flex">
                                <div class="newCurseSave d-flex justify-content-center">
                                    <span class="newCurseSaveSp">Сохранить</span>
                                    <div style='transform: scale(0.7); display: none'><div class="spinner-border" role="status"></div></div>
                                </div>
                                <input class="newCurseDate" type='date'/>
                            </div>
                        </div>
                        <img src="/imgs/plus.png" alt="plus" class="cursePlus">
                        <div class='newCurseSymbols'>Напечатано символов: <span class='newCurseSymbolsSp'>0</span>/180</div>
                        </div>
                        `)
                    }
                }
            },
            error: (res)=>{
                if(res.status == 410){
                    $(e.target.parentNode.parentNode.children).css({
                        'display': 'block'
                    })
                    $(e.target.parentNode).css({
                        'display': 'flex'
                    })
                    $(e.target.parentNode.parentNode.children[4]).css({
                        'display': 'none'
                    })
                    alert('Произошла ошибка при удалении')
                }
                else if(res.status == 411){
                    localStorage.removeItem('token')
                    document.cookie = "token=none; max-age=0"
                }
            }
        })
    }
})