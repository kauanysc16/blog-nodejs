"use client"; // Adiciona essa linha para indicar que este é um Client Component

import { useState } from 'react';

const Rate = ({ postId }) => {
  // Estado para armazenar a quantidade de estrelas selecionadas
  const [stars, setStars] = useState(0);
  // Estado para armazenar mensagens de erro
  const [error, setError] = useState(null);
  // Estado para armazenar mensagens de sucesso
  const [message, setMessage] = useState(null);
  // Estado para indicar se a requisição está carregando
  const [loading, setLoading] = useState(false);

  // Função para lidar com o envio da avaliação
  const handleRating = async () => {
    setLoading(true); // Define o estado de carregamento como verdadeiro
    setError(null); // Limpa mensagens de erro
    setMessage(null); // Limpa mensagens de sucesso

    try {
      const token = localStorage.getItem('token'); // Obtém o token do localStorage

      // Verifica se o token está presente
      if (!token) {
        setError('Token não encontrado. Faça login novamente.');
        setLoading(false);
        return; // Encerra a função se o token não estiver presente
      }

      // Requisição para enviar a avaliação
      const response = await fetch('/api/rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, postId, stars }), // Envia os dados da avaliação como JSON
      });

      const data = await response.json();

      // Verifica se a resposta foi bem-sucedida
      if (response.ok) {
        // Define a mensagem de sucesso e limpa a seleção de estrelas
        setMessage(`Avaliação enviada com sucesso! Média atual: ${data.averageRating}`);
        setStars(0);
      } else {
        // Define a mensagem de erro, se houver
        setError(data.error || 'Erro ao enviar avaliação');
      }
    } catch (error) {
      // Define a mensagem de erro em caso de exceção
      setError('Erro ao enviar avaliação');
    } finally {
      // Define o estado de carregamento como falso após a requisição
      setLoading(false);
    }
  };

  return (
    <div className="rate-container">
      <h1>Avaliar Postagem</h1>
      <div className="stars-rating">
        {/* Mapeia as estrelas e aplica a classe 'selected' se a estrela estiver selecionada */}
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= stars ? 'selected' : ''}`}
            onClick={() => setStars(star)} // Atualiza o estado com a quantidade de estrelas selecionadas
          >
            ★
          </span>
        ))}
      </div>
      <button onClick={handleRating} disabled={loading}>
        {/* Mostra "Enviando..." se a requisição estiver em andamento */}
        {loading ? 'Enviando...' : 'Enviar Avaliação'}
      </button>
      {/* Exibe a mensagem de sucesso, se houver */}
      {message && <p>{message}</p>}
      {/* Exibe a mensagem de erro, se houver */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Rate;
