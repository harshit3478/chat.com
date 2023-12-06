import { field, form, socket } from "./home.js";
import { user_list } from "./usersearch.js";

//render msgs logic
export function renderMsgs() {
  const user1 = document.getElementById("user-name").innerHTML;
  const user2 = document.getElementById("inchat-name").innerHTML;
  document.getElementById("scroll-container").innerHTML = "";
  fetch(
    `https://kgp-connect.onrender.com/api/auth/getmsgs?sender=${user1}&receiver=${user2}`,
    { method: "GET" }
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      data.map((e) => {
        if (e.sender === user1) {
          let html = `<div id='scrt-msgs' class=" sent flex flex-col justify-end mr-3 " style='align-items:end;width:95%' id="msg-sent">  <p class=" block dark:bg-neutral-950 p-1 text-white bg-indigo-400 w-fit rounded-lg px-2 font-semibold text-lg mt-4 mr-4 shadow-md dark:shadow-slate-800 shadow-indigo-200">${e.message}</p><p class='text-sm text-slate-400 mr-4 shrink-0'>${e.timestamp}</p></div>`;
          document.getElementById("scroll-container").innerHTML += html;
        } else {
          let html = `<div id='scrt-msgs' class="received w-full flex flex-col justify-start"  style='align-items:start' id="msg-rcv">
        <p class=" block dark:bg-neutral-950 p-1 text-white bg-indigo-400 mx-2 my-1 w-fit rounded-lg px-2 font-semibold text-lg dark:shadow-slate-800 mr-4 shadow-md">${e.message}</p><p class='text-sm text-slate-400'>${e.timestamp}</p>
      </div>`;
          document.getElementById("scroll-container").innerHTML += html;
        }
        autoScroll();
      });
    })
    .catch((err) => {
      console.log("Error:", err);
    });
  autoScroll();
}
export function playAudio(){
  var click = new Audio('/click.mp3')
  click.play();
}

export function searchMsgs(value) {
  const user1 = document.getElementById("user-name").innerHTML;
  const user2 = document.getElementById("inchat-name").innerHTML;
  const searchPattern = new RegExp(value, "i");
  document.getElementById("scroll-container").innerHTML = "";
  fetch(
    `https://kgp-connect.onrender.com/api/auth/getmsgs?sender=${user1}&receiver=${user2}`,
    { method: "GET" }
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      data = data.filter((item) => searchPattern.test(item.message))
      data.map((e) => {
        if (e.sender === user1) {
          let html = `<div class=" flex flex-col justify-end mr-3 " style='align-items:end;width:95%' id="msg-sent">  <p class=" block dark:bg-neutral-950 p-1 text-white  bg-indigo-400  w-fit rounded-lg px-2 font-semibold text-lg mt-4 mr-4 dark:shadow-slate-800 shadow-md">${e.message}</p><p class='text-sm text-slate-400 mr-4 shrink-0'>${e.timestamp}</p></div>`;
          document.getElementById("scroll-container").innerHTML += html;
        } else {
          let html = `<div class="w-full flex flex-col justify-start"  style='align-items:start' id="msg-rcv">
        <p class=" block dark:bg-neutral-950 p-1 text-white  bg-indigo-400 mx-2 my-1 w-fit rounded-lg px-2 font-semibold text-lg dark:shadow-slate-800  mr-4 shadow-md">${e.message}</p><p class='text-sm text-slate-400'>${e.timestamp}</p>
      </div>`;
          document.getElementById("scroll-container").innerHTML += html;
        }
        autoScroll();
      });
    })
    .catch((err) => {
      console.log("Error:", err);
    });
  autoScroll();
}

export function autoScroll() {
  const scrollContainer = document.getElementById("scroll-container");
  scrollContainer.scrollTop = scrollContainer.scrollHeight;
}

export function autoSwitchTheme() {

  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

}

export function switchTheme() {
  // dark mode logic

  autoSwitchTheme()
  const theme = document.getElementById("theme");


  theme.addEventListener("click", () => {
    document.getElementById('theme-selector').classList.remove('hidden')
    console.log("theme btn clicked")
  });
  document.getElementById('dark').addEventListener('click', () => {
    localStorage.theme = 'dark'
    document.getElementById('theme-selector').classList.add('hidden')
    autoSwitchTheme()
  })
  document.getElementById('light').addEventListener('click', () => {
    localStorage.theme = 'light'
    document.getElementById('theme-selector').classList.add('hidden')
    autoSwitchTheme();
  })
  document.getElementById('system').addEventListener('click', () => {
    localStorage.removeItem('theme')
    document.getElementById('theme-selector').classList.add('hidden')
    autoSwitchTheme()
  })
}

export function isTyping() {
  //typing indicator logic
  field.addEventListener("input", function () {
    socket.emit("typing", document.getElementById("inchat-name").innerHTML);
  });
  const userType =
    JSON.parse(localStorage.getItem("userData")).username + "typing";
  socket.on(userType, function () {
    var head = document.getElementById("last-active");
    head.textContent = "typing...";
    setTimeout(() => {
      head.innerHTML = `<span class="text-green-400"> ●</span> <span  > Online </span>`;
    }, 1500);
  });
}
export function isOnline() {
  socket.emit("Online", document.getElementById("inchat-name").innerHTML);

  const userType =
    JSON.parse(localStorage.getItem("userData")).username + "online";
  socket.on(userType, function () {
    var head = document.getElementById("last-active");
    setTimeout(() => {
      head.innerHTML = `<span class="text-green-400"> ●</span> <span  > Online </span>`;
    }, 1500);
  });
}
export function isOffline() {
  socket.emit("Offline", document.getElementById("inchat-name").innerHTML);

  const userType =
    JSON.parse(localStorage.getItem("userData")).username + "offline";
  socket.on(userType, function () {
    var head = document.getElementById("last-active");
    setTimeout(() => {
      head.textContent = "last seen recently";
    }, 1000);
  });
}

export async function updateMsgs(a, b, c) {
  await fetch(
    `https://kgp-connect.onrender.com/api/auth/updatemsgs?sender=${a}&receiver=${b}&msg=${c}`,
    { method: "PUT" }
  ).catch((err) => {
    console.log(err);
  });
  renderMsgs();
}

export async function mapUserList(arr) {
  // render the all users and show them as a list
  arr.forEach((array) => {
    var html = ` <button id='userlist-btn' class="flex  w-full bg-white shadow-sm shadow-slate-800  first:pt-1 last:pb-1 hover:bg-slate-300 dark:hover:bg-stone-50 p-2">
    <img class=" rounded-full" src="download.png" alt="hello" style="width:50px; margin-right:4px" />
    <div class="ml-3 overflow-hidden text-left">
      <p id='userlist-username' class="text-md font-medium text-slate-900 ">${array.username}</p>
      <p id='userlist-email' class="text-sm text-slate-500 font-thin  truncate">${array.email}</p>
    </div>
  </button>`;
    document.querySelector(".user-list-container").classList.remove("hidden");
    if (!(document.getElementById("user-name").innerHTML === array.username)) {
      user_list.innerHTML += html;
    }
  });
}
export async function enterChat(inChatName) {
  document.querySelector(".right").classList.remove("hidden");
  document.querySelector(".left").classList.remove("bg-gradient-to-b");
  document.getElementById("homepage-img").classList.add("hidden");

  document.getElementById("inchat-name").innerHTML = inChatName;
  document.getElementById("last-active").innerHTML = "last seen recently ";
  renderMsgs();
  autoScroll();
  localStorage.setItem('lastChat', inChatName)
}
export async function isChatListClick() {
  let i = 0;
  var on_chat = document.querySelectorAll("#in-chat");
  var on_chat2 = document.querySelectorAll("#chatlist-username");

  on_chat.forEach((element, i) => {
    element.addEventListener("click", (event) => {
      console.log("yeah you wanna enter in the chaty");
      event.preventDefault();
      const usernameElement = on_chat2[i];
      if (usernameElement) {
        enterChat(usernameElement.innerHTML);
      }
    });
  });
}

export async function isUserListClick() {
  let chatListArray = JSON.parse(localStorage.getItem("chat-list-array")) || [];
  const userlist_btns = document.querySelectorAll("#userlist-btn");
  const userlist = document.querySelectorAll("#userlist-username");
  const emaillist = document.querySelectorAll("#userlist-email");
  var on_chat2 = document.querySelectorAll("#chatlist-username");
  // if user want to start a new chat with a user

  let j = 0;
  userlist_btns.forEach((btn, j) => {
    btn.addEventListener("click", async (event) => {
      renderChats(document.getElementById("user-name").innerHTML);
      var flag = false;
      event.preventDefault();
      document.querySelector(".user-list-container").classList.add("hidden"); //hide the user-list
      const userElement = userlist[j];
      const emailElement = emaillist[j];
      await enterChat(userElement.innerHTML);


      await updateChats(
        document.getElementById("user-name").innerHTML,
        userElement.innerHTML
      );
      await renderChats(document.getElementById("user-name").innerHTML);

      isChatListClick();
      // console.log(chatListArray.length);
    });
  });
}
export async function renderChats(username) {
  const htmlArray = [];
  document.getElementById("chat-list").innerHTML = "";
  
 
  try {
    await fetch(`https://kgp-connect.onrender.com/api/auth/getchats?user=${username}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then(async (data) => {
        const allmsgs = document.querySelectorAll("#scrt-msg")
        console.log(allmsgs)

        for (const chat of data.chats) {


          const chatHtml = `<button id="in-chat" class="w-full overflow-hidden">
          <li class="chat  list-none  m-0 p-0 flex items-center  hover:bg-slate-200" >
            <img src="/chat.png" alt="ntg" class="rounded-full w-14 h-14 mx-8 my-2"/>
            <div class="mx-2 my-1 text-left">
              <h2 id='chatlist-username' class="font-bold dark:text-white text-lg ">${chat.username}</h2>
              <h4 class="text-slate-300 whitespace-pre">${chat.sender}:${chat.lastmsg}</h4>
            </div>
          </li>
        </button>`;

          htmlArray.push(chatHtml);
        }

        const finalHtml = htmlArray.join("");
        document.getElementById("chat-list").innerHTML = finalHtml;
        // console.log(finalHtml);
      });
  } catch (error) {
    console.error("Error: ", error)
  }

  isChatListClick();
}


export async function updateChats(user, newUser) {
  await fetch(
    `https://kgp-connect.onrender.com/api/auth/updatechats?user=${user}&username=${newUser}`,
    { method: "PUT" }
  ).catch((err) => {
    console.error("Error:", err);
  });
}
