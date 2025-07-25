import http from 'node:http'
import ws from 'ws'

const PORT = 8000

const server = http.createServer(async (req,res)=>{
    res.setHeader('Content-Type','application/json')
    res.statusCode = 200
    res.end("Hello from the ws server")
})

server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})