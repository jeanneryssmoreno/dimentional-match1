
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

const Home = () => (
  <div className="text-center py-10">
    <h2 className="text-3xl font-bold mb-4">Bienvenido al Juego de Memoria</h2>
    <p className="text-lg">Selecciona un tema para comenzar a jugar.</p>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
