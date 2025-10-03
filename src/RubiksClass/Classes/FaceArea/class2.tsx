import React, { useState } from "react";
import styles from "./class2.module.css";
import hintStyles from "./class2Hint.module.css";
import Hint from "../../Components/hintButton";
import { CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

const Class2: React.FC = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [corrections, setCorrections] = useState<boolean[]>([]);
  const [showCorrections, setShowCorrections] = useState(false);

  const goToNextClass = () => {
  navigate("/class2"); // Adjust the path based on your routing
};

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
    setCubeImages(
      shuffleArray([
        { id: 1, size: "4x4" },
        { id: 2, size: "2x2" },
        { id: 3, size: "6x6" },
        { id: 4, size: "3x3" },
        { id: 5, size: "5x5" },
      ])
    );
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
  const getScoreMessageE = () => {
    if (score === null) return "";
    if (score === 100) return "🎉";
    if (score >= 80) return "👏";
    if (score >= 60) return "👍";
    return "💪";
  };
  const getScoreMessage = () => {
    if (score === null) return "";
    if (score >= 80) return "Excelente!";
    if (score >= 60) return "Muito Bem!";
    return "Tente de novo!";
  };
  // Create hints with images
  const hint1Content = (
    <div>
      <p>Lembre da altura e largura de cada cubo</p>
    </div>
  );

  const hint2Content = (
    <div>
      <p>
        O cubo 3x3 tem 3 linhas com 3 quadradinhos em cada. 3 grupos com 3
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
      <p>Em cada cubo, faça a altura vezes a largura</p>
    </div>
  );

  const hint4Content = (
    <div>
      <p>No cubo 2x2, faça 2 vezes 2, que é igual a 4</p>
      <img
        src={getCubeImage("2x2")}
        alt="2x2 Rubik's Cube"
        className={styles.hintImage}
      />
    </div>
  );

  const hint5Content = (
    <div>
      <p><strong>Cubo 3x3:</strong> 3 vezes 3 = 9 quadradinhos</p>
      <img
        src={getCubeImage("3x3")}
        alt="3x3 Rubik's Cube"
        className={styles.hintImage}
      />
      <p><strong>Cubo 4x4:</strong> 4 vezes 4 = 16 quadradinhos</p>
      <img
        src={getCubeImage("4x4")}
        alt="4x4 Rubik's Cube"
        className={styles.hintImage}
      />
      <p><strong>Cubo 5x5:</strong> 5 vezes 5 = 25 quadradinhos</p>
      <img
        src={getCubeImage("5x5")}
        alt="5x5 Rubik's Cube"
        className={styles.hintImage}
      />
      <p><strong>Cubo 6x6:</strong> 6 vezes 6 = 36 quadradinhos</p>
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
        <div className={styles.menuButtonContainer}>
          <button
            onClick={() => navigate("/classMenu")}
            className={styles.menuButton}
          >
            Aulas
          </button>
        </div>
        <h2>Área das Faces do Cubo</h2>
        <h3>Descubra quantos quadradinhos tem em um lado do cubo</h3>

        <Hint
          title="Dicas: Área das Faces"
          hint1={hint1Content}
          hint2={hint2Content}
          hint3={hint3Content}
          hint4={hint4Content}
          hint5={hint5Content}
          styleFile={hintStyles}
        />

        <div className={styles.dragContainer}>
          {isChecking && score !== null ? (
            <div className={styles.scoreRow}>
              <div className={styles.scoreText}>
                <div className={styles.scoreTitle}>{getScoreMessage()}</div>
                <div className={styles.scoreDisplay}>
                  {score !== null ? `${Math.round(score / 20)}/5` : "0/5"} -{" "}
                  {getScoreMessageE()}
                </div>
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
        {!isChecking && (
      <div className={styles.submitContainer}>
        <button
          onClick={checkAnswers}
          className={styles.submitButton}
          disabled={dimensionBoxes.some(
            (box) => box.droppedImage === null
          )}
        >
          Corrigir
        </button>
      </div>
    )}
    {isChecking && (
      <div className={styles.submitContainer}>
        <button
          onClick={goToNextClass}
          className={styles.nextButton}
          disabled={dimensionBoxes.some(
            (box) => box.droppedImage === null
          )}
        >
          Próximo
        </button>
      </div>
    )}
      </div>
    </>
  );
}

export default Class2;
