import React from 'react';
import { Piece, GameConfig } from '../Logic/types';

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
  onPieceClick 
}) => {
  
  const getPlayerColor = (owner: number) => {
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#e67e22'];
    return colors[owner % colors.length];
  };

  const getPieceDisplay = () => {
    // Handle different piece types
    switch (piece.type) {
      case 'barrier':
        return {
          symbol: '■',
          backgroundColor: '#7f8c8d',
          textColor: '#2c3e50',
          shape: 'square'
        };
      
      case 'pawn':
        return {
          symbol: '♟',
          backgroundColor: getPlayerColor(piece.owner),
          textColor: 'white',
          shape: 'circle'
        };
      
      case 'king':
        return {
          symbol: piece.data?.isKing || piece.data?.isPromoted ? '♚' : '♔',
          backgroundColor: getPlayerColor(piece.owner),
          textColor: 'white',
          shape: 'circle'
        };
      
      case 'queen':
        return {
          symbol: '♛',
          backgroundColor: getPlayerColor(piece.owner),
          textColor: 'white',
          shape: 'circle'
        };
      
      case 'rook':
        return {
          symbol: '♜',
          backgroundColor: getPlayerColor(piece.owner),
          textColor: 'white',
          shape: 'circle'
        };
      
      case 'bishop':
        return {
          symbol: '♝',
          backgroundColor: getPlayerColor(piece.owner),
          textColor: 'white',
          shape: 'circle'
        };
      
      case 'knight':
        return {
          symbol: '♞',
          backgroundColor: getPlayerColor(piece.owner),
          textColor: 'white',
          shape: 'circle'
        };
      
      case 'captain':
        return {
          symbol: '⚔',
          backgroundColor: getPlayerColor(piece.owner),
          textColor: 'white',
          shape: 'circle'
        };
      
      case 'checker':
      case 'regular':
      default:
        // Default checker piece
        return {
          symbol: piece.data?.isKing || piece.data?.isPromoted ? '♚' : '●',
          backgroundColor: getPlayerColor(piece.owner),
          textColor: 'white',
          shape: 'circle'
        };
    }
  };

  const display = getPieceDisplay();
  
  // Special states from piece.data
  const hasMoved = piece.data?.hasMoved;
  const isPromoted = piece.data?.isKing || piece.data?.isPromoted;
  const isSpecial = piece.data?.isSpecial;
  const hasValue = piece.value !== undefined;

  // Get border styling
  const getBorderStyle = () => {
    if (isSelected) {
      return '3px solid #f1c40f';
    }
    if (isSpecial) {
      return '2px solid #f39c12';
    }
    if (isPromoted) {
      return '2px solid #9b59b6';
    }
    return '2px solid #2c3e50';
  };

  const getPieceTitle = () => {
    let title = `${piece.type}`;
    if (piece.owner >= 0) {
      title += ` (Player ${piece.owner + 1})`;
    }
    if (hasValue) {
      title += ` - Value: ${piece.value}`;
    }
    if (isPromoted) {
      title += ' - Promoted';
    }
    if (isSpecial) {
      title += ' - Special';
    }
    if (hasMoved) {
      title += ' - Moved';
    }
    return title;
  };

  return (
    <div
      className="piece"
      style={{
        width: display.shape === 'square' ? '70%' : '75%',
        height: display.shape === 'square' ? '70%' : '75%',
        borderRadius: display.shape === 'square' ? '15%' : '50%',
        backgroundColor: display.backgroundColor,
        border: getBorderStyle(),
        cursor: piece.type === 'barrier' ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: hasValue ? '12px' : '18px',
        fontWeight: 'bold',
        color: display.textColor,
        boxShadow: isSpecial ? '0 0 8px rgba(241, 196, 15, 0.6)' : '0 2px 4px rgba(0,0,0,0.3)',
        transition: 'all 0.2s ease',
        opacity: hasMoved ? 0.9 : 1.0,
        position: 'relative',
        userSelect: 'none',
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (piece.type !== 'barrier') {
          onPieceClick();
        }
      }}
      title={getPieceTitle()}
    >
      {/* Main piece symbol */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}>
        <div style={{ fontSize: hasValue ? '10px' : 'inherit' }}>
          {display.symbol}
        </div>
        
        {/* Show value for Math War pieces */}
        {hasValue && (
          <div style={{ 
            fontSize: '8px', 
            fontWeight: 'bold',
            marginTop: '-2px'
          }}>
            {piece.value}
          </div>
        )}
      </div>
      
      {/* Promotion indicator */}
      {isPromoted && (
        <div
          style={{
            position: 'absolute',
            top: '-3px',
            right: '-3px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#9b59b6',
            fontSize: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}
        >
          ★
        </div>
      )}
      
      {/* Special piece indicator */}
      {isSpecial && !isPromoted && (
        <div
          style={{
            position: 'absolute',
            top: '-3px',
            right: '-3px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#f39c12',
            fontSize: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}
        >
          ◆
        </div>
      )}
      
      {/* Movement indicator */}
      {hasMoved && gameConfig.name === 'Chess' && (
        <div
          style={{
            position: 'absolute',
            bottom: '-3px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#e67e22',
          }}
        />
      )}
    </div>
  );
};

export default PieceComponent;