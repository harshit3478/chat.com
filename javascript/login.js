

const login = document.getElementById("login");


// console.log(user_para);
login.addEventListener("click", handleLogin);

const url = "https://kgpconnect-9684280cf43d.herokuapp.com/api/auth/login";

async function handleLogin(e) {
  e.preventDefault();
  
  const user = document.getElementById("username");
  const pass = document.getElementById("password");
  const username = user.value;
  const password = pass.value;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        username,
        password,
      }),
    });

    // Check if the response status is OK (200)
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      localStorage.setItem('userData', JSON.stringify(data));
      // alert("User logged in successfully");
      location.href = '/home';
      // Corrected variable assignments
     

      // Update the user name and email in the DOM
      
    } else if(response.status === 410) {
      document.getElementById('msg-para').style.display = "block";
    }else if(response.status === 411 ){
      document.getElementById("user-don't-exist").classList.remove('hidden')
      document.getElementById("blank").classList.add('hidden')

    }
    else if(response.status===412){
      document.getElementById("blank").classList.remove('hidden')
      document.getElementById("user-don't-exist").classList.add('hidden')

    }
     else {
      document.getElementById('msg-para').style.display = "block";
      console.log("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.log("Error:", error);
  }
}


// console.log("hello");
