const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.use(express.static(path.join(__dirname, "public"))); // use this so we can connect to localhost:3000



io.on('connection', socket => { // socket is for ONLY sending messages to current socket
    socket.on('joinRoom', ({ username, channel }) => {
        const user = userJoin(socket.id, username, channel);
        // const { socket_id, username, channel} = user; USER THIS LINE SO WE CAN REPLACE "USER."

        socket.join(user.channel); // basically makes "socket" the id of the channel
        
        const users = getRoomUsers(user.channel);
        socket.emit('message', formatMessage('*', `Welcome, users online: ${users.map(user => user.username).join(', ')}`));

        // broadcast when user connects
        socket.broadcast.to(user.channel).emit('message', formatMessage('*', `${user.username} joined`));  

        io.to(user.channel).emit('roomUsers', {
            room: user.channel,
            users: getRoomUsers(user.channel)
        });

    });
    // listen for chat message
    socket.on('chatMessage', (message) => {
        const user = getCurrentUser(socket.id);
        io.to(user.channel).emit('message', formatMessage(user.username, message));
    })

    //broadcast when disconnectt
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.channel).emit('message', formatMessage('*', `${user.username} left`));
            io.to(user.channel).emit('roomUsers', {
                room: user.channel,
                users: getRoomUsers(user.channel)
            });

        }
    });
    
})
const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));