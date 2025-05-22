 const socket = io();

// various variables to be used in the game

const chess = new Chess();
const boardElement = document.querySelector('.chessBoard'); 

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

// various event listeners / functions to be used in the game

const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML = "";

    board.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {
            console.log(square);
  const squareElement = document.createElement('div');
  squareElement.classList.add('square' , (rowIndex + squareIndex) % 2 === 0 ? 'light' : 'dark');

    squareElement.dataset.row = rowIndex;
    squareElement.dataset.col = squareIndex;

    if (square) {
        const pieceElement = document.createElement('div');
        pieceElement.classList.add('piece' , square.color === 'w' ? 'white' : 'black');    
        pieceElement.innertext = getPieceUniCode(square);
        pieceElement.draggable = playerRole === square.color;

        pieceElement.addEventListener('dragstart', (e) => {

            if(pieceElement.draggable){
                draggedPiece = pieceElement;
                sourceSquare = {row: rowIndex, col: squareIndex}; 
                e.dataTransfer.setData('text/plain', "");
            }
        });
pieceElement.addEventListener('dragend', (e) => {
            draggedPiece = null;
            sourceSquare = null;
        });

        squareElement.appendChild(pieceElement);

        pieceElement.innerHTML = getPieceUniCode(square);
        squareElement.appendChild(pieceElement);
    }

    squareElement.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

squareElement.addEventListener('drop', (e) => {
        e.preventDefault(); 
        if(draggedPiece){
            const targetSource = 
            {row: parseInt(squareElement.dataset.row),
                 col: parseInt(squareElement.dataset.col)
                };
                handleMove( sourceSquare, targetSource);
        }    
        });
        boardElement.appendChild(squareElement);
    });
    });
    if (playerRole === 'black') {
        boardElement.classList.add('flipped');
    }
    else {
        boardElement.classList.remove('flipped');
    }
};

const handleMove = (source , target) => {
const move = {
    from: `${String.fromCharCode(97+source.col)}${8-source.row}`,
    to: `${String.fromCharCode(97+target.col)}${8-target.row}`,
    promotion: 'q'
}
socket.emit('makeMove', move);
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
    return pieceUnicode[piece.type] || '';
}

socket.on('playerRole', (role) => {
    playerRole = role;
renderBoard();
});

socket.on('spectatorRole', () => {
    playerRole = null;
    renderBoard();
});

socket.on('boardState',  (fen) => {
    chess.load(fen);
    renderBoard();
});

socket.on('move', (move) => {
    chess.move(move);
    renderBoard();
});

renderBoard();


// socket.emit("creatine"); //creatine named event is based and built upon frontend and will be sent from here to the backend
// socket.on('creatine and protein', function(){
//     console.log('creatine and protein');
// });