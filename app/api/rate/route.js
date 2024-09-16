import React, { useEffect, useState } from 'react';

function RatePostPage() {
  // Estado para armazenar as informações da postagem
  const [post, setPost] = useState(null);
  // Estado para armazenar a classificação selecionada (1-5 estrelas)
  const [stars, setStars] = useState(1);
  // Estado para armazenar o token de autenticação do usuário
  const [token, setToken] = useState(''); // Suponha que você tenha uma maneira de obter o token
  // Estado para armazenar mensagens de erro
  const [error, setError] = useState(null);
  // Estado para armazenar mensagens de sucesso
  const [message, setMessage] = useState(null);
  // Estado para indicar se a requisição está carregando
  const [loading, setLoading] = useState(false);
  // ID da postagem (substitua pelo ID real do post)
  const postId = 'post-id-here';

  // Efeito colateral para buscar os dados da postagem quando o componente é montado
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Requisição para buscar dados da postagem
        const response = await fetch(`/api/posts/${postId}`);
        const data = await response.json();

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
          throw new Error(data.error || 'Erro ao buscar postagem');
        }

        // Atualiza o estado com os dados da postagem
        setPost(data);
      } catch (err) {
        // Define a mensagem de erro no estado
        setError(err.message);
      }
    };

    fetchPost();
  }, [postId]);

  // Função para lidar com o envio da avaliação
  const handleRatingSubmit = async (e) => {
    e.preventDefault(); // Impede o comportamento padrão do formulário
    setLoading(true); // Define o estado de carregamento como verdadeiro
    setError(null); // Limpa mensagens de erro
    setMessage(null); // Limpa mensagens de sucesso

    try {
      // Requisição para enviar a avaliação
      const response = await fetch('/api/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, postId, stars }),
      });

      const data = await response.json();

      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao adicionar avaliação');
      }

      // Atualiza a mensagem de sucesso
      setMessage(data.message);

      // Atualiza o estado da postagem com a nova avaliação e média
      setPost((prevPost) => ({
        ...prevPost,
        averageRating: data.averageRating,
        ratings: [...prevPost.ratings, { user: token, stars }],
      }));
    } catch (err) {
      // Define a mensagem de erro no estado
      setError(err.message);
    } finally {
      setLoading(false); // Define o estado de carregamento como falso
    }
  };

  // Exibe uma mensagem de carregamento enquanto os dados da postagem não estiverem disponíveis
  if (!post) return <p>Carregando postagem...</p>;

  return (
    <div className="rate-post-page">
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p><strong>Média das Avaliações:</strong> {post.averageRating || 'Nenhuma avaliação ainda'}</p>

      {/* Exibe mensagens de erro, se houver */}
      {error && <p className="error">{error}</p>}
      {/* Exibe mensagens de sucesso, se houver */}
      {message && <p className="success">{message}</p>}

      {/* Formulário para enviar uma nova avaliação */}
      <form onSubmit={handleRatingSubmit}>
        <div>
          <label htmlFor="stars">Avaliação (1-5):</label>
          <input
            type="number"
            id="stars"
            value={stars}
            onChange={(e) => setStars(Number(e.target.value))}
            min="1"
            max="5"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Avaliação'}
        </button>
      </form>
    </div>
  );
}

export default RatePostPage;
