
import {
  autoScroll,
  enterChat,
  isChatListClick,
  isOffline,
  isOnline,
  isTyping,
  playAudio,
  renderChats,
  renderMsgs,
  searchMsgs,
  switchTheme,
  updateMsgs,
} from "./functions.js";

export const field = document.getElementById("input");
export const form = document.getElementById("form");
export var socket = io();
isChatListClick();
switchTheme();
//
try {
  const data = JSON.parse(localStorage.getItem("userData"));
  if (data) {
    renderChats(data.username)
    let user_name = data.username;
    let user_email = data.email;
    document.getElementById("user-name").innerHTML = user_name;
    document.getElementById("user-email").innerHTML = user_email;

    /* socket.io logic */
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      playAudio();
      if (field.value) {
        socket.emit(
          "sendingMSG",
          field.value,
          document.getElementById("inchat-name").innerHTML,
          user_email
        );
        updateMsgs(
          user_name,
          document.getElementById("inchat-name").innerHTML,
          field.value
        );


        autoScroll();
        field.value = "";
      }

      renderChats(user_name);
    });
    isTyping();
    isOnline();
    isOffline();
    //when user-rcv msg
    socket.on(user_name, function (msg) {
      var audio = new Audio('/rcv.mp3')
      audio.play()
      
      // renderMsgs();
      const time = new Date();
      const ct = (time.getDate() < 10 ? '0' : '') + time.getDate() + "-" + (time.getMonth() + 1 < 10 ? '0' : '') + (time.getMonth() + 1) + " " + (time.getHours() < 10 ? '0' : '') + time.getHours() + ":" + (time.getMinutes() < 10 ? '0' : '') + time.getMinutes()
      let html = `<div class=" flex flex-col justify-start mr-3 " style='align-items:start;width:95%' id="msg-sent">  <p class=" block dark:bg-neutral-950 p-1 text-white bg-indigo-400 w-fit rounded-lg px-2 font-semibold text-lg mt-4 mr-4 shadow-md dark:shadow-slate-800 shadow-indigo-200">${msg}</p><p class='text-sm text-slate-400 mr-4 shrink-0'>${ct}</p></div>`;
      document.getElementById("scroll-container").innerHTML += html;
      autoScroll();
    });
  }
} catch (error) {
  console.error(
    "Error parsing or retrieving user data from localStorage:",
    error
  );
}

// autoScroll();

//if someone tries to get unauthorized access


if (localStorage.getItem('lastChat')) {
  enterChat(localStorage.getItem('lastChat'))
}

const searchMessages = document.getElementById('search-msgs')
searchMessages.addEventListener('input', function () {
  if (!searchMessages.value) {
    renderMsgs();
  }else{
    searchMsgs(searchMessages.value);

  }
})