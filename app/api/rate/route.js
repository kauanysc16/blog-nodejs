import React, { useEffect, useState } from 'react';

function RatePostPage() {
  const [post, setPost] = useState(null);
  const [stars, setStars] = useState(1);
  const [token, setToken] = useState(''); // Suponha que você tenha uma maneira de obter o token
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const postId = 'post-id-here'; // Substitua pelo ID real do post

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao buscar postagem');
        }

        setPost(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPost();
  }, [postId]);

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch('/api/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, postId, stars }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao adicionar avaliação');
      }

      setMessage(data.message);
      setPost((prevPost) => ({
        ...prevPost,
        averageRating: data.averageRating,
        ratings: [...prevPost.ratings, { user: token, stars }],
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!post) return <p>Carregando postagem...</p>;

  return (
    <div className="rate-post-page">
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p><strong>Média das Avaliações:</strong> {post.averageRating || 'Nenhuma avaliação ainda'}</p>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

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
