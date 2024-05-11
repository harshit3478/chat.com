import { field, form, socket } from "./home.js";
import { is_responsive, responsive } from "./responsive.js";
import { user_list } from "./usersearch.js";

//render msgs logic
export function renderMsgs() {
  console.log('rendering messages .... ')
  const user1 = document.getElementById("user-name").innerHTML;
  const user2 = document.getElementById("inchat-name").innerHTML;
  document.getElementById("scroll-container").innerHTML = "";
  fetch(
    `/api/auth/getmsgs?sender=${user1}&receiver=${user2}`,
    { method: "GET" }
  )
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("scroll-container").innerHTML = "";
      console.log(data);
      data.map((e) => {
        if (e.sender === user1) {
          let html = `<div id='scrt-msgs' class="sent md:flex md:flex-col md:justify-end md:mr-3 sent flex flex-col justify-end " style='align-items:end;width:95%' id="msg-sent">  <p id='themsg'  class=" md:block md:dark:bg-neutral-950 md:p-1 md:text-white md:bg-indigo-400 md:w-fit md:rounded-md md:px-2 md:font-semibold md:text-lg md:mt-4 md:mr-4 block dark:bg-neutral-950 py-0.5 text-white bg-indigo-400 w-fit rounded-md px-2 font-semibold text-lg mt-2 mr-1">${e.message}</p><p class='md:text-sm md:text-slate-400 md:mr-4 md:shrink-0 text-sm text-slate-400 mr-1 shrink-0'>${e.timestamp}</p></div>`;
          document.getElementById("scroll-container").innerHTML += html;
        } else {
          let html = `<div id='scrt-msgs' class="received w-full flex flex-col justify-start"  style='align-items:start' id="msg-rcv">
        <p id='themsg'  class=" block dark:bg-neutral-950 p-1 text-white bg-indigo-400 mx-2 my-1 w-fit rounded-lg px-2 font-semibold text-lg dark:shadow-slate-800 mr-4 shadow-md">${e.message}</p><p class='text-sm text-slate-400'>${e.timestamp}</p>
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
export function playAudio() {
  var click = new Audio('/click.mp3')
  click.play();
}

export function searchMsgs(value) {
  const user1 = document.getElementById("user-name").innerHTML;
  const user2 = document.getElementById("inchat-name").innerHTML;
  const searchPattern = new RegExp(value, "i");
  document.getElementById("scroll-container").innerHTML = "";
  fetch(
    `/api/auth/getmsgs?sender=${user1}&receiver=${user2}`,
    { method: "GET" }
  )
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
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
      // console.log("Error:", err);
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
    // console.log("theme btn clicked")
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
    socket.emit("typing", { sender: document.getElementById('user-name').innerHTML, receiver: document.getElementById("inchat-name").innerHTML })
  });
  const userType =
    JSON.parse(localStorage.getItem("userData")).username + "typing";
  socket.on(userType, function (sender) {

    // console.log(sender, document.getElementById("inchat-name").innerHTML)
    if (sender === document.getElementById("inchat-name").innerHTML) {

      var head = document.getElementById("last-active");
      head.textContent = "typing...";
      setTimeout(() => {
        head.innerHTML = `<span class="text-green-400"> ●</span> <span  > Online </span>`;
      }, 1500);
    }
  });
}
export function isOnline() {
  socket.on('connection', () => {
    socket.emit("Online", { sender: document.getElementById("inchat-name").innerHTML, receiver: document.getElementById('user-name').innerHTML });

    const userType = JSON.parse(localStorage.getItem("userData")).username + "online";

    socket.on(userType, function (data) {
      if (data === document.getElementById("inchat-name").innerHTML) {
        var head = document.getElementById("last-active");
        setTimeout(() => {
          head.innerHTML = `<span class="text-green-400"> ●</span> <span  > Online </span>`;
        }, 1500);
      }
    });
  })
}
export function isOffline() {
  socket.emit("Offline", { sender: document.getElementById("inchat-name").innerHTML, receiver: document.getElementById('user-name').innerHTML });

  const userType =
    JSON.parse(localStorage.getItem("userData")).username + "offline";
  socket.on(userType, function () {
    if (data === document.getElementById("inchat-name").innerHTML) {
      var head = document.getElementById("last-active");
      setTimeout(() => {
        head.textContent = "last seen recently";
      }, 1000);

    }
  });
}

export async function updateMsgs(a, b, c) {
  await fetch(
    `/api/auth/updatemsgs?sender=${a}&receiver=${b}&msg=${c}`,
    { method: "PUT" }
  ).catch((err) => {
    console.log(err);
  });
  // renderMsgs();
  // renderChats(a);
}

export async function mapUserList(arr) {
  // render the all users and show them as a list
  arr.forEach((array) => {
    var html = ` <button id='userlist-btn' class="flex  w-full bg-white shadow-sm shadow-slate-800  first:pt-1 last:pb-1 hover:bg-slate-300 p-2">
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
  if (is_responsive) {
    document.querySelector('.left').classList.add('hidden')
  };
  document.querySelector(".right").classList.remove("hidden");
  document.querySelector(".left").classList.remove("bg-gradient-to-b");
  document.getElementById("homepage-img").classList.add("hidden");

  document.getElementById("inchat-name").innerHTML = inChatName;
  document.getElementById("last-active").innerHTML = "last seen recently ";
  renderMsgs();
  autoScroll();
  localStorage.setItem('lastChat', inChatName)
  renderChats(document.getElementById('user-name').innerHTML)
}
export async function isChatListClick() {
  let i = 0;
  var on_chat = document.querySelectorAll("#in-chat");
  var on_chat2 = document.querySelectorAll("#chatlist-username");

  on_chat.forEach((element, i) => {
    element.addEventListener("click", (event) => {
      // console.log("yeah you wanna enter in the chaty");
      event.preventDefault();
      const usernameElement = on_chat2[i];
      if (usernameElement) {
        enterChat(usernameElement.innerHTML);
        // 
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
      document.querySelector(".user-list-container").classList.add("hidden")
      if (is_responsive) {
        document.querySelector('.left').classList.add('hidden')
      }; //hide the user-list
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
export function ifBackBtnClicked() {
  if (is_responsive) {
    document.querySelector(".back-btn").addEventListener("click", (e) => {
      document.querySelector('.left').classList.remove('hidden')
      document.querySelector('.right').classList.add('hidden')
      localStorage.removeItem('lastChat')
      renderChats(document.getElementById('user-name').innerHTML)
    })
  };
}
export async function renderChats(username) {
  const htmlArray = [];
  document.getElementById("chat-list").innerHTML = "";
  try {
    await fetch(`/api/auth/getchats?user=${username}`, {
      method: "GET"
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (localStorage.getItem('lastChat')) {
          console.log("is chat ")
          var i = 0; var j = 0;

          for (const chat of data.chats) {
            console.log(chat.username, localStorage.getItem('lastChat'))
            if (chat.username === localStorage.getItem('lastChat')) {
              j = i;
            }
            i = i + 1;
          }

          const currenttop = await data.chats.splice(j, 1);
         
          console.log("first", data.chats, 'currenttp', currenttop)
          
          await data.chats.unshift(currenttop[0]);
          
          console.log("final", data.chats)

        }
        for (const chat of data.chats) {
          const chatHtml = `<button id="in-chat" class="w-full overflow-hidden">
          <li class="chat  list-none  m-0 p-0 flex items-center  hover:bg-slate-200" >
            <img src="/chat.png" alt="ntg" class="rounded-full w-14 h-14 mx-8 my-2"/>
            <div class="mx-2 my-1 text-left">
              <h2 id='chatlist-username' class="font-bold dark:text-white text-lg ">${chat.username}</h2>
              <h4 class="text-slate-300 whitespace-pre">${(chat.sender ? (chat.sender != chat.username ? 'you' : chat.username) : '')} ${(chat.sender ? ' : ' : '')}${(chat.lastmsg ? chat.lastmsg : '')}</h4>
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
    `/api/auth/updatechats?user=${user}&username=${newUser}`,
    { method: "PUT" }
  ).catch((err) => {
    console.error("Error:", err);
  });
}
