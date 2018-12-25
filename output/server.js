const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT||3000;
const app = express();
let server = http.createServer(app);
let io = socketIO(server);

let users = [];
let pairedUsers = [];
let unpairedUsers = [];
class ChatRoom{
    constructor(){
        this.firstUser = null;
        this.secondUser = null;
        this.messages = [];
    }
    addUser(credentials, socket){
        let availableSlot;
        if (!this.firstUser) {
            availableSlot = "firstUser";
        }
        else if (!this.secondUser) {
            availableSlot = "secondUser";
        }
        socket.name = credentials.name;
        this[availableSlot] = {};
        this[availableSlot].socket = socket;
        this[availableSlot].name = credentials.name;
        this[availableSlot].gender = credentials.gender;
        this[availableSlot].interested = credentials.interested;
        this[availableSlot].image = credentials.image;
        this[availableSlot].description = credentials.description;
        if (availableSlot == "firstUser") {
            unpairedUsers.push(this);
            this.firstUser.socket.emit("partner-information", JSON.stringify({ 
                status:false,    
            }));
        }
        else if (availableSlot == "secondUser") {
            this.firstUser.socket.emit("partner-information", JSON.stringify({
                status: true,                
                name: this.secondUser.name,
                gender: this.secondUser.gender,
                interested: this.secondUser.interested,
                image: this.secondUser.image,
                description: this.secondUser.description,
            }));
            this.secondUser.socket.emit("partner-information", JSON.stringify({
                status: true,
                name: this.firstUser.name,
                gender: this.firstUser.gender,
                interested: this.firstUser.interested,
                image: this.firstUser.image,
                description: this.firstUser.description,
            }));
            unpairedUsers.splice(unpairedUsers.indexOf(this), 1);
            pairedUsers.push(this);
        }
        console.log(pairedUsers)
        console.log(unpairedUsers)
        // console.log(this)
    }
    storeMessage(msg){
        this.messages.push(msg);
        if(msg.from == this.firstUser.socket.id){
            msg.from = 'me';
            this.sendMessage(msg, this.firstUser.socket);
            msg.from = this.firstUser.socket.name;
            this.sendMessage(msg, this.secondUser.socket);
        }
        else{
            msg.from = 'me';
            this.sendMessage(msg, this.secondUser.socket);
            msg.from = this.secondUser.socket.name;
            this.sendMessage(msg, this.firstUser.socket);            
        }
        console.log(pairedUsers)
        console.log(unpairedUsers)
    }
    sendMessage(msg, socket){
        // if(socket){
            socket.emit('message', msg);
        // }
    }
}
// let user = new ChatRoom();
// unpairedUsers.push(new ChatRoom())
io.on('connection', (socket) => {
    console.log('New user connected', socket.id);
    // if(user.firstUser.socket && user.secondUser.socket){
    //     console.log('full')
    //     user = new ChatRoom();
    // }
    // socket.broadcast.emit('message', {from:'admin', text:`${socket.id} joined`})    
    //sends to all except sender

    socket.emit('connection-sucessful', socket.id);     
    //sends to particular id/device

    socket.on('credentials', (credentials) => {
        credentials = JSON.parse(credentials)
        console.log(credentials);
        // let availableSlot;
        // if(!user.firstUser.socket){
        //     availableSlot = "firstUser";
        // }
        // else if (!user.secondUser.id) {
        //     availableSlot = "secondUser";
        // }
        // socket.name = credentials.name;
        // user[availableSlot].socket = socket;
        // user[availableSlot].fistname = credentials.name;
        // user[availableSlot].gender = credentials.gender; 
        // if (availableSlot == "secondUser"){
        //     pairedUsers.push(user);
        // }
        let availableSlot = findEmptySlot(credentials);
        availableSlot.addUser(credentials, socket);
        // if (user.firstUser.socket && user.secondUser.socket) {
        //     console.log('full')
        //     user = new ChatRoom();
        // }
        // else{

        // }
        // user.addUser(credentials, socket);
    })

    users.push(socket.id);
    socket.on('message', (data) => {
        data = JSON.parse(data);
        data.from = socket.id;
        data.to = 'all';
        // console.log('aa', pairedUsers)
        pairedUsers.forEach(chatRoom => {
            for(let user in chatRoom){
                // console.log(chatRoom[user].socket.id, socket.id)
                if (chatRoom[user].socket && chatRoom[user].socket.id == socket.id){
                    // console.log('aa')
                    chatRoom.storeMessage(data);
                    break;
                }
            }
            console.log(pairedUsers)
        });
        // io.emit('message', data);       //sends to all      
    })
    
    socket.on('disconnect', () => {
        console.log('User disconnected');
        // console.log(socket)
        deleteUser(socket);
        console.log(pairedUsers)
        console.log(unpairedUsers)
    })  
})

function findEmptySlot(credentials){
    for(let chatRoom of unpairedUsers){
        for (let user in chatRoom) {
            if (chatRoom[user] && chatRoom[user].gender && chatRoom[user].gender == credentials.interested) {
                if (chatRoom[user].interested == credentials.gender){
                    return chatRoom;
                }
            }
        }
    }
    return new ChatRoom();
}

function deleteUser(socket){
        let index;
        for (let i = 0; i < pairedUsers.length; i++) {
            console.log(pairedUsers[i].firstUser.socket.id)
            console.log(pairedUsers[i].secondUser.socket.id)
            console.log(socket.id)

            if (pairedUsers[i].firstUser.socket.id == socket.id) {
                index = i;
                pairedUsers[i].firstUser = pairedUsers[i].secondUser;
                break;
            }
            else if (pairedUsers[i].secondUser.socket.id == socket.id) {
                index = i;
                break;
            }
        }
        if (index >= 0) {
        pairedUsers[index].firstUser.socket.emit('partner-information', JSON.stringify({status: false}));
            pairedUsers[index].secondUser = null;
            unpairedUsers.push(pairedUsers[index]);
            pairedUsers.splice(index, 1);
            return;
        }
        for (let i = 0; i < unpairedUsers.length; i++) {
            if (unpairedUsers[i].firstUser.socket.id == socket.id) {
                index = i;
                break;
            }
        }
        if (index >= 0) {
            unpairedUsers[index].firstUser = null;
            unpairedUsers.splice(index, 1);
            return;
        }
}

function generateMessage(from, to, text, date){
    console.log({ from, to, text, date })
    return {from, to, text, date}
}









server.listen(port, () => {
    console.log(`listening on port ${port}`);
})