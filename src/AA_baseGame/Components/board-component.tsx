import { GameState, Position, Piece, GameConfig } from '../Logic/types';
import { initializeBoard, getValidMoves, attemptMove } from '../Logic/gameEngine';
import { passagemCLD ,tinyTestConfig } from '../Logic/gameConfig';
import { passagemGPT } from '../Logic/gameConfig2';
import PieceComponent from './piece';
import { useState } from 'react';
import '../style.css'
interface BoardProps {
  gameState?: GameState;
  onGameStateChange?: (newState: GameState) => void;
}

const Board: React.FC<BoardProps> = ({ 
  gameState: externalGameState, 
  onGameStateChange 
}) => {
  const [internalGameState, setInternalGameState] = useState<GameState>(() => 
    initializeBoard(passagemGPT)
  );
  
  const gameState = externalGameState || internalGameState;
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);

  const handleSquareClick = (row: number, col: number) => {
    const clickedPiece = gameState.board[row][col];
    const clickedPosition = { row, col };

    if (selectedSquare) {
      // We have a piece selected
      if (selectedSquare.row === row && selectedSquare.col === col) {
        // Clicked the same square, deselect
        setSelectedSquare(null);
        setValidMoves([]);
        return;
      }

      // Check if this is a valid move
      const isValidMoveTarget = validMoves.some((move: { row: number; col: number; }) => move.row === row && move.col === col);
      
      if (isValidMoveTarget) {
        // Make the move
        const newGameState = { ...gameState };
        const moveSuccessful = attemptMove(newGameState, selectedSquare, clickedPosition);
        
        if (moveSuccessful) {
          // Switch turns
          newGameState.currentPlayer = (newGameState.currentPlayer + 1) % newGameState.players;
          newGameState.turnCount += 1;
          
          // Update state
          if (onGameStateChange) {
            onGameStateChange(newGameState);
          } else {
            setInternalGameState(newGameState);
          }
          
          setSelectedSquare(null);
          setValidMoves([]);
        }
      } else if (clickedPiece && clickedPiece.owner === gameState.currentPlayer) {
        // Clicked on another piece owned by current player, select it instead
        setSelectedSquare(clickedPosition);
        setValidMoves(getValidMoves(gameState, clickedPosition));
      } else {
        // Invalid move, deselect
        setSelectedSquare(null);
        setValidMoves([]);
      }
    } else {
      // No piece selected
      if (clickedPiece && clickedPiece.owner === gameState.currentPlayer) {
        // Select this piece if it belongs to the current player
        setSelectedSquare(clickedPosition);
        setValidMoves(getValidMoves(gameState, clickedPosition));
      }
    }
  };

  const isSquareSelected = (row: number, col: number): boolean => {
    return selectedSquare !== null && selectedSquare.row === row && selectedSquare.col === col;
  };

  const isValidMoveSquare = (row: number, col: number): boolean => {
    return validMoves.some((move: { row: number; col: number; }) => move.row === row && move.col === col);
  };

  const getSquareColor = (row: number, col: number) => {
    return (row + col) % 2 === 0 ? '#f0d9b5' : '#b58863';
  };

  return (
    <div className="game-container" style={{ padding: '20px', textAlign: 'center', }}>
      
      <div style={{ marginBottom: '20px' }}>
        <p>Current Player: 
          <span style={{ 
            fontWeight: 'bold', 
            color: gameState.currentPlayer === 0 ? '#e74c3c' : '#3498db' 
          }}>
            Player {gameState.currentPlayer + 1}
          </span>
        </p>
        <p>Turn: {gameState.turnCount + 1}</p>
      </div>
      
      <div 
        className="boardaa"
        style={{
          position:'relative',
          display: 'inline-grid',
          gridTemplateColumns: `repeat(${gameState.config.boardWidth}, 50px)`,
          gridTemplateRows: `repeat(${gameState.config.boardHeight}, 50px)`,
          gap: '2px',
          border: '4px solid #2c3e50',
          borderRadius: '8px',
          padding: '8px',
          backgroundColor: '#34495e'
        }}
      >
        {gameState.board.map((row: any[], rowIndex: number) =>
          row.map((piece, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="squareaaa"
              style={{
                backgroundColor: getSquareColor(rowIndex, colIndex),
                border: isSquareSelected(rowIndex, colIndex) ? '3px solid #f1c40f' : '1px solid #7f8c8d',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transition: 'all 0.2s ease',
                boxShadow: isValidMoveSquare(rowIndex, colIndex) ? '0 0 10px rgba(46, 204, 113, 0.6)' : 'none'
              }}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
            >
              {piece && (
                <PieceComponent
                  piece={piece}
                  isSelected={isSquareSelected(rowIndex, colIndex)}
                  onPieceClick={() => handleSquareClick(rowIndex, colIndex)}
                />
              )}
              {isValidMoveSquare(rowIndex, colIndex) && !piece && (
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#2ecc71',
                    opacity: 0.7,
                    boxShadow: '0 0 5px rgba(46, 204, 113, 0.8)'
                  }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Board;