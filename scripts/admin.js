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

//sign in
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
                if(res.token){
                    localStorage.setItem('token', res.token)
                    window.location = '/'
                }
            }, 
            error: (res)=>{
                $('.signinBlErr').html(res.responseText)
            }
        })
    }
})

//open signin window
$('.signin').on('click', ()=>{
    $('.signinBl').css({
        'top': '70px'
    })
})

//<a href="/admin"><img class="admin" src="/imgs/admin.png"></a> 

//close signin window
$(".signinBlCross").on('click', e=>{
    $(e.target.parentNode).css({
        'top': '-250px'
    })
})

//signout
$(".signout").on('click', ()=>{
    document.cookie = "token=none; max-age=0"
    localStorage.removeItem('token')
    window.location = '/'
})

//open change password
$('.signinChangePassword').click(e=>{
    $('.changePassword').css({ top: '50px'})
    $(e.target.parentNode).css({ 'top': '-250px' })
})

//change password
$('.changePassword').on('submit', e=>{
    e.preventDefault()
    const password1 = $('.changePasswordInp')[0].value
    const password2 = $('.changePasswordInp')[1].value
    if(password1.replace(/ /g,'') == '' || password1.replace(/ /g,'') == ''){
        return alert('Пароль не должен состоять из пробелов')
    }
    else if(password1 != password2){
        return alert('Пароли не совпадают')
    }
    $.ajax({
        url: '/changeAdminPassword',
        method: 'post',
        data: { password1: password1, password2: password2},
        success: (res)=>{
            if(res.token){
                localStorage.setItem('token', res.token)
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
})

//open create admin
$('.addAdmin').click(e=>{
    $('.adminUserBlNewFilters').css({
        'display': 'flex'
    })
    $('.adminUserBlFiltersNewLogin')[0].focus()
})