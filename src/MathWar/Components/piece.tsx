import React from "react";
import { Piece, GameConfig } from "../Logic/types";
import styles from "../styles/piece.module.css";

interface PieceProps {
  piece: Piece;
  gameConfig: GameConfig;
  isSelected: boolean;
  onPieceClick: () => void;
}

const PieceComponent: React.FC<PieceProps> = ({
  piece,
  gameConfig,
  isSelected,
  onPieceClick,
}) => {
  const getPlayerColor = (owner: number, isCaptain: boolean = false) => {
    const colors = [
      "#e74c3c", // Player 0 - red
      "#3498db", // Player 1 - blue
      "#2ecc71", // Player 2 - green
      "#f39c12", // Player 3 - orange
      "#9b59b6", // Player 4 - purple
      "#e67e22", // Player 5 - dark orange
    ];

    const captainColors = [
      "#ceb01eff", // Player 0 - red
      "#3e009aff", // Player 1 - blue
      "#2ecc71", // Player 2 - green
      "#f39c12", // Player 3 - orange
      "#9b59b6", // Player 4 - purple
      "#e67e22", // Player 5 - dark orange
    ];

    if (isCaptain) {
      return captainColors[owner % captainColors.length];
    }

    return colors[owner % colors.length];
  };

  const getPieceDisplay = () => {
    const isCaptain = piece.data?.isCaptain;
    // Handle different piece types
    switch (piece.type) {
      case "barrier":
        return {
          symbol: "■",
          backgroundColor: "#7f8c8d",
          textColor: "#2c3e50",
          shape: "square",
        };

      case "pawn":
        return {
          symbol: "♟",
          backgroundColor: getPlayerColor(piece.owner),
          textColor: "white",
          shape: "circle",
        };

      case "sumDiag":
        const isCaptain = piece.data?.isCaptain;
        return {
          symbol: `+${piece.value || 0}`, // Different symbol to indicate diagonal movement
          backgroundColor: getPlayerColor(piece.owner, isCaptain),
          textColor: isCaptain ? "black" : "white", // Black text for better contrast on light captain colors
          shape: "square", // Square shape to distinguish from circular sum pieces
        };

      case "sum":
        return {
          symbol: `+${piece.value || 0}`,
          backgroundColor: getPlayerColor(piece.owner, piece.data?.isCaptain),
          textColor: piece.data?.isCaptain ? "black" : "white", // Black text for better contrast on light captain colors
          shape: "circle",
        };

      case "king":
        return {
          symbol: piece.data?.isKing || piece.data?.isPromoted ? "♚" : "♔",
          backgroundColor: getPlayerColor(piece.owner),
          textColor: "white",
          shape: "circle",
        };

      case "queen":
        return {
          symbol: "♛",
          backgroundColor: getPlayerColor(piece.owner),
          textColor: "white",
          shape: "circle",
        };

      case "rook":
        return {
          symbol: "♜",
          backgroundColor: getPlayerColor(piece.owner),
          textColor: "white",
          shape: "circle",
        };

      case "bishop":
        return {
          symbol: "♝",
          backgroundColor: getPlayerColor(piece.owner),
          textColor: "white",
          shape: "circle",
        };

      case "knight":
        return {
          symbol: "♞",
          backgroundColor: getPlayerColor(piece.owner),
          textColor: "white",
          shape: "circle",
        };

      case "captain":
        return {
          symbol: "⚔",
          backgroundColor: getPlayerColor(piece.owner),
          textColor: "white",
          shape: "circle",
        };

      case "checker":
      case "regular":
      default:
        // Default checker piece
        return {
          symbol: piece.data?.isKing || piece.data?.isPromoted ? "♚" : "●",
          backgroundColor: getPlayerColor(piece.owner),
          textColor: "white",
          shape: "circle",
        };
      case "killer":
        return {
          symbol: "X",
          backgroundColor: getPlayerColor(piece.owner),
          textColor: "white",
          shape: "circle",
        };
    }
  };

  const display = getPieceDisplay();

  // Special states from piece.data
  const hasMoved = piece.data?.hasMoved;
  const isPromoted = piece.data?.isKing || piece.data?.isPromoted;
  const isSpecial = piece.data?.isSpecial;
  const hasValue = piece.value !== undefined;

  const getPieceTitle = () => {
    let title = `${piece.type}`;
    if (piece.data?.isCaptain) {
      title += " - Captain";
    }
    if (piece.owner >= 0) {
      title += ` (Player ${piece.owner + 1})`;
    }
    if (hasValue) {
      title += ` - Value: ${piece.value}`;
    }
    if (isPromoted) {
      title += " - Promoted";
    }
    if (isSpecial) {
      title += " - Special";
    }
    if (hasMoved) {
      title += " - Moved";
    }
    return title;
  };

  return (
    <div
      className={`${styles.piece} ${
        display.shape === "square" ? styles.pieceSquare : styles.pieceCircle
      } ${isSelected ? styles.pieceSelected : ""} ${
        isSpecial ? styles.pieceSpecial : ""
      } ${isPromoted ? styles.piecePromoted : ""} ${
        hasMoved ? styles.pieceMoved : ""
      } ${piece.type === "barrier" ? styles.pieceBarrier : ""}`}
      style={{
        width: display.shape === "square" ? "70%" : "75%",
        height: display.shape === "square" ? "70%" : "75%",
        backgroundColor: display.backgroundColor,
        fontSize: hasValue ? "12px" : "18px",
        color: display.textColor,
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (piece.type !== "barrier") {
          onPieceClick();
        }
      }}
      title={getPieceTitle()}
    >
      {/* Main piece symbol */}
      <div className={styles.pieceContent}>
        <div style={{ fontSize: hasValue ? "18px" : "inherit" }}>
          {display.symbol}
        </div>

        {/* Show value for Math War pieces */}
        {hasValue && <div className={styles.pieceValue}></div>}
      </div>

      {/* Captain indicator */}
      {piece.data?.isCaptain && (
        <div className={styles.pieceCaptainIndicator}>C</div>
      )}

      {/* Promotion indicator */}
      {isPromoted && (
        <div
          className={`${styles.pieceIndicator} ${styles.piecePromotedIndicator}`}
        >
          ★
        </div>
      )}

      {/* Special piece indicator */}
      {isSpecial && !isPromoted && (
        <div
          className={`${styles.pieceIndicator} ${styles.pieceSpecialIndicator}`}
        >
          ◆
        </div>
      )}

      {/* Movement indicator */}
      {hasMoved && gameConfig.name === "Chess" && (
        <div className={styles.pieceMovementIndicator} />
      )}
    </div>
  );
};

export default PieceComponent;
