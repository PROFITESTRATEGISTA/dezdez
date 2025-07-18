import React from 'react';
import MedicalQuestionnaire from '../components/MedicalQuestionnaire';
import { useNavigate } from 'react-router-dom';

const QuestionarioMedico: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1); // Volta para a página anterior
  };

  const handleComplete = (answers: Record<string, string | string[]>) => {
    console.log('Questionário completo:', answers);
    
    // Salvar respostas (em produção, enviaria para o backend)
    localStorage.setItem('medical_questionnaire_answers', JSON.stringify(answers));
    
    // Redirecionar para a página principal com mensagem de sucesso
    navigate('/', { 
      state: { 
        message: 'Questionário médico concluído com sucesso!',
        type: 'success' 
      } 
    });
  };

  return (
    <MedicalQuestionnaire 
      onClose={handleClose}
      onComplete={handleComplete}
    />
  );
};

export default QuestionarioMedico;