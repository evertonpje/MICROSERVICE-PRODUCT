// src/modules/usuario/UsuarioModule.jsx
import { useState } from 'react';
import Button from '../../components/ui/button.jsx';

function UsuarioModule() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('http://localhost:3002/criar-usuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.error || 'Erro ao registrar usuário');
          });
        }
        return response.json();
      })
      .then((data) => {
        setResponseMessage(`Usuário registrado com sucesso! Bem-vindo, ${data.name}.`);
      })
      .catch((error) => {
        setResponseMessage('Erro ao registrar usuário - front.');
        console.error('Erro:', error);
      });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Registrar Usuário</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">Nome</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="password" className="text-sm font-medium">Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        <Button type="submit">Registrar</Button>
      </form>
      {responseMessage && (
        <div className="text-sm text-foreground/80">{responseMessage}</div>
      )}
    </div>
  );
}

export default UsuarioModule;
