import styles from "../CSS/manual.module.css";

function Manual() {
  return (
    <div className={styles.manualPage}>
      <h1 className={styles.title}>Manual para Professores</h1>
      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Bem-vindo ao Jogando com Lógica</h2>
          <p>
            Este manual foi desenvolvido para auxiliar professores a utilizar a plataforma
            Jogando com Lógica em suas aulas, promovendo o aprendizado de matemática e
            raciocínio lógico de forma lúdica e interativa.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Como utilizar a plataforma</h2>
          <p>
            A plataforma oferece diversos jogos educativos que podem ser utilizados
            em sala de aula ou como atividades complementares. Cada jogo foi desenvolvido
            para trabalhar conceitos específicos de matemática e lógica.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Jogos disponíveis</h2>
          <ul className={styles.gameList}>
            <li><strong>Stop Matemático:</strong> Trabalha operações matemáticas básicas e agilidade mental.</li>
            <li><strong>Damas:</strong> Desenvolve raciocínio estratégico e planejamento.</li>
            <li><strong>Caça Soma:</strong> Estimula a identificação de padrões numéricos.</li>
            <li><strong>Jogo da Velha Especial:</strong> Aprimora pensamento tático.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Sugestões de uso</h2>
          <p>
            Recomendamos que os jogos sejam utilizados em grupos pequenos (4-6 alunos)
            para promover a colaboração e discussão entre os estudantes. Incentive os
            alunos a explicarem suas estratégias e raciocínios.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Manual;
