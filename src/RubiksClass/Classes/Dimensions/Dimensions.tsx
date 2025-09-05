import React, { useState } from "react";
import styles from "./Dimensions.module.css";

type CubeSize = "2x2" | "3x3" | "4x4" | "5x5" | "6x6";

interface CubeImage {
  id: number;
  size: CubeSize;
  url: string;
}

interface DimensionBox {
  id: number;
  size: CubeSize;
  droppedImage: number | null;
}

const Dimensions: React.FC = () => {
  const [showHints, setShowHints] = useState(true);
  const [score, setScore] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Available cube images to drag
  const [cubeImages, setCubeImages] = useState<CubeImage[]>([
    { id: 1, size: "2x2", url: "2x2-cube" },
    { id: 2, size: "3x3", url: "3x3-cube" },
    { id: 3, size: "4x4", url: "4x4-cube" },
    { id: 4, size: "5x5", url: "5x5-cube" },
    { id: 5, size: "6x6", url: "6x6-cube" },
  ]);

  // Dimension boxes where images can be dropped
  const [dimensionBoxes, setDimensionBoxes] = useState<DimensionBox[]>([
    { id: 1, size: "2x2", droppedImage: null },
    { id: 2, size: "3x3", droppedImage: null },
    { id: 3, size: "4x4", droppedImage: null },
    { id: 4, size: "5x5", droppedImage: null },
    { id: 5, size: "6x6", droppedImage: null },
  ]);

  // Handle drag start event
  const handleDragStart = (e: React.DragEvent, imageId: number) => {
    e.dataTransfer.setData("imageId", imageId.toString());
  };

  // Handle drag over event (necessary for drop to work)
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent, boxId: number) => {
    e.preventDefault();
    const imageId = parseInt(e.dataTransfer.getData("imageId"));
    
    // Check if this image is already placed in another box
    const currentBoxIndex = dimensionBoxes.findIndex(box => box.droppedImage === imageId);
    
    if (currentBoxIndex >= 0) {
      // Remove from current box
      setDimensionBoxes(prev => 
        prev.map(box => 
          box.droppedImage === imageId ? { ...box, droppedImage: null } : box
        )
      );
    }
    
    // Add to new box
    setDimensionBoxes(prev => 
      prev.map(box => 
        box.id === boxId ? { ...box, droppedImage: imageId } : box
      )
    );
  };

  // Remove image from a box
  const removeImageFromBox = (boxId: number) => {
    setDimensionBoxes(prev => 
      prev.map(box => 
        box.id === boxId ? { ...box, droppedImage: null } : box
      )
    );
  };

  // Check answers and calculate score
  const checkAnswers = () => {
    setIsChecking(true);
    
    let correct = 0;
    dimensionBoxes.forEach(box => {
      if (box.droppedImage) {
        const droppedImage = cubeImages.find(img => img.id === box.droppedImage);
        if (droppedImage && droppedImage.size === box.size) {
          correct++;
        }
      }
    });
    
    const calculatedScore = (correct / dimensionBoxes.length) * 100;
    setScore(calculatedScore);
  };

  // Reset the game
  const resetGame = () => {
    setDimensionBoxes(prev => 
      prev.map(box => ({ ...box, droppedImage: null }))
    );
    setScore(null);
    setIsChecking(false);
  };

  // Shuffle arrays for random order
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const shuffledImages = shuffleArray(cubeImages);
  const shuffledBoxes = shuffleArray(dimensionBoxes);

  return (
    <div className={styles.container}>
      <h2>Cube Dimensions Matching Game</h2>
      <p>Drag each Rubik's Cube to its correct dimensions</p>
      
      {score !== null ? (
        <div className={styles.results}>
          <h3>{score === 100 ? "Perfect! 🎉" : "Good job! 👍"}</h3>
          <p>Your score: {score}%</p>
          <button onClick={resetGame} className={styles.resetButton}>
            Play Again
          </button>
        </div>
      ) : (
        <>
          <div className={styles.controls}>
            <button 
              onClick={() => setShowHints(!showHints)}
              className={styles.hintToggle}
            >
              {showHints ? 'Hide Hints' : 'Show Hints'}
            </button>
          </div>

          {/* Top row: Cube images to drag */}
          <div className={styles.dragContainer}>
            <h3>Drag the cubes to their correct dimensions</h3>
            <div className={styles.imagesRow}>
              {shuffledImages.map((image) => {
                // Check if this image is already placed in a box
                const isPlaced = dimensionBoxes.some(box => box.droppedImage === image.id);
                
                return (
                  <div
                    key={image.id}
                    className={`${styles.cubeImage} ${isPlaced ? styles.placed : ""}`}
                    draggable={!isPlaced}
                    onDragStart={(e) => !isPlaced && handleDragStart(e, image.id)}
                  >
                    <div className={styles.cubeVisual}>
                      {image.size === '2x2' && <div className={styles.cube2x2}></div>}
                      {image.size === '3x3' && <div className={styles.cube3x3}></div>}
                      {image.size === '4x4' && <div className={styles.cube4x4}></div>}
                      {image.size === '5x5' && <div className={styles.cube5x5}></div>}
                      {image.size === '6x6' && <div className={styles.cube6x6}></div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom row: Dimension boxes to drop into */}
          <div className={styles.dropContainer}>
            <h3>Drop the cubes here</h3>
            <div className={styles.boxesRow}>
              {shuffledBoxes.map((box) => (
                <div
                  key={box.id}
                  className={styles.dimensionBox}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, box.id)}
                >
                  <div className={styles.dropArea}>
                    {box.droppedImage ? (
                      <>
                        <div className={styles.droppedImage}>
                          <div className={styles.cubeVisual}>
                            {box.size === '2x2' && <div className={styles.cube2x2}></div>}
                            {box.size === '3x3' && <div className={styles.cube3x3}></div>}
                            {box.size === '4x4' && <div className={styles.cube4x4}></div>}
                            {box.size === '5x5' && <div className={styles.cube5x5}></div>}
                            {box.size === '6x6' && <div className={styles.cube6x6}></div>}
                          </div>
                        </div>
                        <button 
                          className={styles.removeButton}
                          onClick={() => removeImageFromBox(box.id)}
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <div className={styles.emptyText}>Drop here</div>
                    )}
                  </div>
                  <div className={styles.dimensionLabel}>{box.size}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.submitContainer}>
            <button 
              onClick={checkAnswers}
              className={styles.submitButton}
              disabled={dimensionBoxes.some(box => box.droppedImage === null)}
            >
              Corrigir
            </button>
          </div>
          
          {showHints && (
            <div className={styles.hintSection}>
              <h3>How to Play</h3>
              <p>Drag each cube image to the box with its correct dimensions.</p>
              <p>A "2x2" cube has 2 small cubes on each side, a "3x3" has 3, and so on.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dimensions;