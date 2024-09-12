'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

async function fetchRecentPosts() {
  const res = await fetch('/api/posts');
  if (!res.ok) throw new Error('Erro ao carregar postagens recentes');
  const posts = await res.json();
  return posts.slice(0, 5); // Retorna as 5 postagens mais recentes
}

export default function HomePage() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadRecentPosts = async () => {
      try {
        const data = await fetchRecentPosts();
        setRecentPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRecentPosts();
  }, []);

  return (
    <div className="home-container">
      <header className="site-header">
        <h1>Bem-vindo ao BlogSite</h1>
        <nav>
          <a href="/posts">Postagens</a>
          <a href="/login">Login</a>
          <a href="/register">Registrar</a>
        </nav>
      </header>

      <main>
        <section className="intro">
          <h2>Sobre o BlogSite</h2>
          <p>O BlogSite é um lugar onde você pode ler e compartilhar postagens sobre diversos temas. Conecte-se com outros leitores e escritores, e explore conteúdo interessante.</p>
        </section>

        <section className="recent-posts">
          <h2>Postagens Recentes</h2>
          {loading ? (
            <p>Carregando...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : recentPosts.length > 0 ? (
            <ul>
              {recentPosts.map((post) => (
                <li key={post._id}>
                  <a href={`/posts/${post._id}`}>
                    <h3>{post.title}</h3>
                    <p>{post.content.slice(0, 100)}...</p>
                    <p><strong>Autor:</strong> {post.author.username}</p>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma postagem recente encontrada.</p>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <p>&copy; {new Date().getFullYear()} BlogSite. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}