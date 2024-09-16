"use client"; // Adiciona essa linha para indicar que este é um Client Component

import React, { useState } from 'react';

function RegisterPage() {
  // Estado para armazenar o nome de usuário
  const [username, setUsername] = useState('');
  // Estado para armazenar o email
  const [email, setEmail] = useState('');
  // Estado para armazenar a senha
  const [password, setPassword] = useState('');
  // Estado para armazenar mensagens de erro
  const [error, setError] = useState(null);
  // Estado para armazenar mensagens de sucesso
  const [message, setMessage] = useState(null);
  // Estado para indicar se a requisição está carregando
  const [loading, setLoading] = useState(false);

  // Função para lidar com o envio do formulário de registro
  const handleRegister = async (e) => {
    e.preventDefault(); // Impede o comportamento padrão de envio do formulário
    setLoading(true); // Define o estado de carregamento como verdadeiro
    setError(null); // Limpa mensagens de erro
    setMessage(null); // Limpa mensagens de sucesso

    try {
      // Requisição para o endpoint de registro com os dados do usuário
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }), // Envia os dados como JSON
      });

      // Obtém a resposta da requisição
      const data = await response.json();

      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao registrar usuário');
      }

      // Define a mensagem de sucesso se a requisição for bem-sucedida
      setMessage(data.message);
    } catch (err) {
      // Define a mensagem de erro se houver uma exceção
      setError(err.message);
    } finally {
      // Define o estado de carregamento como falso após a requisição
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <h1>Registro</h1>
      {/* Exibe a mensagem de erro, se houver */}
      {error && <p className="error">{error}</p>}
      {/* Exibe a mensagem de sucesso, se houver */}
      {message && <p className="success">{message}</p>}
      {/* Formulário de registro */}
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="username">Nome de Usuário:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Atualiza o estado com o valor do input
            required // Campo obrigatório
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Atualiza o estado com o valor do input
            required // Campo obrigatório
          />
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Atualiza o estado com o valor do input
            required // Campo obrigatório
          />
        </div>
        <button type="submit" disabled={loading}>
          {/* Mostra "Registrando..." se a requisição estiver em andamento */}
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
