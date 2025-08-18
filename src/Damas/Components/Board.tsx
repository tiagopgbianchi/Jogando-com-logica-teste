import { useEffect, useState } from "react";
import { Player, PieceType } from "../types";
import BoardGrid from "../Components/BoardGrid";
import {
  initializeBoard,
  updateMandatoryCaptures,
  getMovesForSelectedPiece,
  attemptMove,
} from "../Logic/gameController";
import styles from "../styles/board.module.css";

interface BoardProps {
  mandatoryCapture: boolean;
}

function Board({ mandatoryCapture }: BoardProps) {
  const [matrix, setMatrix] = useState<(PieceType | null)[][]>(
    initializeBoard()
  );
  const [turn, setTurn] = useState<Player>(1);

  const [mustCapturePieces, setMustCapturePieces] = useState<
    [number, number][]
  >([]);
  const [mustCaptureTargets, setMustCaptureTargets] = useState<
    [number, number][]
  >([]);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);

  const [selectedPiece, setSelectedPiece] = useState<{
    row: number;
    col: number;
    piece: PieceType;
  } | null>(null);

  // Game statistics
  const [whitePieces, setWhitePieces] = useState(12);
  const [blackPieces, setBlackPieces] = useState(12);
  const [gameWinner, setGameWinner] = useState<Player | null>(null);

  // Count pieces on board
  useEffect(() => {
    let whiteCount = 0;
    let blackCount = 0;
    
    matrix.forEach(row => {
      row.forEach(piece => {
        if (piece) {
          if (piece.player === 1) whiteCount++;
          else blackCount++;
        }
      });
    });
    
    setWhitePieces(whiteCount);
    setBlackPieces(blackCount);
    
    // Check for winner
    if (whiteCount === 0) {
      setGameWinner(2);
    } else if (blackCount === 0) {
      setGameWinner(1);
    }
  }, [matrix]);

  useEffect(() => {
    const { mustCapturePieces, mustCaptureTargets } = updateMandatoryCaptures(
      matrix,
      turn,
      mandatoryCapture
    );
    setMustCapturePieces(mustCapturePieces);
    setMustCaptureTargets(mustCaptureTargets);
  }, [matrix, turn, mandatoryCapture]);

  const handlePieceClick = (row: number, col: number, piece: PieceType) => {
    if (piece.player !== turn) return;
    if (gameWinner) return; // Game is over

    const moves = getMovesForSelectedPiece(
      matrix,
      row,
      col,
      piece,
      turn,
      mandatoryCapture
    );

    setSelectedPiece({ row, col, piece });
    setValidMoves(moves);
  };

  const handleSquareClick = (row: number, col: number) => {
    if (!selectedPiece) return;
    if (gameWinner) return; // Game is over

    const { row: fromRow, col: fromCol, piece } = selectedPiece;

    const result = attemptMove(
      matrix,
      fromRow,
      fromCol,
      row,
      col,
      piece,
      turn,
      mandatoryCapture
    );

    if (!result) return;

    const { updatedMatrix, nextTurn, moreCaptures } = result;
    setMatrix(updatedMatrix);

    if (moreCaptures.length > 0) {
      const newPiece = updatedMatrix[row][col];
      if (newPiece) {
        setSelectedPiece({ row, col, piece: newPiece });
        setValidMoves(moreCaptures);
      }
    } else {
      setSelectedPiece(null);
      setValidMoves([]);
      if (nextTurn !== null) setTurn(nextTurn);
    }
  };

  const resetGame = () => {
    setMatrix(initializeBoard());
    setTurn(1);
    setSelectedPiece(null);
    setValidMoves([]);
    setGameWinner(null);
    setWhitePieces(12);
    setBlackPieces(12);
  };

  const getPlayerName = (player: Player) => {
    return player === 1 ? "Branco" : "Preto";
  };

  const getGameStatusMessage = () => {
    if (gameWinner) {
      return `🏆 ${getPlayerName(gameWinner)} Venceu!`;
    }
    
    if (mustCapturePieces.length > 0 && mandatoryCapture) {
      return `⚡ Captura obrigatória para ${getPlayerName(turn)}`;
    }
    
    return `Vez do jogador ${getPlayerName(turn)}`;
  };

  return (
    <div className={styles['game-container']}>
      <div className={styles['game-header']}>
        <h1 className={styles['game-title']}>Damas</h1>
        
        <div className={styles['turn-indicator']}>
          <span className={styles['current-player']}>
            {getGameStatusMessage()}
          </span>
        </div>
        
        <div className={styles['game-stats']}>
          <div className={styles['piece-count']}>
            <span className={styles['white-count']}>⚪ Branco: {whitePieces}</span>
            <span className={styles['black-count']}>⚫ Preto: {blackPieces}</span>
          </div>
        </div>
      </div>

      <div className={styles['board-wrapper']}>
        <BoardGrid
          selectedPlayer={selectedPiece ? selectedPiece.piece.player : null}
          matrix={matrix}
          validMoves={validMoves}
          selectedPos={
            selectedPiece ? [selectedPiece.row, selectedPiece.col] : null
          }
          onPieceClick={handlePieceClick}
          onSquareClick={handleSquareClick}
          mustCapturePieces={mustCapturePieces}
          mustCaptureTargets={mustCaptureTargets}
        />
      </div>

      {gameWinner && (
        <div className={styles['winner-overlay']}>
          <div className={styles['winner-box']}>
            <h2>🎉 Fim de Jogo! 🎉</h2>
            <p>Jogador {getPlayerName(gameWinner)} venceu!</p>
            <button 
              onClick={resetGame}
              className={styles['reset-button']}
            >
              Jogar Novamente
            </button>
          </div>
        </div>
      )}

      <div className={styles['game-controls']}>
        <button 
          onClick={resetGame}
          className={styles['control-button']}
        >
          Reiniciar Jogo
        </button>
        
        <div className={styles['capture-mode']}>
          <span>
            Captura: {mandatoryCapture ? "Obrigatória" : "Opcional"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Board;