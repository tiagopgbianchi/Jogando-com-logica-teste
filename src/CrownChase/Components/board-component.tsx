import React, { useState, useEffect } from 'react';
import { GameState, Position, Piece, TurnAction, GameConfig, GameRules } from '../Logic/types';
import { GameEngine } from '../Logic/gameEngine';
import PieceComponent from './piece';
import styles from '../styles/board.module.css';

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

    // Check if clicked on an obstacle
    if (clickedPiece && clickedPiece.isObstacle) {
      return; // Can't interact with obstacles
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

  const handleDiceRoll = () => {
    const diceAction: TurnAction = { type: 'roll_dice' };
    const success = engine.executeAction(gameState, diceAction, gameRules);
    
    if (success) {
      if (onGameStateChange) {
        onGameStateChange(gameState);
      } else {
        setInternalGameState({...gameState});
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
    <div className={styles.gameContainer}>
      
      {/* Game Info */}
      <div className={styles.gameInfo}>
        <h2 className={styles.gameTitle}>{gameState.config.name}</h2>
        <p className={styles.playerInfo}>
          Current Player: 
          <span style={{ 
            fontWeight: 'bold', 
            color: gameState.currentPlayer === 0 ? '#e74c3c' : '#3498db' 
          }}>
            {currentPlayerName}
          </span>
        </p>
        <p className={styles.turnInfo}>Turn: {gameState.turnCount + 1}</p>
        
        {/* Show remaining moves/energy based on game type */}
        {gameState.config.energyPerTurn !== undefined ? (
          <p className={styles.resourceInfo}>Energy Left: {gameState.remainingEnergy || 0}</p>
        ) : (
          <p className={styles.resourceInfo}>Moves Left: {gameState.remainingMoves}</p>
        )}
        
        {barriersLeft > 0 && (
          <p className={styles.resourceInfo}>Barriers Available: {barriersLeft}</p>
        )}
        
        {/* Show dice roll if stored in gameData */}
        {gameState.lastDiceRoll && (
          <p className={styles.resourceInfo}>
            Dice Roll: {Array.isArray(gameState.lastDiceRoll) ? 
            gameState.lastDiceRoll.join(', ') : gameState.lastDiceRoll}
          </p>
        )}

        {/* Score Display */}
        <div className={styles.scoreDisplay}>
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
          <div className={styles.winDisplay}>
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
          <div className={styles.mustCapture}>
            <strong>Must Capture!</strong>
          </div>
        )}
      </div>
      
      {/* Game Board */}
      <div 
        className={styles.board}
        style={{
          gridTemplateColumns: `repeat(${gameState.config.boardWidth}, 50px)`,
          gridTemplateRows: `repeat(${gameState.config.boardHeight}, 50px)`,
        }}
      >
        {gameState.board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isSelected = isSquareSelected(rowIndex, colIndex);
            const isHighlighted = isSquareHighlighted(rowIndex, colIndex);
            const canPlace = !piece && canPlaceHere(rowIndex, colIndex);
            const isObstacle = piece && piece.isObstacle;
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`${styles.square} ${
                  isObstacle ? styles.squareObstacle : ''
                } ${isHighlighted ? styles.squareHighlighted : ''} ${
                  canPlace ? styles.squareCanPlace : ''
                }`}
                style={{
                  backgroundColor: isObstacle ? '#7f8c8d' : getSquareColor(rowIndex, colIndex),
                }}
                onClick={() => !isObstacle && handleSquareClick(rowIndex, colIndex)}
              >
                {piece && (
                  <PieceComponent
                    piece={piece}
                    gameConfig={gameState.config}
                    isSelected={isSelected}
                    onPieceClick={() => !isObstacle && handleSquareClick(rowIndex, colIndex)}
                  />
                )}
                
                {/* Move indicator */}
                {isHighlighted && !piece && (
                  <div className={styles.moveIndicator} />
                )}
                
                {/* Place indicator */}
                {canPlace && (
                  <div className={styles.placeIndicator} />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        
        {/* Dice roll button for Math War */}
        {gameState.config.useDice && !gameState.lastDiceRoll && (
          <button 
            onClick={handleDiceRoll}
            className={`${styles.actionButton} ${styles.actionButtonDice}`}
            disabled={!!winResult}
          >
            Roll Dice
          </button>
        )}

        {/* Custom action buttons based on available actions */}
        {availableActions.filter(action => action.type === 'custom').map((action, index) => (
          <button 
            key={index}
            onClick={() => handleSpecialAction('custom')}
            className={`${styles.actionButton} ${styles.actionButtonCustom}`}
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
            className={`${styles.actionButton} ${styles.actionButtonSkip}`}
            disabled={!!winResult}
          >
            Skip Turn
          </button>
        )}
      </div>

      {/* Selected Piece Info */}
      {selectedSquare && gameState.board[selectedSquare.row][selectedSquare.col] && (
        <div className={styles.pieceInfo}>
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