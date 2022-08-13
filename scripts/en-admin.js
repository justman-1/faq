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
        alert('Fill in all the login fields')
    }else{
        $.ajax({
            type: 'POST',
            url: '/en/signin',
            data: {password: password, login: login},
            success: (res)=>{
                if(res.token){
                    localStorage.setItem('token', res.token)
                    window.location = '/en'
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
        return alert('The password must not consist of spaces')
    }
    else if(password1 != password2){
        return alert("Passwords don't match")
    }
    $.ajax({
        url: '/en/changeAdminPassword',
        method: 'post',
        data: { password1: password1, password2: password2},
        success: (res)=>{
            if(res.token){
                localStorage.setItem('token', res.token)
                window.location = '/en'
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
    if($('.adminUserBlNewFilters').css('display') != 'flex'){
        $('.adminUserBlNewFilters').css({ 'display': 'flex' })
        $('.adminUserBlFiltersNewLogin')[0].focus()
        $('.addAdminImg').css({ transform: 'rotate(45deg)'})
    }
    else{
        $('.adminUserBlNewFilters').css({ 'display': 'none' })
        $('.adminUserBlFiltersNewLogin')[0].blur()
        $('.addAdminImg').css({ transform: 'rotate(0deg)'})
    }
})

//create admin
$('.createAdminBut').click(e=>{
    const login = $('.adminUserBlFiltersNewLogin')[0].value
    const password = $('.adminUserBlFiltersNewLogin')[1].value
    if(login.replace(/ /g,'') == '' || password.replace(/ /g,'') == '') return alert('Fill in all fields (login, password)')
    $(e.target).css({ 'display': 'none' })
    $(e.target.parentNode.children[1]).css({ 'display': 'inline-block' })
    $.ajax({
        url: '/en/addAdmin',
        method: 'post',
        data: { login: login, password: password },
        success: (res)=>{
            if(res.login){
                $(e.target).css({ 'display': 'inline-block' })
                $('.addAdminImg').css({ transform: 'rotate(0deg)'})
                $(e.target.parentNode.children[1]).css({ 'display': 'none' })
                $(e.target.parentNode.parentNode).css({ 'display': 'none' })
                $(e.target.parentNode.parentNode.children[0]).val('')
                $(e.target.parentNode.parentNode.children[1]).val('')
                $('.adminContUsers').prepend(`
                <div class="adminUserBl">
                    <div class="adminUserBlId">${res.id}</div>
                    <div class='adminUserBlLogin'>${res.login}</div>
                    <div class='adminUserBlLogin'>${password}</div>
                    <div class='adminUserBlFiltersLogin d-flex justify-content-center'>
                        <img src="/imgs/delete.png" class="adminUserBlDelete"'>
                        <img src="/imgs/pencil.png" class="adminUserBlChange">
                        <div class="spinner-border" style="display: none" role="status"></div>
                    </div>
                </div>
                `)
                $('.adminUserBlDelete').click(deleteAdmin)
            }
        },
        error: (res)=>{
            if(res.status == 410){
                alert(res.responseText)
                $(e.target).css({ 'display': 'block' })
                $(e.target.parentNode.children[1]).css({ 'display': 'none' })
            }
            else if(res.status == 411){
                localStorage.removeItem('token')
                document.cookie = "token=none; max-age=0"
            }
        }
    })
})

//delete admin
function deleteAdmin(e){
    const login = e.target.parentNode.parentNode.children[1].innerHTML
    let response = window.confirm('Are you sure you want to permanently delete the administrator account with the nickname ' + login)
    if(response){
        const id = e.target.parentNode.parentNode.children[0].innerHTML
        $(e.target.parentNode.parentNode.children[3].children[0]).css({ display: 'none' })
        $(e.target.parentNode.parentNode.children[3].children[1]).css({ display: 'none' })
        $(e.target.parentNode.parentNode.children[3].children[2]).css({ display: 'inline-block' })
        $.ajax({
            url: '/en/deleteAdmin',
            method: 'post',
            data: { id: id },
            success: (res)=>{
                if(res == 'ok'){
                    $(e.target.parentNode.parentNode).remove()
                }
            },
            error: (res)=>{
                if(res.status == 410){
                    alert(res.responseText)
                    $(e.target.parentNode.parentNode.children[3].children[0]).css({ display: 'block' })
                    $(e.target.parentNode.parentNode.children[3].children[1]).css({ display: 'block' })
                    $(e.target.parentNode.parentNode.children[3].children[2]).css({ display: 'none' })
                }
                else if(res.status == 411){
                    localStorage.removeItem('token')
                    document.cookie = "token=none; max-age=0"
                }
            }
        })
    }
}
$('.adminUserBlDelete').click(deleteAdmin)

//open to change admin data
function OpenChangeAdmin(e){
    const block = e.target.parentNode.parentNode
    for(let i = 1; i < 4; i++){
        $(block.children[i]).css({ display: 'none' })
    }
    for(let i = 4; i < 7; i++){
        $(block.children[i]).css({ display: 'block' })
    }
}
$('.adminUserBlChange').click(OpenChangeAdmin)

//dont save
function dontCreateAdmin(e){
    const block = e.target.parentNode.parentNode
    for(let i = 1; i < 4; i++){
        $(block.children[i]).css({ display: 'block' })
    }
    for(let i = 4; i < 7; i++){
        $(block.children[i]).css({ display: 'none' })
    }
    for(let i = 1; i < 3; i++){
        $(block.children[i + 3]).val($(block.children[i]).html())
    }
}
$('.dontCreateAdminBut').click(dontCreateAdmin)

//change admin data
function changeAdmin(e){
    const block = e.target.parentNode.parentNode
    const id = block.children[0].innerHTML
    const login = block.children[4].value
    const password = block.children[5].value
    if(login.replace(/ /g,'') == '' || password.replace(/ /g,'') == '') return alert('Fill in all fields (login, password)')
    $(block.children[3].children[0]).css({ 'display': 'none' })
    $(block.children[3].children[1]).css({ 'display': 'none' })
    $(block.children[3].children[2]).css({ 'display': 'inline-block' })
    $.ajax({
        url: '/en/changeAdmin',
        method: 'post',
        data: { login: login, password: password, id: id },
        success: (res)=>{
            if(res.login){
                $(block.children[1]).html(res.login)
                $(block.children[2]).html(res.password)
                for(let i = 1; i < 4; i++){
                    $(block.children[i]).css({ display: 'block' })
                }
                for(let i = 4; i < 7; i++){
                    $(block.children[i]).css({ display: 'none' })
                }
                $(block.children[3].children[0]).css({ 'display': 'inline-block' })
                $(block.children[3].children[1]).css({ 'display': 'inline-block' })
                $(block.children[3].children[2]).css({ 'display': 'none' })
            }
        },
        error: (res)=>{
            if(res.status == 410){
                alert(res.responseText)
                $(block.children[3].children[0]).css({ 'display': 'inline-block' })
                $(block.children[3].children[1]).css({ 'display': 'inline-block' })
                $(block.children[3].children[2]).css({ 'display': 'none' })
            }
            else if(res.status == 411){
                localStorage.removeItem('token')
                document.cookie = "token=none; max-age=0"
            }
        }
    })
}
$('.saveAdminBut').click(changeAdmin)