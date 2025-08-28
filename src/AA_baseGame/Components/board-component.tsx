import React, { useState, useEffect } from 'react';
import { GameState, Position, Piece, TurnAction, GameConfig, GameRules } from '../Logic/types';
import { GameEngine } from '../Logic/gameEngine';
import PieceComponent from './piece';
import { passagemRules } from '../Logic/gameRules';
import { passagemConfig } from '../Logic/gameConfig';
import '../style.css';

interface BoardProps {
  gameConfig: GameConfig;
  gameRules: GameRules;
  gameState?: GameState;
  onGameStateChange?: (newState: GameState) => void;
}

const Board: React.FC<BoardProps> = ({ 
  gameConfig,
  gameRules,
  gameState: externalGameState, 
  onGameStateChange 
}) => {
  const engine = new GameEngine();
  const [internalGameState, setInternalGameState] = useState<GameState>(() => 
    engine.initializeGame(gameConfig, gameRules)
  );
  
  const gameState = externalGameState || internalGameState;
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [availableActions, setAvailableActions] = useState<TurnAction[]>([]);
  const [highlightedSquares, setHighlightedSquares] = useState<Position[]>([]);

  // Update available actions when selection changes or game state changes
  useEffect(() => {
    if (selectedSquare) {
      const actions = engine.getAvailableActions(gameState, gameRules, selectedSquare);
      setAvailableActions(actions);
      
      // Create highlight squares for valid moves
      const highlights: Position[] = [];
      actions.forEach(action => {
        if (action.to) {
          highlights.push(action.to);
        }
      });
      setHighlightedSquares(highlights);
    } else {
      const allActions = engine.getAvailableActions(gameState, gameRules);
      setAvailableActions(allActions);
      setHighlightedSquares([]);
    }
  }, [selectedSquare, gameState]);

  const handleSquareClick = (row: number, col: number) => {
    const clickedPosition = { row, col };
    const clickedPiece = gameState.board[row][col];

    if (gameState.gamePhase === "ended") {
      return; // Game is over, no more moves
    }

    if (selectedSquare) {
      // We have a piece selected
      if (selectedSquare.row === row && selectedSquare.col === col) {
        // Clicked the same square, deselect
        setSelectedSquare(null);
        return;
      }

      // Check if this is a valid move destination
      const validAction = availableActions.find(action => 
        action.to?.row === row && action.to?.col === col
      );
      
      if (validAction) {
        // Execute the action
        const success = engine.executeAction(gameState, validAction, gameRules);
        
        if (success) {
          // Update state
          if (onGameStateChange) {
            onGameStateChange(gameState);
          } else {
            setInternalGameState({...gameState});
          }
          
          setSelectedSquare(null);
        }
      } else if (clickedPiece && clickedPiece.owner === gameState.currentPlayer) {
        // Clicked on another piece owned by current player, select it instead
        setSelectedSquare(clickedPosition);
      } else {
        // Check if we can place something here (like barriers)
        const placeAction = availableActions.find(action => 
          action.type === "place" && action.to?.row === row && action.to?.col === col
        );
        
        if (placeAction) {
          const success = engine.executeAction(gameState, placeAction, gameRules);
          
          if (success) {
            if (onGameStateChange) {
              onGameStateChange(gameState);
            } else {
              setInternalGameState({...gameState});
            }
          }
        }
        
        // Deselect
        setSelectedSquare(null);
      }
    } else {
      // No piece selected
      if (clickedPiece && clickedPiece.owner === gameState.currentPlayer) {
        // Select this piece if it belongs to the current player
        setSelectedSquare(clickedPosition);
      } else if (!clickedPiece) {
        // Check if we can place something here
        const placeAction = availableActions.find(action => 
          action.type === "place" && action.to?.row === row && action.to?.col === col
        );
        
        if (placeAction) {
          const success = engine.executeAction(gameState, placeAction, gameRules);
          
          if (success) {
            if (onGameStateChange) {
              onGameStateChange(gameState);
            } else {
              setInternalGameState({...gameState});
            }
          }
        }
      }
    }
  };

  const handleSpecialAction = (actionType: string) => {
    const specialAction = availableActions.find(action => action.type === actionType);
    
    if (specialAction) {
      const success = engine.executeAction(gameState, specialAction, gameRules);
      
      if (success) {
        if (onGameStateChange) {
          onGameStateChange(gameState);
        } else {
          setInternalGameState({...gameState});
        }
        setSelectedSquare(null);
      }
    }
  };

  const isSquareSelected = (row: number, col: number): boolean => {
    return selectedSquare !== null && selectedSquare.row === row && selectedSquare.col === col;
  };

  const isSquareHighlighted = (row: number, col: number): boolean => {
    return highlightedSquares.some(pos => pos.row === row && pos.col === col);
  };

  const canPlaceHere = (row: number, col: number): boolean => {
    return availableActions.some(action => 
      action.type === "place" && action.to?.row === row && action.to?.col === col
    );
  };

  const getSquareColor = (row: number, col: number) => {
    return (row + col) % 2 === 0 ? '#f0d9b5' : '#b58863';
  };

  const currentPlayerName = `Player ${gameState.currentPlayer + 1}`;
  const winResult = gameRules.checkWinCondition(gameState);

  // Get player data for display
  const currentPlayerData = gameState.playerData?.[gameState.currentPlayer] || {};
  const barriersLeft = currentPlayerData.barriersLeft || 0;

  return (
    <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>
      
      {/* Game Info */}
      <div style={{ marginBottom: '20px' }}>
        <h2>{gameState.config.name}</h2>
        <p>Current Player: 
          <span style={{ 
            fontWeight: 'bold', 
            color: gameState.currentPlayer === 0 ? '#e74c3c' : '#3498db' 
          }}>
            {currentPlayerName}
          </span>
        </p>
        <p>Turn: {gameState.turnCount + 1}</p>
        
        {/* Show remaining moves if applicable */}
        <p>Moves Left: {gameState.remainingMoves}</p>
        
        {barriersLeft > 0 && (
          <p>Barriers Available: {barriersLeft}</p>
        )}
        
        {/* Show dice roll if stored in gameData */}
        {gameState.gameData?.diceRoll && (
          <p>Dice Roll: {Array.isArray(gameState.gameData.diceRoll) ? 
            gameState.gameData.diceRoll.join(', ') : gameState.gameData.diceRoll}</p>
        )}

        {/* Score Display */}
        <div style={{ margin: '10px 0' }}>
          {gameState.gameData?.capturedPieces && (
            <p>Captures: 
              {Array.from({length: gameState.players}, (_, i) => (
                <span key={i} style={{ margin: '0 10px' }}>
                  Player {i + 1}: {gameState.gameData?.capturedPieces[i] || 0}
                </span>
              ))}
            </p>
          )}
          
          {gameState.gameData?.scores && (
            <p>Scores: 
              {Array.from({length: gameState.players}, (_, i) => (
                <span key={i} style={{ margin: '0 10px' }}>
                  Player {i + 1}: {gameState.gameData?.scores[i] || 0}
                </span>
              ))}
            </p>
          )}
        </div>

        {/* Win condition display */}
        {winResult && (
          <div style={{ 
            backgroundColor: '#2ecc71', 
            color: 'white', 
            padding: '10px', 
            borderRadius: '5px',
            margin: '10px 0'
          }}>
            <strong>Game Over!</strong><br/>
            {winResult.winner >= 0 ? (
              <>Winner: Player {winResult.winner + 1}<br/></>
            ) : (
              <>Draw!<br/></>
            )}
            Reason: {winResult.reason}
          </div>
        )}

        {/* Show if player must capture (if stored in gameData) */}
        {gameState.gameData?.mustCapture && (
          <div style={{ 
            backgroundColor: '#e74c3c', 
            color: 'white', 
            padding: '8px', 
            borderRadius: '4px',
            margin: '8px 0'
          }}>
            <strong>Must Capture!</strong>
          </div>
        )}
      </div>
      
      {/* Game Board */}
      <div 
        className="board"
        style={{
          position: 'relative',
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
        {gameState.board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isSelected = isSquareSelected(rowIndex, colIndex);
            const isHighlighted = isSquareHighlighted(rowIndex, colIndex);
            const canPlace = !piece && canPlaceHere(rowIndex, colIndex);
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="square"
                style={{
                  backgroundColor: getSquareColor(rowIndex, colIndex),
                  border: isSelected ? '3px solid #f1c40f' : '1px solid #7f8c8d',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  boxShadow: isHighlighted ? '0 0 10px rgba(46, 204, 113, 0.6)' : 
                             canPlace ? '0 0 8px rgba(52, 152, 219, 0.6)' : 'none'
                }}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                {piece && (
                  <PieceComponent
                    piece={piece}
                    gameConfig={gameState.config}
                    isSelected={isSelected}
                    onPieceClick={() => handleSquareClick(rowIndex, colIndex)}
                  />
                )}
                
                {/* Move indicator */}
                {isHighlighted && !piece && (
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
                
                {/* Place indicator */}
                {canPlace && (
                  <div
                    style={{
                      width: '15px',
                      height: '15px',
                      backgroundColor: '#3498db',
                      opacity: 0.5,
                      borderRadius: '2px'
                    }}
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        
        {/* Custom action buttons based on available actions */}
        {availableActions.filter(action => action.type === 'custom').map((action, index) => (
          <button 
            key={index}
            onClick={() => handleSpecialAction('custom')}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: '#9b59b6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            disabled={!!winResult}
          >
            {action.data?.buttonText || 'Custom Action'}
          </button>
        ))}

        {/* Generic skip turn button if no moves available */}
        {availableActions.length === 0 && gameState.gamePhase === "playing" && (
          <button 
            onClick={() => {
              // Force end turn by creating a skip action
              const skipAction: TurnAction = { type: 'custom', data: { skip: true } };
              engine.executeAction(gameState, skipAction, gameRules);
              if (onGameStateChange) {
                onGameStateChange(gameState);
              } else {
                setInternalGameState({...gameState});
              }
            }}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            disabled={!!winResult}
          >
            Skip Turn
          </button>
        )}
      </div>

      {/* Selected Piece Info */}
      {selectedSquare && gameState.board[selectedSquare.row][selectedSquare.col] && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: '#ecf0f1', 
          borderRadius: '5px',
          maxWidth: '300px',
          margin: '15px auto 0'
        }}>
          <h4>Selected Piece</h4>
          <p>Type: {gameState.board[selectedSquare.row][selectedSquare.col]?.type}</p>
          <p>Position: ({selectedSquare.row}, {selectedSquare.col})</p>
          {gameState.board[selectedSquare.row][selectedSquare.col]?.value !== undefined && (
            <p>Value: {gameState.board[selectedSquare.row][selectedSquare.col]?.value}</p>
          )}
          <p>Available Actions: {availableActions.length}</p>
        </div>
      )}
    </div>
  );
};

export default Board;