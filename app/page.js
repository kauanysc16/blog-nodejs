'use client'; // Adiciona essa linha para indicar que este é um Client Component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Importa o useRouter do next/navigation
import Image from 'next/image'; // Importa o componente Image do Next.js
import styles from './page.module.css'; // Importa o CSS

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/');
        if (!response.ok) {
          throw new Error('Erro ao buscar postagens');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Image 
          src="/logo.png" 
          alt="Logo" 
          width={150} // Largura da imagem
          height={50} // Altura da imagem
          className={styles.logo} 
        />
        <nav className={styles.nav}>
          <button onClick={() => router.push('/login')} className={styles.navButton}>Login</button>
          <button onClick={() => router.push('/register')} className={styles.navButton}>Registro</button>
        </nav>
      </header>
      <div className={styles.searchFilter}>
        <input
          type="text"
          placeholder="Pesquisar"
          className={styles.searchInput}
          onChange={(e) => {/* Função para manipular pesquisa */}}
        />
        <input
          type="text"
          placeholder="Filtro"
          className={styles.filterInput}
          onChange={(e) => {/* Função para manipular filtro */}}
        />
      </div>
      {loading && <p className={styles.loading}>Carregando postagens...</p>}
      {error && <p className={styles.error}>Erro: {error}</p>}
      {!loading && !error && posts.length === 0 && <p>Não há postagens disponíveis.</p>}
      <div className={styles.postList}>
        {posts.map(post => (
          <div key={post._id} className={styles.postItem}>
            <h2>{post.title}</h2>
            <p>{post.content.substring(0, 100)}...</p>
            <a href={`/post/${post._id}`} className={styles.readMore}>Leia mais</a>
          </div>
        ))}
      </div>
      <button className={styles.addButton} onClick={() => router.push('/posts')}>Adicionar</button>
    </div>
  );
};

export default HomePage;
