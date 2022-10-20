const users = [];

//addUser , removeUser , getUser , getUserInRoom

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase();

    //validation data
    if (!username || !room) {
        return {
            error: 'UserName and Room required'
        }
    }


    //check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    });

    //validate user
    if (existingUser) {
        return {
            error: 'userName is in use'
        }
    }
    //store user
    const user = { id, username, room }
    users.push(user)
    return { user }

}

//remove user
const removeUser = (id) => {
    const index = users.findIndex((user) => { return user.id === id });
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}
//find user
const getUser = (id) => {
   return users.find((user) => user.id === id);
  
}
//find user in a room 
const getUserInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter((user) => user.room === room);
    
}

module.exports ={
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}