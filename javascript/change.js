const change = document.getElementById('change');
const password = document.getElementById('password')
const confirmPassword = document.getElementById('confirm-password')

const searchParams = new URLSearchParams(window.location.search)
const username = searchParams.get('user')
console.log('user:', username)
change.addEventListener('click', async (e) => {
    e.preventDefault();
    console.log('hello')
    if(password.value.length > 8){

        if (password.value === confirmPassword.value) {
    
            console.log(password.value, 'password.value')
            await fetch('/api/auth/updatepassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    newPassword: password.value,
                }),
            })
                .then(
                    (res) => {
    
                        console.log(res)
                        if(res.status === 200){
                            alert('password reset succesfully ')
                            location.href = '/login'
                        }
                    })
                .catch((error) => {
                    console.log(error);
                })
    
    
        }
        else {
            document.getElementById('mismatch').classList.remove('hidden')
            document.getElementById('password-length').classList.add('hidden')
        }
    }else{
        console.log('password is shorter than 8 chars')
        document.getElementById('password-length').classList.remove('hidden')
        document.getElementById('mismatch').classList.add('hidden')

    }
})