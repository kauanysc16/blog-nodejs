"use client"; // Adiciona essa linha para indicar que este é um Client Component

import { useState } from 'react';

const Rate = ({ postId }) => {
  const [stars, setStars] = useState(0);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRating = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const token = localStorage.getItem('token'); // Obtenha o token do localStorage

      if (!token) {
        setError('Token não encontrado. Faça login novamente.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, postId, stars }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Avaliação enviada com sucesso! Média atual: ${data.averageRating}`);
        setStars(0); // Limpa a seleção de estrelas após o envio
      } else {
        setError(data.error || 'Erro ao enviar avaliação');
      }
    } catch (error) {
      setError('Erro ao enviar avaliação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rate-container">
      <h1>Avaliar Postagem</h1>
      <div className="stars-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= stars ? 'selected' : ''}`}
            onClick={() => setStars(star)}
          >
            ★
          </span>
        ))}
      </div>
      <button onClick={handleRating} disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar Avaliação'}
      </button>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Rate;
