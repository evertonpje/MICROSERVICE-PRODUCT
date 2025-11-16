// src/App.jsx
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import UsuarioModule from './modules/usuario/UsuarioModule.jsx';
import ProdutoModule from './modules/produto/ProdutoModule.jsx';

function App() {
  return (
    <BrowserRouter>
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="font-bold text-foreground">Microservice Product</div>
          <nav className="flex items-center gap-1">
            <NavLink
              to="/usuario"
              className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground ${isActive ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}
            >
              Usuário
            </NavLink>
            <NavLink
              to="/produtos"
              className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground ${isActive ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}
            >
              Produtos
            </NavLink>
          </nav>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-6 mt-6 bg-card text-card-foreground rounded-lg border shadow-sm">

        <Routes>
          <Route path="/" element={<Navigate to="/usuario" replace />} />
          <Route path="/usuario" element={<UsuarioModule />} />
          <Route path="/produtos" element={<ProdutoModule />} />
          <Route path="*" element={<Navigate to="/usuario" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
