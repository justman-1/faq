function checkCookies(){
    let cookies = document.cookie
    if(
        !document.cookie && localStorage.getItem('token') != undefined || 
        !/token=/.test(document.cookie) && localStorage.getItem('token') != undefined
    ){
        document.cookie = 'token=' + localStorage.getItem('token')
    }
}
checkCookies()
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
    console.log($('.newCurse').length)
    if($(e.target).attr('class') == 'cursePlus'){
        for(i = 0; i < $('.cursePlus').length; i++){
        }
        const l = $('.cursePlus').length
        console.log(l)
        console.log(e.target)
    }
    else{

    }
})



