

const signup = document.getElementById("signup");
const validate = document.getElementById('validate')
const user = document.getElementById("username");
const pass = document.getElementById("password");
const ema = document.getElementById("email");
const Otp = document.getElementById('otp')
user.setAttribute("valid", "true");
console.log(user.checkValidity());
var otp; 
validate.addEventListener('click', async (e) => {
  e.preventDefault();
  const to = ema.value;
  await fetch(`https://kgpconnect-9684280cf43d.herokuapp.com/api/auth/sendmail?to=${to}`, { method: 'GET' })
    .then((res) => 
      res.json()).then((data)=>{
        console.log(data);
        if(data.otp){
          otp = data.otp;
          alert('otp send successfully')
        }

      })
 
    validate.classList.add('hidden')
    signup.classList.remove('hidden')
    document.getElementById('otp-field').classList.remove('hidden');


})
signup.addEventListener("click", handlesignup);

const url = "https://kgpconnect-9684280cf43d.herokuapp.com/api/auth/signup";

async function handlesignup(e) {
  e.preventDefault();


  const email = ema.value;
  const username = user.value;
  const password = pass.value;
  try {
    console.log(otp ,parseInt(Otp.value) , Otp.value)
    if(otp === parseInt(Otp.value)){
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        // credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
          username: username,
          password: password,
          email: email,
        }),
      });
      console.log("consoliing ...")
  
      if (password.length < 8) {
        document.getElementById("msg-para-email").style.display = "none";
        document.getElementById("msg-para-user").style.display = "none";
        document.getElementById("msg-para-pass").style.display = "block";
      } else if (response.status === 200) {
        // const data = await response.json();
        // console.log(data);
        alert("user registered succesfully");
        location.href = "/login";
        
      } else if (response.status === 410) {
        document.getElementById("msg-para-pass").style.display = "none";
  
        document.getElementById("msg-para-email").style.display = "none";
        document.getElementById("msg-para-user").style.display = "block";
      } else if (response.status === 411) {
        document.getElementById("msg-para-user").style.display = "none";
        document.getElementById("msg-para-pass").style.display = "none";
  
        document.getElementById("msg-para-email").style.display = "block";
      } else {
        console.log("Error:", response.status, response.statusText);
      }
    }
    else{
      document.getElementById('otp-para').classList.remove('hidden')
    }
   
  } catch (error) {
    console.log("Error:", error);
  }
}
// console.log("hello what's up there and now what are you doing")
// console.log("hello");
