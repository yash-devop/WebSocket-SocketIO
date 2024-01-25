import express from "express"
import {Server} from 'socket.io'
const app = express();
const PORT = 8000
import {writeFile} from 'fs'
import path from "path";
import { fileURLToPath  } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
//1
app.use(express.static(path.join(__dirname , "public")));

const expressServer = app.listen(PORT , ()=>{
    console.log(`Server Started on ${PORT} successfully !`);
});

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname , "public" , "index.html"))
})


// 2
const io = new Server(expressServer , {
    cors : {
        origin : ["*"],
        // origin : ["http://localhost:3000" , "localhost:3000" , "https://5236-103-26-226-37.ngrok-free.app"],
        credentials: true
    }
})

// 3

io.on("connection",(socket)=>{
    console.log(`User with ${socket.id} has joined !`);

    socket.emit("joined-status","Welcome Everyone !")

    // G
    socket.on("message", ({room , message , id , user})=>{
        console.log("room aya" , room);
        // socket.in(room).emit("message" ,  message)
        io.in(room).emit("message" ,  {id , message , user})
        // io.emit("message" , message)
    })
    socket.on("join-room", ({room , user , id})=>{
        socket.join(room);
        socket.emit("joined-status" , `You have joined ${room} !`)
        socket.to(room).emit("joined-status" , `${user} has joined ${room} !`)
        socket.emit("room-name" , room);
    })

    socket.on("disconnect" , (s)=>{
        console.log(s);
    })
})