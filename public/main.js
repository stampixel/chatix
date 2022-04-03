// Check if username is already taken
// Create a list of color codes at the begining 


function Username() {
  var username = window.prompt("Enter your username:", "");
  
  if (username.toString().length > 1) {
    localStorage.setItem("username", username);
  }
  else {
    alert("Your username must be at least two characters.");
    Username();
  }
}
Username();



const sendBtn = document.querySelector('#send');
const chatbox = document.querySelector('#chat');
const messageBox = document.querySelector('#messageBox');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');



const colorList = ["F903E6", "0321F9", "FF0000", '46FF00', '00FFE0', 'F7FF00', '000000'];
const random = Math.floor(Math.random() * colorList.length); // gets a random color from the list
const channel = window.location.search.replace(/^\?/, ''); // Thanks to hack.chat for this line
const username = localStorage.getItem("username");


console.log(username, channel);

const socket = io();

function init() {
  socket.emit('joinRoom', { username, channel });

  // get room n users
  socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });

  socket.on("connect", () => {
    console.log("connected");
  });

  socket.on('message', message => {
    outputMessage(message);
    window.scrollTo(0, document.body.scrollHeight);
  });
};

// sendBtn.onclick = function() {
//   // if (!io) {
//   //   console.log("connction failed");
//   //   return;
//   // }
//   var message = messageBox.value;
//   if (message.length > 500) {
//     alert("Your message is above 500 characters")
//   } else {
//     if (message.toString().length) {
//       socket.emit('chatMessage', message);
//       messageBox.value = '';
//     }
//     messageBox.focus();

//   }
// }

$('#messageBox').on('keyup', function (e) {
  console.log("working");
  if (e.key === 'Enter' || e.keyCode === 13) {
    var message = messageBox.value;

    if (message.length > 500) {
      alert("Your message is above 500 characters")
    } else {
      if (message.toString().length) {
        socket.emit('chatMessage', message);
        messageBox.value = '';
      }
      messageBox.focus();
    }
  }
});

//output msg to dom
function outputMessage(message) {
  const div = document.createElement('div');
  const { username, text, time } = message; // ADD THE COLOR THING HERE SO EVERY USER WILL HAVE A FIXED COLOR 

  div.classList.add('message');
  // div.innerHTML = `<p class="meta">${username} <span>${time}</span></p>
  // <p class="text">
  //   ${text}
  // </p>`;
  div.innerHTML = `<span class="username"><a>${username}</a></span>
  <p class="text">
    <span>${text}</span>
  </p>`;
  
  console.log(message);
  document.querySelector('.chat-messages').appendChild(div);
}

// add room name to dom
function outputRoomName(room) { // COMPLETE LATER, NOT USED RN
  roomName.innerText = room;
  
}

// add users to dom

function outputUsers(users) {
  userList.innerHTML = `
   ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;

}

init();
