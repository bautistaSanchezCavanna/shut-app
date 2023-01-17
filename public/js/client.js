const getHtml = (template) => template.join("\n");

const renderMeMessage = (message) => {
  const html = getHtml([
    '<div class="app-chat__messages-me">',
    '<div class="app-chat__messages-me-box">',
    '<span class="app-chat__messages-me-box--name">Yo</span>',
    `<span class="app-chat__messages-me-box--text">${message}</span>`,
    ,
    "</div>",
    "</div>",
  ]);
  return html;
};

const renderUserMessage = (username, message) => {
  const html = getHtml([
    '<div class="app-chat__messages-user">',
    '<div class="app-chat__messages-user-box">',
    `<span class="app-chat__messages-user-box--name">${username}</span>`,
    `<span class="app-chat__messages-user-box--text">${message}</span>`,
    ,
    "</div>",
    "</div>",
  ]);
  return html;
};

const socket = io();
let user;

const chatBox = document.getElementById("chat-box");
const messagesBox = document.getElementById("messages-box");

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 7000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

Swal.fire({
  title: "Identify yourself",
  input: "text",
  text: "Enter your username to log in to the chat",
  inputValidator: (value) => {
    return !value && "You must type a username to continue";
  },
  allowOutsideClick: false,
  allowEscapeKey: false,
  padding: "16px",
}).then((result) => {
  user = result.value;
  socket.emit("login", user);
});

chatBox?.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    if (chatBox.value.trim().length) {
      socket.emit("message", { user: user, message: chatBox.value });
      chatBox.value = "";
    }
  }
});

socket.on("new-user", (user)=>{
    Toast.fire({
        icon: 'info',
        title: `${user} is online!`
    });
});

socket.on("message-logs", (data) => {
  const html = getHtml(
    data.map((item) => {
      if (item.user === user) {
        return renderMeMessage(item.message);
      } else {
        return renderUserMessage(item.user, item.message);
      }
    })
  );
  messagesBox.innerHTML = html;
});
