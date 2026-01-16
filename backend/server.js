const axios = require('axios');
const express = require('express');
const http = require('http');
const {Server} = require('socket.io');


const app = express();
const server = http.createServer(app)

//from socket io
//telling our server to change http to ws
const io = new Server(server,{
    cors:{
        origin:"*",
    }
});

const rooms = new Map();

io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    let currentRoom = null;
    let currentUser = null;

    socket.on("join",({roomId, userName})=>{

        //if user have current room then
        if(currentRoom){
            //leave user form current room
            socket.leave(currentRoom);
            //remove user from that room
            socket.get(currentRoom).delete(currentRoom);
            // and finally add him to new room and notify other 
            io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom)));
        }

        //if user is not joined then

        currentRoom = roomId;
        currentUser = userName;

        socket.join(roomId);

        //if room already exist then join him in
        if(!rooms.has(roomId)){
            rooms.set(roomId,new Set());
        }

        //if room not exist then create it
        rooms.get(roomId).add(userName);

        // and again notify other
        io.to(roomId).emit("userJoined", Array.from(rooms.get(currentRoom)));

        // console.log("user joined room", roomId);
    });
    
    //Code change from server
    socket.on("codeChange",({roomId, code})=>{
        socket.to(roomId).emit("codeUpdate", code);
    });

    //typing indicator
    socket.on("typing",({roomId, userName})=>{
        socket.to(roomId).emit("userTyping", userName);
    })

    //to change language
    socket.on("languageChange", ({roomId, language})=>{
        io.to(roomId).emit("languageUpdate", language);
    })

    // Compile Code 
    socket.on("compileCode", async ({ code, roomId, language, version }) => {
      if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        try {
          const response = await axios.post(
            "https://emkc.org/api/v2/piston/execute",
            {
              language,
              version,
              files: [
                {
                  content: code,
                },
              ],
            }
          );

          room.output = response.data.run.output;
          io.to(roomId).emit("codeResponse", response.data);
        } catch (error) {
            console.error("Error executing code:", error.response?.data || error.message);
          
            io.to(roomId).emit("codeResponse", {
              run: {
                output: error.response?.data?.message || "Error executing code"
              }
            });
          }
      }
    });

    //to leave user  when click on leave button (same code as belowe "disconnect")
    socket.on('leaveRoom',()=>{
        if(currentRoom && currentUser){
            rooms.get(currentRoom).delete(currentUser);
            io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom)));
        }
        console.log("User left the room.");

        socket.leave(currentRoom);

        currentRoom=null;
        currentUser=null;
    })

    //to remove user if refresh page
    socket.on("disconnect", ()=>{
        if(currentRoom && currentUser){
            rooms.get(currentRoom).delete(currentUser);
            io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom)));
        }
        console.log("User Disconnected");
    })

});

app.get('/', (req, res) => {
    res.send('Hello World');
});

const PORT =  9000;

server.listen(PORT, () => {
    console.log(`Server is running on port PORT ${PORT}`);
});
