import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ClassMenu.module.css";
import ClassIcon from "./ClassIcon";

const ClassMenu: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Aulas do Cubo Mágico</h1>
        <p>Escolha uma aula para começar a aprender!</p>
      </div>

      <div className={styles.classGrid}>
        <ClassIcon
          pagina="dimensions"
          label="Aula 1: Dimensões"
          imageSrc={`${import.meta.env.BASE_URL}3x3.png`}
        />
        <ClassIcon
          pagina="class2"
          label="Aula 2: Área das Faces"
          imageSrc={`${import.meta.env.BASE_URL}4x4.png`}
        />
        <ClassIcon
          pagina="class2"
          label="Em Breve"
          imageSrc={`${import.meta.env.BASE_URL}5x5.png`}
        />
        <ClassIcon
          pagina="class2"
          label="Em Breve"
          imageSrc={`${import.meta.env.BASE_URL}6x6.png`}
        />
      </div>
    </div>
  );
};

export default ClassMenu;
