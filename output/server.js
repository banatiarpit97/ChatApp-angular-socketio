const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT||3000;
const app = express();
let server = http.createServer(app);
let io = socketIO(server);

let socketIdMap = new Map();

app.use("/", express.static(path.join(__dirname, "angular")));

let pairedUsers = [];
let unpairedUsers = [];

class User{
    constructor(socket, name, gender, interested, image, description){
        this.socket = socket;
        this.name = name;
        this.gender = gender;
        this.interested = interested;
        this.image = image;
        this.description = description;
    }

    sendPartnerInformation(partner, status) {
        if (!status) {
            this.socket.emit('partner-information', JSON.stringify({ status }));
        }
        else {
            this.socket.emit("partner-information", JSON.stringify({
                status,
                name: partner.name,
                gender: partner.gender,
                interested: partner.interested,
                image: partner.image,
                description: partner.description,
            }));
        }
    }

    sendMessage(msg) {
        this.socket.emit('message', msg);
    }
}

class ChatRoom{
    constructor(){
        this.firstUser = null;
        this.secondUser = null;
        this.messages = [];
    }

    addUser(user){
        if (!this.firstUser) {
            this.firstUser = user;
            unpairedUsers.push(this);
            this.firstUser.sendPartnerInformation(null, false)
        }
        else if (!this.secondUser) {
            this.secondUser = user;
            this.firstUser.sendPartnerInformation(this.secondUser, true);
            this.secondUser.sendPartnerInformation(this.firstUser, true);
            unpairedUsers.splice(unpairedUsers.indexOf(this), 1);
            pairedUsers.push(this);
        }
        socketIdMap[user.socket.id] = this;
        console.log(socketIdMap);
    }

    deleteUser(socketId){
        if (!this) {
            return;
        }
        if (this.firstUser.socket.id == socketId) {
            if (!this.secondUser) {
                removeFromUsersArray(unpairedUsers, this);
            }
            else if (this.secondUser) {
                this.firstUser = this.secondUser;
                this.secondUser = null;
                removeFromUsersArray(pairedUsers, this);
                unpairedUsers.push(this);
            }
        }
        else if (this.secondUser.socket.id == socketId) {
            this.secondUser = null;
            removeFromUsersArray(pairedUsers, this);
            unpairedUsers.push(this);
        }
        if (this.firstUser) {
            this.firstUser.sendPartnerInformation(null, false)
        }
    }
    
    storeMessage(msg){
        this.messages.push(msg);
        if(msg.from == this.firstUser.socket.id){
            msg.from = 'me';
            this.firstUser.sendMessage(msg);
            msg.from = this.firstUser.socket.name;
            this.secondUser.sendMessage(msg);
        }
        else{
            msg.from = 'me';
            this.secondUser.sendMessage(msg);
            msg.from = this.secondUser.socket.name;
            this.firstUser.sendMessage(msg);            
        }
    }
}

io.on('connection', (socket) => {
    socket.emit('connection-sucessful', socket.id);     

    socket.on('credentials', (credentials) => {
        credentials = JSON.parse(credentials)
        socket.name = credentials.name;
        let user = new User(socket, credentials.name,
            credentials.gender, 
            credentials.interested, 
            credentials.image, 
            credentials.description);
        let availableSlot = findEmptySlot(credentials);
        availableSlot.addUser(user);
    })

    socket.on('message', (data) => {
        data = JSON.parse(data);
        data.from = socket.id;
        socketIdMap[socket.id].storeMessage(data);
    })
    
    socket.on('disconnect', () => {
        socketIdMap[socket.id].deleteUser(socket.id);
        delete socketIdMap[socket.id];  
    })  
})

function findEmptySlot(credentials){
    for(let chatRoom of unpairedUsers){
        for (let user in chatRoom) {
            if (chatRoom[user] && chatRoom[user].gender == credentials.interested) {
                if (chatRoom[user].interested == credentials.gender){
                    return chatRoom;
                }
            }
        }
    }
    return new ChatRoom();
}

function removeFromUsersArray(array, chatRoom){
    for(let i=0;i<array.length;i++){
        if(array[i] == chatRoom){
            array.splice(i, 1);
        }
    }
}

app.use((req, res) => {
    res.sendFile(path.join(__dirname, "angular", "index.html"))
});

server.listen(port, () => {
    console.log(`listening on port ${port}`);
})