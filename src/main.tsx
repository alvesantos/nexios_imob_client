import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { aplicarTema, temaAtual } from './hooks/useTheme.ts';
import './index.css';

// Antes do primeiro render: evita o flash de tema claro em quem escolheu escuro.
aplicarTema(temaAtual());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
