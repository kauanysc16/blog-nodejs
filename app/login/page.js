"use client"; 

import React, { useState } from 'react';

function LoginPage() {
  // Estado para armazenar o email digitado pelo usuário
  const [email, setEmail] = useState('');
  // Estado para armazenar a senha digitada pelo usuário
  const [password, setPassword] = useState('');
  // Estado para armazenar mensagens de erro
  const [error, setError] = useState(null);
  // Estado para indicar se a requisição está carregando
  const [loading, setLoading] = useState(false);

  // Função para lidar com o envio do formulário de login
  const handleLogin = async (e) => {
    e.preventDefault(); // Impede o comportamento padrão de recarregar a página ao enviar o formulário
    setLoading(true); // Define o estado de carregamento como verdadeiro
    setError(null); // Limpa mensagens de erro

    try {
      // Requisição para a API de login
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // Envia os dados do formulário como JSON
      });

      // Converte a resposta para JSON
      const data = await response.json();

      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      // Salva o token no localStorage (ou em estado global, se preferir)
      localStorage.setItem('token', data.token);

      // Redireciona o usuário para a página do dashboard
      window.location.href = '/dashboard'; // Altere conforme necessário
    } catch (err) {
      // Define a mensagem de erro no estado
      setError(err.message);
    } finally {
      // Define o estado de carregamento como falso após a requisição
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      {/* Exibe a mensagem de erro, se houver */}
      {error && <p className="error">{error}</p>}
      {/* Formulário de login */}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Atualiza o estado do email
            required // Torna o campo obrigatório
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Atualiza o estado da senha
            required // Torna o campo obrigatório
          />
        </div>
        <button type="submit" disabled={loading}>
          {/* Mostra "Loading..." se a requisição estiver em andamento */}
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
