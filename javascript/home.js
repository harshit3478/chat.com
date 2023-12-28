
import {
  autoScroll,
  enterChat,
  ifBackBtnClicked,
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
import { ifPhone, responsive } from "./responsive.js";

export const field = document.getElementById("input");
export const form = document.getElementById("form");
export var socket = io();
isChatListClick();
switchTheme();

//
try {
  const data = JSON.parse(localStorage.getItem("userData"));
  if (data) {
    await renderChats(data.username)
    let user_name = data.username;
    let user_email = data.email;
    document.getElementById("user-name").innerHTML = user_name;
    document.getElementById("user-email").innerHTML = user_email;

    /* socket.io logic */
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      playAudio();
      if (field.value) {
        socket.emit("sendingMSG",{msg :field.value,sender:user_name,receiver:document.getElementById("inchat-name").innerHTML});
        await updateMsgs(
          user_name,
          document.getElementById("inchat-name").innerHTML,
          field.value
        );
        autoScroll();
       
        const time = new Date();
        const ct = (time.getDate() < 10 ? '0' : '') + time.getDate() + "-" + (time.getMonth() + 1 < 10 ? '0' : '') + (time.getMonth() + 1) + " " + (time.getHours() < 10 ? '0' : '') + time.getHours() + ":" + (time.getMinutes() < 10 ? '0' : '') + time.getMinutes()
        let html = `<div class=" flex flex-col justify-start " style='align-items:end;width:95%' id="msg-sent">  <p class=" block dark:bg-neutral-950 p-1 text-white bg-indigo-400 mx-2 my-1 w-fit rounded-lg px-2 font-semibold text-lg dark:shadow-slate-800 mr-4 shadow-md">${field.value}</p><p class='text-sm text-slate-400 mr-4 shrink-0'>${ct}</p></div>`;
        document.getElementById("scroll-container").innerHTML += html;
        autoScroll();
         field.value = "";
        // setTimeout(() => {
        //   renderChats(user_name);
        // }, 1000);
      }
    });
    isTyping();
    isOnline();
    isOffline();
    //when user-rcv msg
    socket.on(user_name, function (data) {
      // renderMsgs();
      console.log(document.getElementById("inchat-name").innerHTML , data.sender)
      if(document.getElementById("inchat-name").innerHTML === data.sender){

        const time = new Date();
        const ct = (time.getDate() < 10 ? '0' : '') + time.getDate() + "-" + (time.getMonth() + 1 < 10 ? '0' : '') + (time.getMonth() + 1) + " " + (time.getHours() < 10 ? '0' : '') + time.getHours() + ":" + (time.getMinutes() < 10 ? '0' : '') + time.getMinutes()
        let html = `<div class=" flex flex-col justify-start " style='align-items:start;width:95%' id="msg-sent">  <p class=" block dark:bg-neutral-950 p-1 text-white bg-indigo-400 mx-2 my-1 w-fit rounded-lg px-2 font-semibold text-lg dark:shadow-slate-800 mr-4 shadow-md">${data.msg}</p><p class='text-sm text-slate-400 mr-4 shrink-0'>${ct}</p></div>`;
        document.getElementById("scroll-container").innerHTML += html;
        autoScroll();
        setTimeout(() => {
          var audio = new Audio('/rcv.mp3')
          audio.play()
        }, 200);
      }
      setTimeout(() => {
        renderChats(user_name);
      }, 500);
      
    });
  }
} catch (error) {
  console.error(
    "Error parsing or retrieving user data from localStorage:",
    error
  );
}

if (localStorage.getItem('lastChat')) {
  enterChat(localStorage.getItem('lastChat'))
}


ifPhone()



const searchMessages = document.getElementById('search-msgs')
searchMessages.addEventListener('input', function (e) {
  e.preventDefault();
  if (!searchMessages.value) {
    renderMsgs();
  }else{
    searchMsgs(searchMessages.value);

  }
})
ifBackBtnClicked();