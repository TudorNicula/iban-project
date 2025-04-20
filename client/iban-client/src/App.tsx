import AppRouter from './routes/AppRouter';
import { AuthProvider } from './components/AuthProvider';

const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;
