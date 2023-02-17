var socket = io.connect();

//prompt to ask user's name an room name
const username = prompt("Welcome! Please enter your name:");
const roomname = prompt("Welcome! Please enter Your chat room name:");

// emit event to server with the user's name and room name
socket.emit("new-connection", { username, roomname });

// welcome-message event from the server
socket.on("welcome-message", async (data) => {
  await addMessage(data, false);
  //get unread msgs when user enter the chat,after that chat will deleted from database
  await getUnreadMsg(data);
});

// receives two params, the message and if it was sent by yourself
// so we can style them differently
let addMessage = async (data, isSelf = false) => {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");

  if (isSelf) {
    messageElement.classList.add("self-message");
    messageElement.innerText = `${data.message} \n  
    ${moment(data.date_time).format('DD MMM YYYY, hh:mm a')}`;
  } else {
    if (data.user === "server") {
      messageElement.innerText = `${data.message} \n 
      ${moment(data.date_time).format('DD MMM YYYY')} `;
    } else {
      // message is from other user
      messageElement.classList.add("others-message");
      messageElement.innerText = `${data.user} \n ${data.message} \n 
      ${moment(data.date_time).format('DD MMM YYYY, hh:mm a')} `;
    }
  }
  const chatContainer = document.getElementById("chatContainer");
  chatContainer.append(messageElement);
};

const messageForm = document.getElementById("messageForm");
messageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const messageInput = document.getElementById("messageInput");
  if (messageInput.value !== "") {
    let newMessage = messageInput.value;
    let mdata = {
      room_name: roomname,
      sender_name: username,
      msg: newMessage,
    };
    //save chat to database
    let resp = await saveChat(mdata);
    let chatid = "";
    if (resp) {
      chatid = resp.chat_id;
    }
    //sends message and our id to socket server
    socket.emit("new-message", {
      user: socket.id,
      message: newMessage,
      chatid: chatid,
    });
    // appends message in chat container
    await addMessage({ message: newMessage }, true);
    messageInput.value = "";
  } else {
    messageInput.classList.add("error");
  }
});

socket.on("broadcast-message", async (data) => {
  await addMessage(data, false);
});

const saveChat = async (data) => {
  let resp = await axios
    .post("/api/v1/chat/save_chat_msg", data)
    .then(function (response) {
      console.log(response);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
};

const getUnreadMsg = async (data) => {
  let resp = await axios.get(`/api/v1/chat/get_chat_by_id/${data.roomname}`);
  if (resp.data.length != 0) {
    await loadUnreadmsg(resp.data);
  }
};

const loadUnreadmsg = async (msgs) => {
  for (let x = 0; x < msgs.length; x++) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.classList.add("others-message");
    messageElement.innerText += `${msgs[x].sender_name} \n ${msgs[x].msg}\n
    ${moment(msgs[x].date_time).format('DD MMM YYYY, hh:mm a')} `;
    const chatContainer = document.getElementById("chatContainer");
    chatContainer.append(messageElement);

    await deleteReadedChat(msgs[x]);
  }
};

const deleteReadedChat = async (msg) => {
  let resp = await axios.put(`/api/v1/chat/delete_chat_by_id/${msg._id}`);
  if (resp) {
    console.log(resp);
  }
};
