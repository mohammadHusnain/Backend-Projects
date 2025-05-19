const express = require('express');
const socket = require('socket.io');
const http = require('http');
const { Chess } = require('chess.js');
const path = require('path');
const { title } = require('process');

const app = express();
const server = http.createServer(app);
const io = socket(server);
const chess = new Chess();
let players = {};
let currentPlayer = 'white';

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.render('index' , {title: 'Chess Game'});
});

io.on('connection', function(uniqueSocket){
console.log('new connection setted up');

// setting up the game state for players

if (!players.white) {
    players.white = uniqueSocket.id;
    uniqueSocket.emit('playerRole', 'white'); 
}

else if (!players.black) {
    players.black = uniqueSocket.id;
    uniqueSocket.emit('playerRole', 'black');
} else {
    uniqueSocket.emit('spectatorRole');
    return;
}

// game state if a player leaves the game

uniqueSocket.on('disconnect', function(){
    if (uniqueSocket.id === players.white) {
        delete players.white;
    } 
    else if (uniqueSocket.id === players.black) {
        delete players.black;
    }
});

// game state if a player makes a move and if move is valid or not

try {
    


// data received from frontend

// uniqueSocket.on("creatine", function(){  
// io.emit("creatine and protein")
// });

// uniqueSocket.on('disconnect' , function(){
//     console.log('user disconnected');   
// });

});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});