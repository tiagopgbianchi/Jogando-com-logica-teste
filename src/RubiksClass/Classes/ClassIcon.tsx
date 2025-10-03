import { useNavigate } from "react-router-dom";
import styles from "./ClassIcon.module.css";

interface ClassIconProps {
  pagina: string;
  label: string;
  imageSrc?: string;
}

function ClassIcon({ pagina, label, imageSrc}: ClassIconProps) {
  const navigate = useNavigate();

  const handleClick = () => {
   navigate(`/${pagina}`);
  }

  return (
    <button
      onClick={handleClick}
      className={styles.classIcon} 
    >
      <div className={styles.classIconInner}>
        <div className={styles.classIconContainer}>
          {imageSrc && <img src={imageSrc} className={styles.classIconImg} alt={label} />}
        </div>
        <span className={styles.classLabel}>{label}</span>
      </div>
    </button>
  );
}

export default ClassIcon;
