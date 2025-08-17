import { GameState, Position, Piece, GameConfig } from '../Logic/types';
interface PieceProps {
  piece: Piece;
  isSelected: boolean;
  onPieceClick: () => void;
}

const PieceComponent: React.FC<PieceProps> = ({ piece, isSelected, onPieceClick }) => {
  const getPlayerColor = (owner: number) => {
    return owner === 0 ? '#e74c3c' : '#3498db';
  };

  return (
    <div
      className="piece"
      style={{
        width: '60%',
        height: '60%',
        borderRadius: '50%',
        backgroundColor: getPlayerColor(piece.owner),
        border: isSelected ? '3px solid #f1c40f' : '2px solid #2c3e50',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        fontWeight: 'bold',
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        transition: 'all 0.2s ease'
      }}
      onClick={(e) => {
        e.stopPropagation();
        onPieceClick();
      }}
    >
      {piece.type === 'king' ? '♔' : '●'}
    </div>
  );
};
export default PieceComponent