import React, { useState } from "react";
import styles from "./Dimensions.module.css";
import hintStyles from "./HintDimensions.module.css";
import Hint from "../../Components/hintButton";

type CubeSize = "2x2" | "3x3" | "4x4" | "5x5" | "6x6";

interface CubeImage {
  id: number;
  size: CubeSize;
}

interface DimensionBox {
  id: number;
  size: CubeSize;
  droppedImage: number | null;
}

const Dimensions: React.FC = () => {
  const [score, setScore] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [corrections, setCorrections] = useState<boolean[]>([]);
  const [showCorrections, setShowCorrections] = useState(false);

  // Function to get image path based on cube size
  const getCubeImage = (size: CubeSize) => {
    return `${import.meta.env.BASE_URL}${size}.png`;
  };
  const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

  // Available cube images to drag in the desired order: 4x4, 2x2, 6x6, 3x3, 5x5
  const [cubeImages, setCubeImages] = useState<CubeImage[]>(() => 
  shuffleArray([
    { id: 1, size: "4x4" },
    { id: 2, size: "2x2" },
    { id: 3, size: "6x6" },
    { id: 4, size: "3x3" },
    { id: 5, size: "5x5" },
  ])
);
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
    const currentBoxIndex = dimensionBoxes.findIndex(
      (box) => box.droppedImage === imageId
    );

    if (currentBoxIndex >= 0) {
      // Remove from current box
      setDimensionBoxes((prev) =>
        prev.map((box) =>
          box.droppedImage === imageId ? { ...box, droppedImage: null } : box
        )
      );
    }

    // Add to new box
    setDimensionBoxes((prev) =>
      prev.map((box) =>
        box.id === boxId ? { ...box, droppedImage: imageId } : box
      )
    );
  };

  // Remove image from a box
  const removeImageFromBox = (boxId: number) => {
    setDimensionBoxes((prev) =>
      prev.map((box) =>
        box.id === boxId ? { ...box, droppedImage: null } : box
      )
    );
  };

  // Check answers and calculate score
  const checkAnswers = () => {
    setIsChecking(true);

    let correct = 0;
    const correctionResults: boolean[] = dimensionBoxes.map((box) => {
      if (box.droppedImage) {
        const droppedImage = cubeImages.find(
          (img) => img.id === box.droppedImage
        );
        const isCorrect = droppedImage?.size === box.size;
        if (isCorrect) correct++;
        return isCorrect || false;
      }
      return false;
    });

    setCorrections(correctionResults);
    const calculatedScore = (correct / dimensionBoxes.length) * 100;
    setScore(calculatedScore);
    setShowCorrections(true);
  };

  // Reset the game
  const resetGame = () => {
  setCubeImages(shuffleArray([
    { id: 1, size: "4x4" },
    { id: 2, size: "2x2" },
    { id: 3, size: "6x6" },
    { id: 4, size: "3x3" },
    { id: 5, size: "5x5" },
  ]));
  setDimensionBoxes((prev) =>
    prev.map((box) => ({ ...box, droppedImage: null }))
  );
  setScore(null);
  setIsChecking(false);
  setCorrections([]);
  setShowCorrections(false);
};

  // Close corrections but keep the results
  const closeCorrections = () => {
    setShowCorrections(false);
  };

  // Get score message
  const getScoreMessage = () => {
    if (score === null) return "";
    if (score === 100) return "Perfeito! 🎉";
    if (score >= 80) return "Ótimo trabalho! 👏";
    if (score >= 60) return "Bom trabalho! 👍";
    return "Tente de novo! 💪";
  };
  // Create hints with images
  const hint2Content = (
    <div>
      <p>
        Este cubo tem 3 quadradinhos de altura e 3 quadradinhos de largura. O
        cubo é 3x3.
      </p>
      <img
        src={getCubeImage("3x3")}
        alt="3x3 Rubik's Cube"
        className={styles.hintImage}
      />
    </div>
  );

  const hint3Content = (
    <div>
      <p>
        <strong>Cubo 2x2:</strong> 2 quadradinhos de altura, 2 de largura
      </p>
      <img
        src={getCubeImage("2x2")}
        alt="2x2 Rubik's Cube"
        className={styles.hintImage}
      />
      <p>
        <strong>Cubo 3x3:</strong> 3 quadradinhos de altura, 3 de largura
      </p>
      <img
        src={getCubeImage("3x3")}
        alt="3x3 Rubik's Cube"
        className={styles.hintImage}
      />
      <p>
        <strong>Cubo 4x4:</strong> 4 quadradinhos de altura, 4 de largura
      </p>
      <img
        src={getCubeImage("4x4")}
        alt="4x4 Rubik's Cube"
        className={styles.hintImage}
      />
      <p>
        <strong>Cubo 5x5:</strong> 5 quadradinhos de altura, 5 de largura
      </p>
      <img
        src={getCubeImage("5x5")}
        alt="5x5 Rubik's Cube"
        className={styles.hintImage}
      />
      <p>
        <strong>Cubo 6x6:</strong> 6 quadradinhos de altura, 6 de largura
      </p>
      <img
        src={getCubeImage("6x6")}
        alt="6x6 Rubik's Cube"
        className={styles.hintImage}
      />
    </div>
  );

  return (
    <>
      <div className={styles.container}>
        <h2>Tipos de Cubos Mágicos</h2>
        <h3>Arraste os cubos para as caixas com os tamanhos</h3>

        
        <Hint
          title="Dicas: Dimensões dos Cubos"
          hint1="Descubra a altura e largura de cada cubo."
          hint2={hint2Content}
          hint3={hint3Content}
          styleFile={hintStyles}
        />

        
        <div className={styles.dragContainer}>
          {isChecking && score !== null ? (
            <div className={styles.scoreRow}>
              <h3 className={styles.scoreTitle}>Sua pontuação</h3>
              <div className={styles.scoreDisplay}>
                {score !== null ? `${Math.round(score / 20)}/5` : "0/5"} -{" "}
                {getScoreMessage()}
              </div>
              <button onClick={resetGame} className={styles.resetButton}>
                Tentar de novo
              </button>
            </div>
          ) : (
            <>
              
              <div className={styles.imagesRow}>
                {cubeImages.map((image) => {
                  // Check if this image is already placed in a box
                  const isPlaced = dimensionBoxes.some(
                    (box) => box.droppedImage === image.id
                  );

                  return (
                    <div
                      key={image.id}
                      className={`${styles.cubeImage} ${
                        isPlaced ? styles.placed : ""
                      }`}
                      draggable={!isPlaced && !isChecking}
                      onDragStart={(e) =>
                        !isPlaced && !isChecking && handleDragStart(e, image.id)
                      }
                    >
                      <img
                        src={getCubeImage(image.size)}
                        alt={`${image.size} Rubik's Cube`}
                        className={styles.cubeImg}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Bottom row: Dimension boxes to drop into */}
        <div className={styles.dropContainer}>
          <div className={styles.boxesRow}>
            {dimensionBoxes.map((box, index) => (
              <div
                key={box.id}
                className={styles.dimensionBox}
                onDragOver={!isChecking ? handleDragOver : undefined}
                onDrop={!isChecking ? (e) => handleDrop(e, box.id) : undefined}
              >
                <div className={styles.dropArea}>
                  {box.droppedImage ? (
                    <>
                      <div className={styles.droppedImage}>
                        <img
                          src={getCubeImage(
                            cubeImages.find(
                              (img) => img.id === box.droppedImage
                            )?.size || box.size
                          )}
                          alt={`Dropped cube`}
                          className={styles.cubeImg}
                        />
                      </div>
                      {!isChecking && (
                        <button
                          className={styles.removeButton}
                          onClick={() => removeImageFromBox(box.id)}
                        >
                          X
                        </button>
                      )}
                    </>
                  ) : (
                    <div className={styles.emptyText}>
                      {isChecking ? "Vazio" : "Arraste aqui"}
                    </div>
                  )}

                  {/* Correction indicators */}
                  {isChecking && (
                    <div className={styles.correctionIndicator}>
                      <span
                        className={
                          corrections[index] ? styles.correct : styles.incorrect
                        }
                      >
                        {corrections[index] ? "✓" : "✗"}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className={styles.dimensionLabel}>{box.size}</div>
              </div>
            ))}
            {!isChecking && (
          <div className={styles.submitContainer}>
            <button
              onClick={checkAnswers}
              className={styles.submitButton}
              disabled={dimensionBoxes.some((box) => box.droppedImage === null)}
            >
              Corrigir
            </button>
          </div>
        )}
          </div>
        </div>

        
      </div>
    </>
  );
};

export default Dimensions;
