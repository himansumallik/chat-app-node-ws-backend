import express from 'express'
import http from 'node:http'
import { Server } from 'socket.io';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const PORT = 7000

const app= express();
const server = http.createServer(app)
const __dirname = dirname(fileURLToPath(import.meta.url));
const io = new Server(server)

app.get('/', (req,res)=>{
    res.sendFile(join(__dirname, 'public','index.html'));
})

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on('chat-message', (msg)=>{
        console.log("Message from frontend: ", msg)
    })
    socket.on('disconnect', () =>{
        console.log('a user disconnected', socket.id)
    })

});



// const server = http.createServer(async (req,res)=>{
//     res.setHeader('Content-Type','application/json')
//     res.statusCode = 200
//     res.end("Hello from the ws server")
// })

server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})