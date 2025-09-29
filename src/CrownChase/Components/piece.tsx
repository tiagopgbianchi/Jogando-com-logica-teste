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
      "#e74c3c",
      "#3498db",
      "#2ecc71",
      "#f39c12",
      "#9b59b6",
      "#e67e22",
    ];
    const baseColor = colors[owner % colors.length];

    if (isCaptain) {
      // Return a darker shade for captains
      return darkenColor(baseColor, 0.3); // 30% darker
    }

    return baseColor;
  };

  // Helper function to darken a hex color
  const darkenColor = (color: string, amount: number): string => {
    let usePound = false;

    if (color[0] === "#") {
      color = color.slice(1);
      usePound = true;
    }

    const num = parseInt(color, 16);
    let r = (num >> 16) + amount * 255;
    let g = ((num >> 8) & 0x00ff) + amount * 255;
    let b = (num & 0x0000ff) + amount * 255;

    r = Math.min(Math.max(0, r), 255);
    g = Math.min(Math.max(0, g), 255);
    b = Math.min(Math.max(0, b), 255);

    return (
      (usePound ? "#" : "") +
      (b | (g << 8) | (r << 16)).toString(16).padStart(6, "0")
    );
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

      case "sum":
        return {
          symbol: `+${piece.value || 0}`, // Show value with + sign
          backgroundColor: getPlayerColor(piece.owner, isCaptain),
          textColor: "white",
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
        <div style={{ fontSize: hasValue ? "10px" : "inherit" }}>
          {display.symbol}
        </div>

        {/* Show value for Math War pieces */}
        {hasValue && <div className={styles.pieceValue}>{piece.value}</div>}
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
