import express from 'express'
import http from 'node:http'
import { Server } from 'socket.io';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const PORT = 4000

const app= express();
const server = http.createServer(app)
const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req,res)=>{
    res.setHeader('Content-Type','application/json')
    res.statusCode = 200
    res.end("Hello from the ws server")
})

// const server = http.createServer(async (req,res)=>{
//     res.setHeader('Content-Type','application/json')
//     res.statusCode = 200
//     res.end("Hello from the ws server")
// })

server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})