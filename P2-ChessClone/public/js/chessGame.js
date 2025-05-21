const socket = io();

// various variables to be used in the game

const chess = new Chess();
const boardElement = document.querySelector('.chessBoard'); 

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

// various event listeners / functions to be used in the game

const renderBoard = () => {
    boardElement.innerHTML = chess.ascii();
};

const handleMove = () =>{

}

const getPieceUniCode = (piece) => {
    const pieceUnicode = {
        'p': '♟',
        'r': '♜',
        'n': '♞',
        'b': '♝',
        'q': '♛',
        'k': '♚',
        'P': '♙',
        'R': '♖',
        'N': '♘',
        'B': '♗',
        'Q': '♕',
        'K': '♔'
    };
    return pieceUnicode[piece];
}


// socket.emit("creatine"); //creatine named event is based and built upon frontend and will be sent from here to the backend
// socket.on('creatine and protein', function(){
//     console.log('creatine and protein');
// }); 

