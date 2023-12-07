import {
  autoScroll,
  enterChat,
  isChatListClick,
  isUserListClick,
  mapUserList,
  renderChats,
  renderMsgs,
} from "./functions.js";

export const user_list = document.getElementById("user-list");

const searchButton = document.getElementById("find-user");
const searchBox = document.getElementById("search-box");


export var on_chat = document.querySelectorAll("#in-chat");
export var on_chat2 = document.querySelectorAll("#chatlist-username");

// isChatListClick(); //check for chatlist clicks
autoScroll();
if (localStorage.getItem('lastChat')) {
  
  enterChat(localStorage.getItem('lastChat'))
}


searchBox.addEventListener("input", async function () {
  document.querySelector(".user-list-container").classList.add("hidden");

  if (searchBox.value) {
    user_list.innerHTML = "";
    await fetch(
      `https://kgp-connect.onrender.com/api/auth/search?search=${searchBox.value}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then(async(data) => {
        // console.log(data);
        if (data.length) {
          mapUserList(data);

          await isUserListClick();
          isChatListClick();
        } else {
          document
            .querySelector(".user-list-container")
            .classList.remove("hidden");
          user_list.innerHTML =
            "<h1 class='text-center bg-white'> No User Found </h1>";
        }
      });
  }
});

