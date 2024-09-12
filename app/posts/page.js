'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Função para buscar as postagens da API
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        if (res.ok) {
          setPosts(data);
        } else {
          setError('Erro ao carregar postagens');
        }
      } catch (error) {
        setError('Erro ao se conectar ao servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Função para criar uma nova postagem
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) {
      setError('Título e conteúdo são obrigatórios');
      return;
    }

    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newPost),
      });

      if (res.ok) {
        const post = await res.json();
        setPosts([...posts, post]);
        setNewPost({ title: '', content: '' }); // Limpar o formulário
      } else {
        const data = await res.json();
        setError(data.message || 'Erro ao criar postagem');
      }
    } catch (error) {
      setError('Erro ao se conectar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  // Função para deletar uma postagem
  const handleDeletePost = async (id) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`/api/posts`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setPosts(posts.filter(post => post._id !== id));
      } else {
        const data = await res.json();
        setError(data.message || 'Erro ao deletar postagem');
      }
    } catch (error) {
      setError('Erro ao se conectar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Postagens</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Carregando...</p>}

      <form onSubmit={handleCreatePost}>
        <div>
          <label htmlFor="title">Título</label>
          <input
            type="text"
            id="title"
            placeholder="Título da Postagem"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="content">Conteúdo</label>
          <textarea
            id="content"
            placeholder="Conteúdo da Postagem"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar Postagem'}
        </button>
      </form>

      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p><strong>Autor:</strong> {post.author.username}</p>
            <button onClick={() => handleDeletePost(post._id)} disabled={loading}>
              {loading ? 'Excluindo...' : 'Excluir'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
