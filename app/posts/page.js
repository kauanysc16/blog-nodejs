'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Função para buscar todas as postagens
async function fetchPosts() {
  try {
    const res = await fetch('/api/posts');
    if (!res.ok) throw new Error('Erro ao carregar postagens');
    return await res.json();
  } catch (error) {
    console.error('Erro na busca de postagens:', error);
    throw error;
  }
}

// Função para criar uma nova postagem
async function createPost(newPost, token) {
  try {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Se você precisar autenticar
      },
      body: JSON.stringify([newPost]), // Enviando como array, pois a API lida com arrays
    });

    if (!res.ok) {
      const data = await res.text();
      throw new Error(data || 'Erro ao criar postagem');
    }

    return await res.json();
  } catch (error) {
    console.error('Erro ao criar postagem:', error);
    throw error;
  }
}

// Componente para o formulário de criação de postagem
function PostForm({ onSubmit, loading }) {
  const [newPost, setNewPost] = useState({ title: '', content: '', author: {} });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setNewPost((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) {
      setError('Título e conteúdo são obrigatórios');
      return;
    }
    setError(null);
    try {
      await onSubmit(newPost);
      setNewPost({ title: '', content: '', author: {} });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <div className="form-group">
        <label htmlFor="title">Título</label>
        <input
          type="text"
          id="title"
          placeholder="Título da Postagem"
          value={newPost.title}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="content">Conteúdo</label>
        <textarea
          id="content"
          placeholder="Conteúdo da Postagem"
          value={newPost.content}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>
      {/* Opcionalmente, você pode adicionar um campo para o autor */}
      {/* <div className="form-group">
        <label htmlFor="author">Autor</label>
        <input
          type="text"
          id="author"
          placeholder="ID do Autor"
          value={newPost.author._id || ''}
          onChange={(e) => setNewPost((prev) => ({ ...prev, author: { _id: e.target.value } }))}
          className="form-control"
        />
      </div> */}
      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? 'Criando...' : 'Criar Postagem'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

// Componente para a lista de postagens
function PostList({ posts }) {
  return (
    <ul className="posts-list">
      {posts.length > 0 ? (
        posts.map((post) => (
          <li key={post._id} className="post-item">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p><strong>Autor:</strong> {post.author?.username || 'Desconhecido'}</p>
          </li>
        ))
      ) : (
        <p>Nenhuma postagem encontrada.</p>
      )}
    </ul>
  );
}

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleCreatePost = async (newPost) => {
    setLoading(true);
    const token = localStorage.getItem('token'); // Ajuste conforme necessário
    if (!token) {
      setError('Você precisa estar logado para criar uma postagem.');
      setLoading(false);
      return;
    }
    try {
      await createPost(newPost, token);
      const updatedPosts = await fetchPosts();
      setPosts(updatedPosts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="posts-container">
      <h1>Postagens</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Carregando...</p>}
      <PostForm onSubmit={handleCreatePost} loading={loading} />
      <PostList posts={posts} />
    </div>
  );
}
