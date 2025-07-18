import { AuthProvider, useAuth } from '../context/AuthContext';
import { clientsDatabase } from '../data/clientsDatabase';
import LocalSEO from '../components/LocalSEO';
import AppLayout from '../components/layout/AppLayout';
import HomePage from '../components/HomePage';
import AdminPanel from '../components/AdminPanel';
import ClientArea from '../components/client/ClientArea';
import ClientLogin from '../components/ClientLogin';
import PaymentPage from '../components/PaymentPage';
import BenefitsPage from '../components/BenefitsPage';
import MedicalQuestionnaire from '../components/MedicalQuestionnaire';
import LeadCollection from '../components/LeadCollection';
import CheckoutCalculator from '../components/CheckoutCalculator';
import LocationPage from '../components/LocationPages';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
            <Route path="/questionario-medico" element={<MedicalQuestionnaire />} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}

import { BillingPeriod, CheckoutData } from '../types';

export default App;