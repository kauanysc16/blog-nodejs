'use client'; // Adiciona essa linha para indicar que este é um Client Component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Importa o useRouter do next/navigation
import Image from 'next/image'; // Importa o componente Image do Next.js
import styles from './page.module.css'; // Importa o CSS para estilização do componente

const HomePage = () => {
  // Estado para armazenar as postagens
  const [posts, setPosts] = useState([]);
  // Estado para indicar se a página está carregando
  const [loading, setLoading] = useState(true);
  // Estado para armazenar mensagens de erro
  const [error, setError] = useState(null);
  // Hook para manipulação de navegação
  const router = useRouter();

  // Efeito colateral para buscar postagens quando o componente é montado
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Faz a requisição para o endpoint de postagens
        const response = await fetch('/api/');
        if (!response.ok) {
          throw new Error('Erro ao buscar postagens');
        }
        // Converte a resposta para JSON e atualiza o estado de postagens
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        // Atualiza o estado de erro se houver uma exceção
        setError(error.message);
      } finally {
        // Define o estado de carregamento como falso após a requisição
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // O array vazio indica que o efeito é executado apenas uma vez, após a montagem do componente

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {/* Componente Image para exibir o logo */}
        <Image 
          src="/logo.png" 
          alt="Logo" 
          width={150} // Largura da imagem
          height={50} // Altura da imagem
          className={styles.logo} 
        />
        <nav className={styles.nav}>
          {/* Botões de navegação para Login e Registro */}
          <button onClick={() => router.push('/login')} className={styles.navButton}>Login</button>
          <button onClick={() => router.push('/register')} className={styles.navButton}>Registro</button>
        </nav>
      </header>
      <div className={styles.searchFilter}>
        {/* Campo de busca */}
        <input
          type="text"
          placeholder="Pesquisar"
          className={styles.searchInput}
          onChange={(e) => {/* Função para manipular pesquisa */}}
        />
        {/* Campo de filtro */}
        <input
          type="text"
          placeholder="Filtro"
          className={styles.filterInput}
          onChange={(e) => {/* Função para manipular filtro */}}
        />
      </div>
      {/* Exibe mensagem de carregamento se os dados estiverem sendo carregados */}
      {loading && <p className={styles.loading}>Carregando postagens...</p>}
      {/* Exibe mensagem de erro se houver um erro */}
      {error && <p className={styles.error}>Erro: {error}</p>}
      {/* Exibe mensagem se não houver postagens disponíveis */}
      {!loading && !error && posts.length === 0 && <p>Não há postagens disponíveis.</p>}
      <div className={styles.postList}>
        {/* Lista de postagens */}
        {posts.map(post => (
          <div key={post._id} className={styles.postItem}>
            <h2>{post.title}</h2>
            <p>{post.content.substring(0, 100)}...</p> {/* Mostra os primeiros 100 caracteres do conteúdo */}
            <a href={`/post/${post._id}`} className={styles.readMore}>Leia mais</a> {/* Link para a página do post */}
          </div>
        ))}
      </div>
      {/* Botão para adicionar uma nova postagem */}
      <button className={styles.addButton} onClick={() => router.push('/posts')}>Adicionar</button>
    </div>
  );
};

export default HomePage;
