const users = [];

//join user to chat, USING THIS TO ONLY RETURN MESSAGES TO CERTAIN USERS
function userJoin(id, username, channel) {
    const user = { id, username, channel };

    users.push(user);
    // console.log(users);
    return user;

}


// get current user
function getCurrentUser(id) {
    console.log(users);
    return users.find(user => user.id === id); // user is a json object, user.id is the object inside of json

}

// user leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// get room users
function getRoomUsers(channel) {
    return users.filter(user => user.channel === channel);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};