const signup = document.getElementById("signup");
const user = document.getElementById("username");
const pass = document.getElementById("password");
const ema = document.getElementById("email");
user.setAttribute("valid" , "true");
console.log(user.checkValidity());

signup.addEventListener("click", handlesignup);

const url = "https://kgp-connect.onrender.com/api/auth/signup";

async function handlesignup(e) {
  e.preventDefault();

 console.log("consoliing ")
  const email = ema.value;
  const username = user.value;
  const password = pass.value;
  try {
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
        username : username,
        password : password,
        email : email,
      }),
    });
    console.log("consoliing ...")

    if (password.length < 8) {
      document.getElementById("msg-para-email").style.display = "none";
      document.getElementById("msg-para-user").style.display = "none";
      document.getElementById("msg-para-pass").style.display = "block";
    } else if (response.status === 200) {
      const data = await response.json();
      console.log(data);
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
  } catch (error) {
    console.log("Error:", error);
  }
}
// console.log("hello what's up there and now what are you doing")
// console.log("hello");
