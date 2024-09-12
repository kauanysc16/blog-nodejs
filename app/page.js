import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Logotipo do Talk Blog */}
        <Image
          className={styles.logo}
          src="/logo.png" // Adicione o logotipo do Talk Blog aqui (altere o caminho conforme necessário)
          alt="Logotipo do Talk Blog"
          width={180}
          height={60}
          priority
        />

        {/* Slogan do Talk Blog */}
        <h1>Bem-vindo ao Talk Blog</h1>
        <p className={styles.slogan}>Discussões Que Valem a Pena</p>

        {/* Descrição curta do blog */}
        <p className={styles.description}>
          O espaço onde a conversa se transforma em conexão. No Talk Blog, discutimos ideias, compartilhamos histórias e inspiramos debates construtivos.
        </p>

        {/* Links para as páginas principais */}
        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="/posts"
            role="button" // Adiciona o papel de botão para links que agem como botões
            aria-label="Ver Postagens"
          >
            Ver Postagens
          </a>
          <a
            href="/register"
            className={styles.secondary}
            role="button" // Adiciona o papel de botão para links que agem como botões
            aria-label="Registrar-se"
          >
            Registrar-se
          </a>
        </div>
      </main>

      {/* Rodapé */}
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Talk Blog - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
