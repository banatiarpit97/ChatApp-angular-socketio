const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT||3000;
const app = express();
let server = http.createServer(app);
let io = socketIO(server);

let users = [];
io.on('connection', (socket) => {
    console.log('New user connected', socket.id);
    socket.broadcast.emit('message', {from:'admin', text:`${socket.id} joined`})
    socket.emit('connection-sucessful', socket.id);
    users.push(socket.id);
    console.log(users.length);
    socket.on('message', (data) => {
        console.log(data);
        data = JSON.parse(data);
        data.from = socket.id;
        data.to = 'all';
        io.emit('message', data)        
    })
    
    socket.on('disconnect', () => {
        console.log('User disconnected');
        users = users.filter((user) => {
            return user !== socket.id; 
        })
        
    })
})

function generateMessage(from, to, text, date){
    console.log({ from, to, text, date })
    return {from, to, text, date}
}









server.listen(port, () => {
    console.log(`listening on port ${port}`);
})