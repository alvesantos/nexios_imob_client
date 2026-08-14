import { Navigate } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';
import { LoginLayout } from './components/LoginLayout';
import { useAuth } from './hooks/useAuth';
import { useLogin } from './hooks/useLogin';

export function LoginPage() {
  const { isAuthenticated } = useAuth();
  const { entrar, isLoading, erro } = useLogin();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <LoginLayout>
      <LoginForm onSubmit={entrar} isLoading={isLoading} erroServidor={erro} />
    </LoginLayout>
  );
}
