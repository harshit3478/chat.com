const reset = document.getElementById('reset')
console.log('hello reset.js')
reset.addEventListener('click' , async(e)=>{
    e.preventDefault();
    const ema = document.getElementById('username')
    const to = ema.value;
  await fetch(`https://kgpconnect-9684280cf43d.herokuapp.com/api/auth/sendmail?to=${to}&username=${to}`, { method: 'GET' })
    .then((res) => 
      res.json()).then((data)=>{
        console.log(data);
        if(data.message === true){
         
          alert('reset password link sent succesfully , Note: link will only open in this device')
        }
        else{
            document.getElementById('not-exist').classList.remove('hidden')
        }

      })
})
 

// -------------------changepassword.html----------------

