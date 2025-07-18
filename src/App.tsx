import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import HomePage from './components/HomePage';
import ClientArea from './components/client/ClientArea';
import AdminPanel from './components/AdminPanel';
import PaymentPage from './components/PaymentPage';
import QuestionarioMedico from './pages/QuestionarioMedico';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/area-cliente/*" element={<ClientArea />} />
            <Route path="/admin/*" element={<AdminPanel />} />
            <Route path="/pagamento" element={<PaymentPage />} />
            <Route path="/questionario-medico" element={<QuestionarioMedico />} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;