"use client";

import React, { useEffect, useState } from 'react';

function PostsPage() {
  // Estado para armazenar o título da nova postagem
  const [title, setTitle] = useState('');
  // Estado para armazenar o conteúdo da nova postagem
  const [content, setContent] = useState('');
  // Estado para armazenar a lista de postagens
  const [posts, setPosts] = useState([]);
  // Estado para armazenar mensagens de erro
  const [error, setError] = useState(null);
  // Estado para armazenar mensagens de sucesso
  const [message, setMessage] = useState(null);
  // Estado para indicar se a requisição está carregando
  const [loading, setLoading] = useState(false);
  // Estado para armazenar o token de autenticação (assumindo que você tem uma forma de obtê-lo)
  const [token, setToken] = useState('');

  // Efeito para buscar postagens quando o componente é montado
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Requisição para obter todas as postagens
        const response = await fetch('/api/posts');
        const data = await response.json();
        
        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
          throw new Error(data.error || 'Erro ao buscar postagens');
        }

        // Atualiza o estado com a lista de postagens
        setPosts(data);
      } catch (err) {
        // Define a mensagem de erro no estado
        setError(err.message);
      }
    };

    fetchPosts();
  }, []); // Executa o efeito apenas uma vez quando o componente é montado

  // Função para lidar com o envio do formulário de criação de postagem
  const handlePostSubmit = async (e) => {
    e.preventDefault(); // Impede o comportamento padrão de recarregar a página ao enviar o formulário
    setLoading(true); // Define o estado de carregamento como verdadeiro
    setError(null); // Limpa mensagens de erro
    setMessage(null); // Limpa mensagens de sucesso

    try {
      // Requisição para criar uma nova postagem
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, token }), // Envia os dados da postagem como JSON
      });

      const data = await response.json();

      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar postagem');
      }

      // Define a mensagem de sucesso no estado
      setMessage('Postagem criada com sucesso!');
      // Limpa os campos do formulário
      setTitle('');
      setContent('');
      // Adiciona a nova postagem à lista de postagens
      setPosts([...posts, data]);
    } catch (err) {
      // Define a mensagem de erro no estado
      setError(err.message);
    } finally {
      // Define o estado de carregamento como falso após a requisição
      setLoading(false);
    }
  };

  return (
    <div className="posts-page">
      <h1>Postagens</h1>

      {/* Exibe a mensagem de erro, se houver */}
      {error && <p className="error">{error}</p>}
      {/* Exibe a mensagem de sucesso, se houver */}
      {message && <p className="success">{message}</p>}

      {/* Formulário para criar uma nova postagem */}
      <form onSubmit={handlePostSubmit}>
        <div>
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)} // Atualiza o estado do título
            required // Torna o campo obrigatório
          />
        </div>
        <div>
          <label htmlFor="content">Conteúdo:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)} // Atualiza o estado do conteúdo
            required // Torna o campo obrigatório
          />
        </div>
        <button type="submit" disabled={loading}>
          {/* Mostra "Criando..." se a requisição estiver em andamento */}
          {loading ? 'Criando...' : 'Criar Postagem'}
        </button>
      </form>

      <h2>Lista de Postagens</h2>
      <ul>
        {/* Mapeia a lista de postagens e exibe cada uma */}
        {posts.map((post) => (
          <li key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostsPage;
