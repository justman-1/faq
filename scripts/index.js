function checkCookies(){
    localStorage.setItem('curseCreateState', 'false')
    let cookies = document.cookie
    if(
        !document.cookie && localStorage.getItem('token') != undefined || 
        !/token=/.test(document.cookie) && localStorage.getItem('token') != undefined
    ){
        document.cookie = 'token=' + localStorage.getItem('token')
    }
}
checkCookies()

$(document).ready(e=>{
    const els = $('.curseText')
    for( i = 0; i < els.length; i++ ){
        document.querySelectorAll('.curseText')[i].innerHTML = document.querySelectorAll('.curseText')[i].textContent
    }
})

$('.signinBl').on('submit', (e)=>{
    e.preventDefault()
    const login = $('#login').val()
    const password = $('#password').val()
    if(password == '' || login == ''){
        alert('Заполните все поля для входа')
    }else{
        $.ajax({
            type: 'POST',
            url: '/signin',
            data: {password: password, login: login},
            success: (res)=>{
                console.log(res)
                if(res.token){
                    localStorage.setItem('token', res.token)
                    window.location = '/'
                }
            }, 
            error: (res)=>{
                console.log(res.responseText)
                $('.signinBlErr').html(res.responseText)
            }
        })
    }
})

$('.signin').on('click', ()=>{
    $('.signinBl').css({
        'top': '70px'
    })
})

$(".signinBlCross").on('click', ()=>{
    $('.signinBl').css({
        'top': '-250px'
    })
})

$(".signout").on('click', ()=>{
    document.cookie = "token=none; max-age=0"
    localStorage.removeItem('token')
    window.location = '/'
})

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
        $(e.target).attr('class', 'curse')
        $(e.target.children[0].children[0]).focus()
    }
})

$('.newCurseText').on("keypress paste", function (e) {
    if (this.innerHTML.length >= 85) {
        e.preventDefault();
        return false;
    }
});

$('.newCurseSave').on('click', (e)=>{
    if($(e.target).attr('class') == 'newCurseSaveSp') e.target = e.target.parentNode
    else if($(e.target).attr('class') != 'newCurseSave d-flex justify-content-center') return 0
    if($(e.target.children[0]).css('display') != 'none'){
        $(e.target.children[0]).css({ 'display': 'none' })
        $(e.target.children[1]).css({ 'display': 'block' })
        const text = e.target.parentNode.parentNode.children[0].innerHTML
        const date = e.target.parentNode.children[1].value.replace(/-/g, '.')
        console.log(date)
        if(text.replace(/ /g,'') == '' || date == ''){
            alert('Заполните все поля(Текст карточки, дата)')
            $(e.target.children[0]).css({ 'display': 'block' })
            $(e.target.children[1]).css({ 'display': 'none' })
        }
        else{
            $.ajax({
                url: '/saveCurse',
                method: 'post',
                data: { text: text, date1: date},
                success: (res)=>{
                    console.log(res)
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

